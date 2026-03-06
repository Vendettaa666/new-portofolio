// lib/umami.ts
//
// ─── Untuk UMAMI CLOUD (analytics.umami.is) ───────────────────────────────────
// UMAMI_API_KEY=uk_xxxxxxxxxxxx       ← generate di Settings → API Keys
// UMAMI_WEBSITE_ID=d3412d96-...
//
// ─── Untuk SELF-HOSTED ────────────────────────────────────────────────────────
// UMAMI_URL=https://umami.yourdomain.com
// UMAMI_USERNAME=admin
// UMAMI_PASSWORD=yourpassword
// UMAMI_WEBSITE_ID=d3412d96-...

export type UmamiStats = {
  pageviews:  number;
  visitors:   number;
  visits:     number;
  bounces:    number;
  totaltime:  number;
};

export type PageviewPoint = { x: string; y: number };
export type MetricItem    = { x: string; y: number };

export type UmamiData = {
  stats:        UmamiStats;
  pageviews:    PageviewPoint[];
  sessions:     PageviewPoint[];
  topPages:     MetricItem[];
  topReferrers: MetricItem[];
  topBrowsers:  MetricItem[];
  activeNow:    number;
};

// ─── Resolve base URL + auth header ──────────────────────────────────────────
async function getAuthHeader(): Promise<{ baseUrl: string; headers: Record<string, string> } | null> {
  const apiKey    = process.env.UMAMI_API_KEY;
  const selfUrl   = process.env.UMAMI_URL;
  const username  = process.env.UMAMI_USERNAME;
  const password  = process.env.UMAMI_PASSWORD;

  // ── Umami Cloud: pakai API key langsung ──────────────────────────────────
  if (apiKey) {
    return {
      baseUrl: "https://api.umami.is",
      headers: { "x-umami-api-key": apiKey },
    };
  }

  // ── Self-hosted: login dulu, ambil JWT ───────────────────────────────────
  if (selfUrl && username && password) {
    try {
      const res = await fetch(`${selfUrl}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
        cache:   "no-store",
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("[Umami] login failed:", res.status, body);
        return null;
      }
      const { token } = await res.json();
      return {
        baseUrl: selfUrl,
        headers: { Authorization: `Bearer ${token}` },
      };
    } catch (err) {
      console.error("[Umami] login error:", err);
      return null;
    }
  }

  console.error("[Umami] No auth config found. Set UMAMI_API_KEY (Cloud) or UMAMI_URL + UMAMI_USERNAME + UMAMI_PASSWORD (self-hosted).");
  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export async function getUmamiData(): Promise<UmamiData | null> {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  if (!websiteId) {
    console.error("[Umami] UMAMI_WEBSITE_ID is not set");
    return null;
  }

  const auth = await getAuthHeader();
  if (!auth) return null;

  const { baseUrl, headers } = auth;

  const now      = Date.now();
  const day30ago = now - 30 * 24 * 60 * 60 * 1000;
  const tz       = "Asia/Jakarta";

  const qBase = `startAt=${day30ago}&endAt=${now}`;
  const qPv   = `${qBase}&unit=day&timezone=${encodeURIComponent(tz)}`;
  const qMet  = `${qBase}&limit=5`;

  const fetchOpts = (revalidate = 3600) => ({
    headers,
    next: { revalidate },
  });

  try {
    const [statsRes, pvRes, pagesRes, refRes, browserRes, activeRes] =
      await Promise.all([
        fetch(`${baseUrl}/v1/websites/${websiteId}/stats?${qBase}`,                { ...fetchOpts() }),
        fetch(`${baseUrl}/v1/websites/${websiteId}/pageviews?${qPv}`,              { ...fetchOpts() }),
        fetch(`${baseUrl}/v1/websites/${websiteId}/metrics?${qMet}&type=url`,      { ...fetchOpts() }),
        fetch(`${baseUrl}/v1/websites/${websiteId}/metrics?${qMet}&type=referrer`, { ...fetchOpts() }),
        fetch(`${baseUrl}/v1/websites/${websiteId}/metrics?${qMet}&type=browser`,  { ...fetchOpts() }),
        fetch(`${baseUrl}/v1/websites/${websiteId}/active`,                        { headers, cache: "no-store" }),
      ]);

    // Debug helper — log status codes on failure
    for (const [name, res] of [
      ["stats",   statsRes],
      ["pv",      pvRes],
      ["pages",   pagesRes],
      ["ref",     refRes],
      ["browser", browserRes],
      ["active",  activeRes],
    ] as [string, Response][]) {
      if (!res.ok) {
        const body = await res.clone().text();
        console.error(`[Umami] ${name} error ${res.status}:`, body);
      }
    }

    if (!statsRes.ok || !pvRes.ok) return null;

    const [statsJson, pvJson, pagesJson, refJson, browserJson, activeJson] =
      await Promise.all([
        statsRes.json(),
        pvRes.json(),
        pagesRes.ok   ? pagesRes.json()   : [],
        refRes.ok     ? refRes.json()     : [],
        browserRes.ok ? browserRes.json() : [],
        activeRes.ok  ? activeRes.json()  : { visitors: 0 },
      ]);

    // Umami Cloud wraps numbers in { value } objects
    const unbox = (v: unknown): number =>
      v && typeof v === "object" && "value" in (v as object)
        ? Number((v as { value: unknown }).value)
        : Number(v ?? 0);

    const raw = statsJson;
    const stats: UmamiStats = {
      pageviews: unbox(raw.pageviews),
      visitors:  unbox(raw.visitors),
      visits:    unbox(raw.visits),
      bounces:   unbox(raw.bounces),
      totaltime: unbox(raw.totaltime),
    };

    return {
      stats,
      pageviews:    pvJson.pageviews  ?? [],
      sessions:     pvJson.sessions   ?? [],
      topPages:     Array.isArray(pagesJson)   ? pagesJson   : [],
      topReferrers: Array.isArray(refJson)     ? refJson     : [],
      topBrowsers:  Array.isArray(browserJson) ? browserJson : [],
      activeNow:    activeJson.visitors ?? 0,
    };
  } catch (err) {
    console.error("[Umami] fetch failed:", err);
    return null;
  }
}