// components/portofolio/UmamiStats.tsx
import { getUmamiData, PageviewPoint, MetricItem } from "@/lib/umami";
import SpotlightCard from "@/components/ui/SpotlightCard";
import {
  BarChart2,
  Eye,
  Users,
  MousePointerClick,
  Clock,
  TrendingUp,
  ShieldCheck,
  Globe,
  ExternalLink,
} from "lucide-react";

// ─── Umami Logo ───────────────────────────────────────────────────────────────
function UmamiLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="currentColor">
      <path d="M20 2C10.06 2 2 10.06 2 20s8.06 18 18 18 18-8.06 18-18S29.94 2 20 2zm0 4c7.73 0 14 6.27 14 14 0 5.97-3.73 11.07-9 13.13V28c0-2.21-1.79-4-4-4h-2c-2.21 0-4 1.79-4 4v5.13C9.73 31.07 6 25.97 6 20c0-7.73 6.27-14 14-14zm-2 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm4 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function bounceRate(bounces: number, visits: number): string {
  if (!visits) return "0%";
  return `${Math.round((bounces / visits) * 100)}%`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  highlight = false,
}: {
  label:     string;
  value:     string;
  icon:      React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <SpotlightCard
      spotlightColor="color-mix(in srgb, var(--theme-primary) 30%, transparent)"
      className={`flex flex-col gap-1 rounded-2xl p-4 border transition-all duration-200 ${
        highlight
          ? "border-primary/30 bg-primary/5 dark:bg-primary/10 hover:border-primary/50"
          : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600"
      }`}
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg mb-0.5 ${
        highlight ? "bg-primary/15" : "bg-neutral-100 dark:bg-neutral-700/50"
      }`}>
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
        {label}
      </span>
      <span className={`text-xl font-black font-mono leading-tight ${
        highlight ? "text-primary" : "text-neutral-900 dark:text-white"
      }`}>
        {value}
      </span>
    </SpotlightCard>
  );
}

// ─── Bar Chart (pure CSS) ─────────────────────────────────────────────────────
function BarChart({
  data,
  sessions,
}: {
  data:     PageviewPoint[];
  sessions: PageviewPoint[];
}) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-28 text-xs text-neutral-400">
      Tidak ada data
    </div>
  );

  const maxY = Math.max(...data.map((d) => d.y), 1);

  // show every Nth label to avoid crowding
  const labelStep = Math.ceil(data.length / 7);

  return (
    <div className="flex flex-col gap-2">
      {/* Chart area */}
      <div className="flex items-end gap-[2px] sm:gap-[3px] h-24 w-full">
        {data.map((point, i) => {
          const pvH   = Math.max((point.y / maxY) * 100, 2);
          const sessY = sessions[i]?.y ?? 0;
          const sesH  = Math.max((sessY / maxY) * 100, 0);

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end gap-[1px] h-full group relative"
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                <div className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900
                  text-[10px] font-mono rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl">
                  <p className="font-bold">{formatDate(point.x)}</p>
                  <p className="text-primary">{point.y.toLocaleString()} views</p>
                  {sessY > 0 && <p className="text-neutral-400 dark:text-neutral-500">{sessY.toLocaleString()} sessions</p>}
                </div>
                <div className="w-1.5 h-1.5 rotate-45 bg-neutral-900 dark:bg-neutral-100 -mt-[3px]" />
              </div>

              {/* Sessions bar (behind) */}
              {sesH > 0 && (
                <div
                  className="w-full rounded-t-[2px] bg-primary/20 dark:bg-primary/20 absolute bottom-0"
                  style={{ height: `${sesH}%` }}
                />
              )}

              {/* Pageviews bar */}
              <div
                className="w-full rounded-t-[2px] bg-primary/70 dark:bg-primary/60
                  group-hover:bg-primary transition-colors duration-150 relative"
                style={{ height: `${pvH}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex items-center gap-[2px] sm:gap-[3px] w-full">
        {data.map((point, i) => (
          <div key={i} className="flex-1 text-center">
            {i % labelStep === 0 && (
              <span className="text-[8px] text-neutral-400 dark:text-neutral-600 font-mono">
                {formatDate(point.x).split(" ")[0]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 justify-end">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/70" />
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">Pageviews</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/20" />
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">Sessions</span>
        </div>
      </div>
    </div>
  );
}

// ─── Metric Row List (pages / referrers) ──────────────────────────────────────
function MetricList({
  items,
  icon,
  emptyText,
}: {
  items:     MetricItem[];
  icon:      React.ReactNode;
  emptyText: string;
}) {
  if (!items.length) {
    return (
      <p className="text-xs text-neutral-400 dark:text-neutral-600 italic py-2 text-center">
        {emptyText}
      </p>
    );
  }

  const maxY = Math.max(...items.map((i) => i.y), 1);

  return (
    <div className="flex flex-col gap-2">
      {items.slice(0, 5).map((item, idx) => {
        const pct = Math.round((item.y / maxY) * 100);
        const label = item.x.length > 32 ? item.x.slice(0, 30) + "…" : item.x;

        return (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-neutral-300 dark:text-neutral-600 w-3 shrink-0 text-right">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[70%]">
                  {label || "(direct)"}
                </span>
                <span className="text-xs font-mono font-bold text-primary ml-2 shrink-0">
                  {item.y.toLocaleString()}
                </span>
              </div>
              <div className="h-1 rounded-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/60 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default async function UmamiStats() {
  const data = await getUmamiData();

  if (!data) {
    return (
      <div className="rounded-2xl p-5 border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono">
        ⚠ Gagal memuat statistik Umami. Cek{" "}
        <code className="text-red-300">UMAMI_URL</code>,{" "}
        <code className="text-red-300">UMAMI_USERNAME</code>,{" "}
        <code className="text-red-300">UMAMI_PASSWORD</code>, dan{" "}
        <code className="text-red-300">UMAMI_WEBSITE_ID</code> di env.
      </div>
    );
  }

  const { stats, pageviews, sessions, topPages, topReferrers, topBrowsers, activeNow } = data;
  const avgDuration = stats.visits > 0 ? stats.totaltime / stats.visits : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm
      border border-neutral-200 dark:border-neutral-700
      bg-white dark:bg-neutral-800/50
      transition-all duration-200">

      {/* ── Primary accent line ── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-80" />

      <div className="relative p-6 md:p-8 flex flex-col gap-5">

        {/* ════════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BarChart2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Website Analytics
              </h3>
              <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-400">
                30 hari terakhir · via Umami
              </p>
            </div>
          </div>

          {/* Active now badge */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
              {activeNow} online
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════
            STAT CARDS — 4 metrics
        ════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Pageviews"
            value={formatNum(stats.pageviews)}
            icon={<Eye className="h-3.5 w-3.5 text-primary" />}
            highlight
          />
          <StatCard
            label="Pengunjung"
            value={formatNum(stats.visitors)}
            icon={<Users className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />}
          />
          <StatCard
            label="Bounce Rate"
            value={bounceRate(stats.bounces, stats.visits)}
            icon={<MousePointerClick className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />}
          />
          <StatCard
            label="Avg. Durasi"
            value={formatDuration(avgDuration * 1000)}
            icon={<Clock className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />}
          />
        </div>

        {/* ════════════════════════════════════════
            BAR CHART — pageviews 30 days
        ════════════════════════════════════════ */}
        <SpotlightCard
          spotlightColor="color-mix(in srgb, var(--theme-primary) 20%, transparent)"
          className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                Pageviews — 30 Hari
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-700/60 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700">
              {pageviews.length} days
            </span>
          </div>
          <BarChart data={pageviews} sessions={sessions} />
        </SpotlightCard>

        {/* ════════════════════════════════════════
            TOP PAGES + TOP REFERRERS — 2 columns
        ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Top Pages */}
          <SpotlightCard
            spotlightColor="color-mix(in srgb, var(--theme-primary) 20%, transparent)"
            className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                Halaman Teratas
              </span>
            </div>
            <MetricList
              items={topPages}
              icon={<Globe className="h-3 w-3 text-primary" />}
              emptyText="Belum ada data halaman"
            />
          </SpotlightCard>

          {/* Top Referrers */}
          <SpotlightCard
            spotlightColor="color-mix(in srgb, var(--theme-primary) 20%, transparent)"
            className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                Sumber Trafik
              </span>
            </div>
            <MetricList
              items={topReferrers}
              icon={<ExternalLink className="h-3 w-3 text-primary" />}
              emptyText="Belum ada data referrer"
            />
          </SpotlightCard>
        </div>

        {/* ════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════ */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            <ShieldCheck className="h-3 w-3" />
            Powered by Umami Analytics · ISR cache 1h
          </div>
          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
            {stats.visits.toLocaleString()} visits total
          </span>
        </div>

      </div>
    </div>
  );
}