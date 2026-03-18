// app/api/visitors/route.ts
//
// Sumber data: Umami Analytics
// Country code diambil dari Nominatim (bukan dari Umami) supaya selalu akurat.
//
// ENV:
//   UMAMI_API_KEY=uk_xxx          ← Cloud
//   UMAMI_WEBSITE_ID=d3412d96-...
//   — atau —
//   UMAMI_URL=https://umami.yourdomain.com
//   UMAMI_USERNAME=admin
//   UMAMI_PASSWORD=yourpassword
//   UMAMI_WEBSITE_ID=d3412d96-...

import { NextResponse } from "next/server";

export const revalidate = 300;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface VisitorEntry {
  id:           string;
  city:         string;
  country:      string;
  country_code: string;
  lat:          number;
  lon:          number;
  flag:         string;
  visits:       number;
}

interface UmamiMetric { x: string; y: number }

interface GeoResult {
  lat:          number;
  lon:          number;
  country_code: string; // ISO 3166-1 alpha-2, uppercase — dari Nominatim addressdetails
  country_name: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
async function getAuth(): Promise<{ baseUrl: string; headers: Record<string, string> } | null> {
  const apiKey   = process.env.UMAMI_API_KEY;
  const selfUrl  = process.env.UMAMI_URL;
  const username = process.env.UMAMI_USERNAME;
  const password = process.env.UMAMI_PASSWORD;

  if (apiKey) {
    return { baseUrl: "https://api.umami.is", headers: { "x-umami-api-key": apiKey } };
  }

  if (selfUrl && username && password) {
    try {
      const res = await fetch(`${selfUrl}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
        cache:   "no-store",
      });
      if (!res.ok) return null;
      const { token } = await res.json();
      return { baseUrl: selfUrl, headers: { Authorization: `Bearer ${token}` } };
    } catch { return null; }
  }
  return null;
}

// ─── Flag emoji ───────────────────────────────────────────────────────────────
function getFlagEmoji(code: string): string {
  if (!code || code.length !== 2 || code === "XX") return "🌐";
  return code.toUpperCase().split("").map((c) =>
    String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)
  ).join("");
}

// ─── Geocode — ambil lat/lon + country_code langsung dari Nominatim ───────────
// Pakai addressdetails=1 supaya Nominatim return address.country_code
// Cache in-memory per cold start (per server instance)
const geoCache = new Map<string, GeoResult | null>();

async function geocodeCity(city: string, hintCode?: string): Promise<GeoResult | null> {
  // Kalau Umami sudah kasih hint country code (misal dari format "Lumajang, ID"),
  // gunakan sebagai konteks pencarian supaya lebih akurat
  const cacheKey = `${city},${hintCode ?? ""}`;
  if (geoCache.has(cacheKey)) return geoCache.get(cacheKey)!;

  try {
    const query = hintCode && hintCode !== "XX"
      ? `${city}, ${hintCode}`
      : city;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`,
      {
        headers: { "User-Agent": "portfolio-visitor-map/1.0" },
        next:    { revalidate: 86400 }, // cache koordinat 1 hari
      }
    );

    if (!res.ok) { geoCache.set(cacheKey, null); return null; }
    const data = await res.json();
    if (!data?.[0]) { geoCache.set(cacheKey, null); return null; }

    const item        = data[0];
    // Nominatim return country_code dalam lowercase (mis. "id", "us")
    const rawCode     = item.address?.country_code ?? "";
    const countryCode = rawCode.toUpperCase() || "XX";
    const countryName = item.address?.country ?? codeToName.get(countryCode) ?? "Unknown";

    const result: GeoResult = {
      // 1 desimal (~10km) — level kota, tidak sampai desa
      lat:          Math.round(parseFloat(item.lat) * 10) / 10,
      lon:          Math.round(parseFloat(item.lon) * 10) / 10,
      country_code: countryCode,
      country_name: countryName,
    };

    geoCache.set(cacheKey, result);
    return result;
  } catch {
    geoCache.set(cacheKey, null);
    return null;
  }
}

// ─── Parse format city dari Umami ────────────────────────────────────────────
// Umami bisa return: "Lumajang" | "Lumajang, ID" | "Lumajang, Indonesia"
function parseMetricX(raw: string): { city: string; hintCode?: string } {
  const parts = raw.split(",").map((s) => s.trim());
  const city  = parts[0] ?? "";
  const part2 = parts[1] ?? "";

  if (!part2) return { city };

  // Sudah ISO 2-huruf → pakai langsung sebagai hint
  if (/^[A-Za-z]{2}$/.test(part2)) {
    return { city, hintCode: part2.toUpperCase() };
  }

  // Nama panjang → resolve ke code
  const code = nameToCode.get(part2.toLowerCase());
  return { city, hintCode: code };
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  if (!websiteId) {
    return NextResponse.json({ visitors: [], error: "UMAMI_WEBSITE_ID not set" });
  }

  const auth = await getAuth();
  if (!auth) {
    return NextResponse.json({ visitors: [], error: "Umami auth failed" });
  }

  const { baseUrl, headers } = auth;
  const now      = Date.now();
  const day30ago = now - 30 * 24 * 60 * 60 * 1000;
  const q        = `startAt=${day30ago}&endAt=${now}&limit=50`;

  try {
    const [cityRes, countryRes] = await Promise.all([
      fetch(`${baseUrl}/v1/websites/${websiteId}/metrics?${q}&type=city`,    { headers, next: { revalidate: 300 } }),
      fetch(`${baseUrl}/v1/websites/${websiteId}/metrics?${q}&type=country`, { headers, next: { revalidate: 300 } }),
    ]);

    if (!cityRes.ok) {
      console.error("[VisitorMap] city metrics failed:", cityRes.status);
      return NextResponse.json({ visitors: [], error: "city metrics failed" });
    }

    const cityMetrics:    UmamiMetric[] = await cityRes.json();
    const countryMetrics: UmamiMetric[] = countryRes.ok ? await countryRes.json() : [];

    const entries: VisitorEntry[] = [];

    await Promise.all(
      cityMetrics.slice(0, 30).map(async (metric) => {
        if (!metric.x) return;

        const { city, hintCode } = parseMetricX(metric.x);
        if (!city) return;

        // geocodeCity sekarang return country_code langsung dari Nominatim
        // → tidak bergantung pada Umami untuk info negara
        const geo = await geocodeCity(city, hintCode);
        if (!geo) return;

        entries.push({
          id:           `${city}-${geo.country_code}`.toLowerCase().replace(/\s+/g, "-"),
          city,
          country:      geo.country_name,
          country_code: geo.country_code,
          lat:          geo.lat,
          lon:          geo.lon,
          flag:         getFlagEmoji(geo.country_code),
          visits:       metric.y,
        });
      })
    );

    entries.sort((a, b) => b.visits - a.visits);

    return NextResponse.json({
      visitors:       entries,
      totalCountries: countryMetrics.length,
      totalVisits:    entries.reduce((s, e) => s + e.visits, 0),
    });
  } catch (err) {
    console.error("[VisitorMap] error:", err);
    return NextResponse.json({ visitors: [], error: String(err) });
  }
}

// ─── Country maps ─────────────────────────────────────────────────────────────
const COUNTRIES: [string, string][] = [
  ["ID","Indonesia"],["US","United States"],["GB","United Kingdom"],["DE","Germany"],
  ["FR","France"],["JP","Japan"],["CN","China"],["IN","India"],["AU","Australia"],
  ["CA","Canada"],["BR","Brazil"],["RU","Russia"],["KR","South Korea"],["NL","Netherlands"],
  ["SG","Singapore"],["MY","Malaysia"],["TH","Thailand"],["PH","Philippines"],
  ["VN","Vietnam"],["PK","Pakistan"],["BD","Bangladesh"],["IT","Italy"],["ES","Spain"],
  ["MX","Mexico"],["TR","Turkey"],["SA","Saudi Arabia"],["AE","United Arab Emirates"],
  ["ZA","South Africa"],["NG","Nigeria"],["EG","Egypt"],["AR","Argentina"],
  ["PL","Poland"],["SE","Sweden"],["NO","Norway"],["DK","Denmark"],["FI","Finland"],
  ["CH","Switzerland"],["AT","Austria"],["BE","Belgium"],["PT","Portugal"],
  ["NZ","New Zealand"],["TW","Taiwan"],["HK","Hong Kong"],["IL","Israel"],
  ["UA","Ukraine"],["CZ","Czech Republic"],["RO","Romania"],["HU","Hungary"],
  ["GR","Greece"],["IR","Iran"],["KH","Cambodia"],["MM","Myanmar"],["NP","Nepal"],
  ["LK","Sri Lanka"],["KZ","Kazakhstan"],["CO","Colombia"],["CL","Chile"],
];

const codeToName = new Map(COUNTRIES.map(([c, n]) => [c, n]));
const nameToCode = new Map(COUNTRIES.map(([c, n]) => [n.toLowerCase(), c]));