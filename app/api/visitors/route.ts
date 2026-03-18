// app/api/visitors/route.ts
// Menyimpan dan mengambil data lokasi pengunjung menggunakan Vercel KV (Redis)
//
// ENV yang dibutuhkan (otomatis terisi setelah connect Vercel KV di dashboard):
//   KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN, KV_REST_API_READ_ONLY_TOKEN

import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";

const KV_KEY      = "visitors:locations";
const MAX_ENTRIES = 500; // simpan maksimal 500 visitor terakhir

export interface VisitorEntry {
  ip:        string;
  city:      string;
  country:   string;
  country_code: string;
  lat:       number;
  lon:       number;
  timestamp: number;
  flag?:     string;
}

// ─── GET — ambil semua visitor ─────────────────────────────────────────────
export async function GET() {
  try {
    const raw = await kv.get<VisitorEntry[]>(KV_KEY);
    const visitors = raw ?? [];
    return Response.json({ visitors });
  } catch (err) {
    console.error("[Visitors GET]", err);
    return Response.json({ visitors: [] });
  }
}

// ─── POST — catat pengunjung baru ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // Ambil IP real dari header (Vercel/proxy)
    const ip =
      req.headers.get("x-real-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "127.0.0.1";

    // Skip localhost / private IP
    if (
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.")
    ) {
      return Response.json({ ok: true, skipped: true });
    }

    // Geolocation lookup — ipwho.is (gratis, no key)
    const geoRes = await fetch(`https://ipwho.is/${ip}`, {
      cache: "force-cache",
      next:  { revalidate: 86400 }, // cache 24 jam per IP
    });

    if (!geoRes.ok) {
      return Response.json({ ok: false, error: "geo failed" });
    }

    const geo = await geoRes.json();

    if (!geo.success || !geo.latitude || !geo.longitude) {
      return Response.json({ ok: false, error: "geo incomplete" });
    }

    const entry: VisitorEntry = {
      ip:           ip,
      city:         geo.city         ?? "Unknown",
      country:      geo.country      ?? "Unknown",
      country_code: geo.country_code ?? "XX",
      lat:          geo.latitude,
      lon:          geo.longitude,
      timestamp:    Date.now(),
      flag:         geo.flag?.emoji  ?? "",
    };

    // Baca existing, tambah entry baru, simpan (LIFO, capped)
    const existing = (await kv.get<VisitorEntry[]>(KV_KEY)) ?? [];

    // Deduplicate by IP — update timestamp jika IP sama
    const filtered = existing.filter((v) => v.ip !== ip);
    const updated  = [entry, ...filtered].slice(0, MAX_ENTRIES);

    await kv.set(KV_KEY, updated);

    return Response.json({ ok: true, entry });
  } catch (err) {
    console.error("[Visitors POST]", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}