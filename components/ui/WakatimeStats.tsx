// components/portofolio/WakatimeStats.tsx
import SpotlightCard from "@/components/ui/SpotlightCard";
import { Clock, Activity, BarChart2, ShieldCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type WakaTimeLanguage = { name: string; percent: number };
type WakaTimeData = {
  data: {
    start: string;
    end: string;
    human_readable_daily_average: string;
    human_readable_total: string;
    best_day: { date: string; text: string };
    languages: WakaTimeLanguage[];
  };
};

// ─── Data Fetching ────────────────────────────────────────────────────────────
async function getWakatimeData(): Promise<WakaTimeData | null> {
  const apiKey = process.env.WAKATIME_API_KEY;

  if (!apiKey) {
    console.error("[WakatimeStats] WAKATIME_API_KEY is not set in .env.local");
    return null;
  }

  try {
    const res = await fetch(
      "https://wakatime.com/api/v1/users/current/stats/last_7_days",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
        },
        next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
      }
    );

    if (!res.ok) {
      console.error(
        `[WakatimeStats] API error: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("[WakatimeStats] Fetch failed:", err);
    return null;
  }
}

// ─── Language color map ───────────────────────────────────────────────────────
const LANG_META: Record<string, { bar: string; dot: string; label: string }> = {
  TypeScript: { bar: "bg-blue-500", dot: "bg-blue-400", label: "text-blue-400" },
  JavaScript: { bar: "bg-yellow-400", dot: "bg-yellow-400", label: "text-yellow-400" },
  Python: { bar: "bg-emerald-500", dot: "bg-emerald-400", label: "text-emerald-400" },
  CSS: { bar: "bg-purple-500", dot: "bg-purple-400", label: "text-purple-400" },
  JSON: { bar: "bg-neutral-500", dot: "bg-neutral-400", label: "text-neutral-400" },
  Kotlin: { bar: "bg-violet-500", dot: "bg-violet-400", label: "text-violet-400" },
  Bash: { bar: "bg-neutral-600", dot: "bg-neutral-500", label: "text-neutral-500" },
  HTML: { bar: "bg-orange-500", dot: "bg-orange-400", label: "text-orange-400" },
  Rust: { bar: "bg-red-500", dot: "bg-red-400", label: "text-red-400" },
  Go: { bar: "bg-cyan-500", dot: "bg-cyan-400", label: "text-cyan-400" },
  Default: { bar: "bg-blue-500", dot: "bg-blue-400", label: "text-blue-400" },
};

function getMeta(name: string) {
  return LANG_META[name] ?? LANG_META.Default;
}

// ─── Date helper ─────────────────────────────────────────────────────────────
function fmt(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString("en-US", opts);
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    // SpotlightCard dijadikan kontainer terluar agar efek mouse meng-cover seluruh area card
    <SpotlightCard spotlightColor="color-mix(in srgb, var(--theme-primary) 30%, transparent)"
      className={`flex flex-col gap-1 rounded-2xl p-4 border transition-all duration-200 ${
        highlight
          ? "border-primary/30 bg-primary/5 dark:bg-primary/10 hover:border-primary/50"
          : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
      }`}
    >
      <p
        className={`text-[10px] uppercase tracking-widest font-semibold ${
          highlight ? "text-primary/70" : "text-neutral-500 dark:text-neutral-400"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-sm font-bold font-mono leading-tight ${
          highlight ? "text-primary dark:text-white" : "text-neutral-900 dark:text-white"
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[11px] text-neutral-500 dark:text-neutral-500 mt-1">
          {sub}
        </p>
      )}
    </SpotlightCard>
  );
}

// ─── Main Server Component ────────────────────────────────────────────────────
export default async function WakatimeStats() {
  const stats = await getWakatimeData();

  if (!stats) {
    return (
      <div className="rounded-3xl p-5 border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono">
        ⚠ Failed to load WakaTime stats. Check{" "}
        <code className="text-red-300">WAKATIME_API_KEY</code> in{" "}
        <code className="text-red-300">.env.local</code>
      </div>
    );
  }

  const {
    start,
    end,
    human_readable_daily_average,
    human_readable_total,
    best_day,
    languages,
  } = stats.data;

  const topLangs = languages.slice(0, 5);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 transition-all duration-200">
      <div className="relative p-6 md:p-8 flex flex-col gap-6">
        
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Coding Activity
              </h3>
              <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-400">
                {fmt(start, { month: "short", day: "numeric" })} →{" "}
                {fmt(end, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* ── 4 Stat Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Start Date"
            value={fmt(start, { month: "short", day: "numeric" })}
            sub={String(new Date(start).getFullYear())}
          />
          <StatCard label="Week Total" value={human_readable_total} />
          <StatCard label="Daily Avg" value={human_readable_daily_average} />
          <StatCard
            label="Best Day"
            value={
              best_day?.date
                ? fmt(best_day.date, { month: "short", day: "numeric" })
                : "—"
            }
            sub={best_day?.text}
          />
        </div>

        {/* ── All-time row ── */}
        <SpotlightCard
          spotlightColor="color-mix(in srgb, var(--theme-primary) 30%, transparent)" // Fallback color yang lebih aman
          className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-4 sm:p-5 overflow-hidden transition-all duration-300 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              Total Coding Sejak Bergabung
            </span>
          </div>
          <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
            1,045 hrs 28 mins
          </span>
        </SpotlightCard>

        {/* ── Top Languages ── */}
        <SpotlightCard
          spotlightColor="color-mix(in srgb, var(--theme-primary) 30%, transparent)"
          className="w-full flex flex-col gap-5 rounded-2xl p-4 sm:p-5 overflow-hidden transition-all duration-300 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <BarChart2 className="h-3.5 w-3.5 text-green-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Top Languages
              </span>
            </div>
            <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-200 dark:bg-neutral-700/50 rounded-full px-2.5 py-0.5">
              {topLangs.length} langs
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {topLangs.map((lang) => {
              const m = getMeta(lang.name);
              return (
                <div key={lang.name} className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${m.dot}`} />
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 w-24 shrink-0 truncate">
                    {lang.name}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.bar}`}
                      style={{ width: `${lang.percent}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold font-mono w-10 text-right shrink-0 ${m.label}`}
                  >
                    {Math.round(lang.percent)}%
                  </span>
                </div>
              );
            })}
          </div>
        </SpotlightCard>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            <ShieldCheck className="h-3 w-3" />
            Powered by WakaTime API · ISR cache 1h
          </div>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
            {fmt(end, { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        
      </div>
    </div>
  );
}