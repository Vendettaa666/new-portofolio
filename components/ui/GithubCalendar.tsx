// components/portofolio/GithubCalendar.tsx
import { getGitHubContributions, ContributionDay } from "@/lib/github";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { GitCommitHorizontal, ShieldCheck, Flame, TrendingUp, Star, Calendar } from "lucide-react";

// ─── Contribution color tiers ─────────────────────────────────────────────────
function getContributionColor(count: number) {
  if (count === 0)              return "bg-neutral-100 dark:bg-neutral-700/60";
  if (count >= 1 && count <= 3) return "bg-primary/30 dark:bg-primary/30";
  if (count >= 4 && count <= 6) return "bg-primary/55 dark:bg-primary/55";
  if (count >= 7 && count <= 9) return "bg-primary/80 dark:bg-primary/80";
  return "bg-primary dark:bg-primary";
}

// ─── GitHub logo ──────────────────────────────────────────────────────────────
function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  icon,
  highlight = false,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
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
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg mb-1 ${
        highlight ? "bg-primary/15" : "bg-neutral-100 dark:bg-neutral-700/50"
      }`}>
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
        {title}
      </span>
      <span className={`text-xl font-black font-mono leading-tight ${
        highlight ? "text-primary" : "text-neutral-900 dark:text-white"
      }`}>
        {value}
      </span>
    </SpotlightCard>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default async function GithubCalendar() {
  const stats = await getGitHubContributions();

  if (!stats) {
    return (
      <div className="rounded-2xl p-5 border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono">
        ⚠ Gagal memuat kontribusi GitHub.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 transition-all duration-200">

      {/* ── Primary accent line ── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-80" />

      <div className="relative p-6 md:p-8 flex flex-col gap-5">

        {/* ════════════════════════════════════════
            HEADER
        ════════════════════════════════════════ */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <GitHubLogo className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                GitHub Contributions
              </h3>
              <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-400">
                Aktivitas kontribusi setahun terakhir
              </p>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            STAT CARDS — 4 metrics
        ════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            title="Total"
            value={stats.total}
            icon={<GitCommitHorizontal className="h-3.5 w-3.5 text-primary" />}
            highlight
          />
          <StatCard
            title="Minggu Ini"
            value={stats.thisWeek}
            icon={<Calendar className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />}
          />
          <StatCard
            title="Hari Terbaik"
            value={stats.bestDay}
            icon={<Star className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />}
          />
          <StatCard
            title="Rata-rata/Hari"
            value={stats.average}
            icon={<TrendingUp className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />}
          />
        </div>

        {/* ════════════════════════════════════════
            CONTRIBUTION CALENDAR
        ════════════════════════════════════════ */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4">
          <div className="flex w-full justify-between gap-[2px] sm:gap-[3px]">
            {stats.weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="flex flex-col flex-1 gap-[2px] sm:gap-[3px]"
              >
                {week.contributionDays.map((day: ContributionDay, dayIndex: number) => (
                  <div
                    key={dayIndex}
                    title={`${day.contributionCount} kontribusi · ${day.date}`}
                    className={`w-full aspect-square rounded-[2px] transition-all duration-150 cursor-default
                      hover:scale-[1.4] hover:z-10 hover:ring-1 hover:ring-primary/60 hover:shadow-md
                      ${getContributionColor(day.contributionCount)}`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700/50">
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
              Lebih sedikit
            </span>
            <div className="flex gap-1">
              {[
                "bg-neutral-100 dark:bg-neutral-700/60",
                "bg-primary/30 dark:bg-primary/30",
                "bg-primary/55 dark:bg-primary/55",
                "bg-primary/80 dark:bg-primary/80",
                "bg-primary dark:bg-primary",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-[2px] ${cls}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
              Lebih banyak
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════ */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            <ShieldCheck className="h-3 w-3" />
            Powered by GitHub GraphQL API
          </div>
        </div>

      </div>
    </div>
  );
}