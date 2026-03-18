// app/api/visitors/route.ts — data dari Umami Analytics
import { NextResponse } from "next/server";

export const revalidate = 300; // cache 5 menit

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        cache: "no-store",
      });
      if (!res.ok) return null;
      const { token } = await res.json();
      return { baseUrl: selfUrl, headers: { Authorization: `Bearer ${token}` } };
    } catch { return null; }
  }
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getFlagEmoji(code: string): string {
  if (!code || code.length !== 2 || code === "XX") return "🌐";
  return code.toUpperCase().split("").map((c) =>
    String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65)
  ).join("");
}

function resolveCountryCode(raw: string): string {
  if (!raw) return "XX";
  const t = raw.trim();
  if (/^[A-Za-z]{2}$/.test(t)) return t.toUpperCase();
  return nameToCode.get(t.toLowerCase()) ?? "XX";
}

// In-memory geocode cache (per cold start)
const geoCache = new Map<string, { lat: number; lon: number } | null>();

async function geocodeCity(city: string, countryCode: string): Promise<{ lat: number; lon: number } | null> {
  const key = `${city},${countryCode}`;
  if (geoCache.has(key)) return geoCache.get(key)!;

  try {
    const q = encodeURIComponent(countryCode !== "XX" ? `${city}, ${countryCode}` : city);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      { headers: { "User-Agent": "portfolio-visitor-map/1.0" }, next: { revalidate: 86400 } }
    );
    if (!res.ok) { geoCache.set(key, null); return null; }
    const data = await res.json();
    if (!data?.[0]) { geoCache.set(key, null); return null; }

    // Bulatkan ke 1 desimal (~11km) — cukup untuk level kota
    const result = {
      lat: Math.round(parseFloat(data[0].lat) * 10) / 10,
      lon: Math.round(parseFloat(data[0].lon) * 10) / 10,
    };
    geoCache.set(key, result);
    return result;
  } catch {
    geoCache.set(key, null);
    return null;
  }
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  if (!websiteId) return NextResponse.json({ visitors: [], error: "UMAMI_WEBSITE_ID not set" });

  const auth = await getAuth();
  if (!auth) return NextResponse.json({ visitors: [], error: "Umami auth failed" });

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

        const parts       = metric.x.split(",").map((s) => s.trim());
        const city        = parts[0] ?? "";
        const rawCountry  = parts[1] ?? "";
        if (!city) return;

        const countryCode = resolveCountryCode(rawCountry);
        const countryName = codeToName.get(countryCode) ?? (rawCountry || "Unknown");
        const geo         = await geocodeCity(city, countryCode);
        if (!geo) return;

        entries.push({
          id:           `${city}-${countryCode}`.toLowerCase().replace(/\s+/g, "-"),
          city,
          country:      countryName,
          country_code: countryCode,
          lat:          geo.lat,
          lon:          geo.lon,
          flag:         getFlagEmoji(countryCode),
          visits:       metric.y,
        });
      })
    );

    entries.sort((a, b) => b.visits - a.visits);

    return NextResponse.json({
      visitors: entries,
      totalCountries: countryMetrics.length,
      totalVisits: entries.reduce((s, e) => s + e.visits, 0),
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
];

const codeToName = new Map(COUNTRIES.map(([c, n]) => [c, n]));
const nameToCode = new Map(COUNTRIES.map(([c, n]) => [n.toLowerCase(), c]));
