// app/api/visitors/route.ts
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const KV_KEY = process.env.NODE_ENV === "development" 
  ? "visitors:locations:dev" 
  : "visitors:locations";
const MAX_ENTRIES = 500;

const TEST_IPS = [
  "114.125.0.1",
  "36.82.0.1",
  "180.244.0.1",
  "103.28.0.1",
  "114.4.0.1",
];

// ─── Geo lookup ───────────────────────────────────────────────────────────────
async function fetchGeo(ip: string): Promise<{
  city: string; country: string; country_code: string;
  lat: number; lon: number; flag: string;
} | null> {
  // Provider 1: ipapi.co (HTTPS, reliable)
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const d = await res.json();
      if (d.latitude && d.longitude && !d.error) {
        return {
          city:         d.city ?? d.region ?? "Unknown",
          country:      d.country_name ?? "Unknown",
          country_code: d.country_code ?? "XX",
          lat:          d.latitude,
          lon:          d.longitude,
          flag:         getFlagEmoji(d.country_code ?? ""),
        };
      }
    }
  } catch { /* try next */ }

  // Provider 2: freeipapi.com (HTTPS, no key)
  try {
    const res = await fetch(`https://freeipapi.com/api/json/${ip}`, {
      next: { revalidate: 0 },
    });
    if (res.ok) {
      const d = await res.json();
      if (d.latitude && d.longitude) {
        return {
          city:         d.cityName    ?? d.regionName ?? "Unknown",
          country:      d.countryName ?? "Unknown",
          country_code: d.countryCode ?? "XX",
          lat:          d.latitude,
          lon:          d.longitude,
          flag:         getFlagEmoji(d.countryCode ?? ""),
        };
      }
    }
  } catch { /* fail */ }

  return null;
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export interface VisitorEntry {
  ip:           string;
  city:         string;
  country:      string;
  country_code: string;
  lat:          number;
  lon:          number;
  timestamp:    number;
  flag?:        string;
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const raw      = await redis.get<VisitorEntry[]>(KV_KEY);
    const visitors = raw ?? [];
    return Response.json({ visitors });
  } catch (err) {
    console.error("[Visitors GET]", err);
    return Response.json({ visitors: [] });
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const isDev  = process.env.NODE_ENV === "development";
    const params = req.nextUrl.searchParams;

    // Seed mode (dev only)
    if (isDev && params.get("seed") === "1") {
      const added: VisitorEntry[] = [];

      for (const testIp of TEST_IPS) {
        try {
          const geo = await fetchGeo(testIp);
          if (!geo) continue;
          added.push({
            ip:           testIp,
            city:         geo.city,
            country:      geo.country,
            country_code: geo.country_code,
            lat:          Math.round(geo.lat * 10) / 10,
            lon:          Math.round(geo.lon * 10) / 10,
            timestamp:    Date.now() - Math.floor(Math.random() * 3600000),
            flag:         geo.flag,
          });
        } catch { /* skip */ }
      }

      await redis.set(KV_KEY, added);
      return Response.json({ ok: true, seeded: added.length, entries: added });
    }

    // Clear mode (dev only)
    if (isDev && params.get("clear") === "1") {
      await redis.del(KV_KEY);
      return Response.json({ ok: true, cleared: true });
    }

    // Normal flow
    const testIpParam = isDev ? params.get("testip") : null;

    const ip = testIpParam
      ?? req.headers.get("x-real-ip")
      ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? "127.0.0.1";

    // Skip local IP
    if (!testIpParam && (
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.")
    )) {
      return Response.json({ ok: true, skipped: true, reason: "local IP" });
    }

    const geo = await fetchGeo(ip);
    if (!geo) return Response.json({ ok: false, error: "geo lookup failed" });

    const entry: VisitorEntry = {
      ip,
      city:         geo.city,
      country:      geo.country,
      country_code: geo.country_code,
      lat:          Math.round(geo.lat * 10) / 10,
      lon:          Math.round(geo.lon * 10) / 10,
      timestamp:    Date.now(),
      flag:         geo.flag,
    };

    const existing = (await redis.get<VisitorEntry[]>(KV_KEY)) ?? [];
    const filtered = existing.filter((v) => v.ip !== ip);
    const updated  = [entry, ...filtered].slice(0, MAX_ENTRIES);
    await redis.set(KV_KEY, updated);

    return Response.json({ ok: true, entry });
  } catch (err) {
    console.error("[Visitors POST]", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
