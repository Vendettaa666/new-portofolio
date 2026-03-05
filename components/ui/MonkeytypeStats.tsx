// components/portofolio/MonkeytypeStats.tsx
import { Keyboard, Zap, CheckCircle2, Clock, Target, TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type PBEntry = { wpm: number; acc: number; raw?: number; consistency?: number };

type MonkeytypeData = {
  typingStats: {
    completedTests: number;
    startedTests: number;
    timeTyping: number; // in seconds
  };
  personalBests: {
    [mode2: string]: PBEntry[];
  };
};

// ─── Data Fetching ────────────────────────────────────────────────────────────
async function getMonkeytypeData(): Promise<MonkeytypeData | null> {
  const apiKey = process.env.MONKEYTYPE_API_KEY;
  if (!apiKey) {
    console.error("[MonkeytypeStats] MONKEYTYPE_API_KEY is not set");
    return null;
  }

  const headers = { Authorization: `ApeKey ${apiKey}` };

  try {
    const [statsRes, pbRes] = await Promise.all([
      fetch("https://api.monkeytype.com/users/stats", {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch("https://api.monkeytype.com/users/personalBests?mode=time", {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!statsRes.ok || !pbRes.ok) {
      console.error(
        `[MonkeytypeStats] API error: stats=${statsRes.status} pb=${pbRes.status}`
      );
      return null;
    }

    const statsJson = await statsRes.json();
    const pbJson = await pbRes.json();

    return {
      typingStats: statsJson.data,
      personalBests: pbJson.data ?? {},
    };
  } catch (err) {
    console.error("[MonkeytypeStats] Fetch failed:", err);
    return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// All WPM tiers use theme primary color — consistent with the rest of the portfolio
function getWpmColor(_wpm: number): string {
  return "text-primary";
}

function getWpmBg(_wpm: number): string {
  return "bg-primary";
}

function getWpmLabel(wpm: number): string {
  if (wpm >= 120) return "Expert";
  if (wpm >= 80) return "Advanced";
  if (wpm >= 50) return "Intermediate";
  return "Beginner";
}

function getCompletionRate(completed: number, started: number): number {
  if (!started) return 0;
  return Math.round((completed / started) * 100);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default async function MonkeytypeStats() {
  const data = await getMonkeytypeData();

  if (!data) {
    return (
      <div className="rounded-2xl p-5 border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono">
        ⚠ Failed to load Monkeytype stats. Check{" "}
        <code className="text-red-300">MONKEYTYPE_API_KEY</code> in{" "}
        <code className="text-red-300">.env.local</code>
      </div>
    );
  }

  const { typingStats, personalBests } = data;

  const modes = [
    { key: "15", label: "15s", fullLabel: "Time 15s" },
    { key: "30", label: "30s", fullLabel: "Time 30s" },
    { key: "60", label: "60s", fullLabel: "Time 60s" },
    { key: "120", label: "2m", fullLabel: "Time 2m" },
  ];

  const topModes = modes
    .map((m) => ({
      ...m,
      wpm: personalBests[m.key]?.[0]?.wpm || 0,
      acc: personalBests[m.key]?.[0]?.acc || 0,
      raw: personalBests[m.key]?.[0]?.raw || 0,
    }))
    .filter((m) => m.wpm > 0);

  const highestWpm = topModes.length > 0 ? Math.max(...topModes.map((m) => m.wpm)) : 0;
  const bestMode = topModes.find((m) => m.wpm === highestWpm);
  const completionRate = getCompletionRate(
    typingStats.completedTests,
    typingStats.startedTests
  );
  const MAX_WPM = 200;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 shadow-sm hover:shadow-md transition-all duration-300">

      {/* ── Subtle top accent line ── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-80" />

      <div className="p-6 flex flex-col gap-5">

        {/* ══════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Keyboard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
                Monkeytype
              </h3>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-tight">
                Typing Performance
              </p>
            </div>
          </div>

          {/* Best WPM badge */}
          {highestWpm > 0 && (
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black font-mono leading-none text-primary">
                {Math.round(highestWpm)}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                best wpm
              </span>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            SKILL LEVEL BANNER
        ══════════════════════════════════════════ */}
        {highestWpm > 0 && (
          <div className="relative overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Skill Level
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary`}>
                {getWpmLabel(highestWpm)}
              </span>
            </div>

            {/* WPM progress bar */}
            <div className="relative h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getWpmBg(highestWpm)}`}
                style={{ width: `${Math.min((highestWpm / MAX_WPM) * 100, 100)}%` }}
              />
            </div>

            {/* Scale labels */}
            <div className="flex justify-between mt-1.5">
              {["0", "50", "100", "150", "200+"].map((label) => (
                <span key={label} className="text-[9px] text-neutral-400 font-mono">
                  {label}
                </span>
              ))}
            </div>

            {bestMode && (
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-2">
                Peak performance on{" "}
                <span className="text-neutral-600 dark:text-neutral-300 font-medium">
                  {bestMode.fullLabel}
                </span>{" "}
                · {Math.round(bestMode.acc)}% accuracy
              </p>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            STATS ROW — 4 metrics
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              icon: <CheckCircle2 className="h-3.5 w-3.5 text-primary" />,
              value: typingStats.completedTests?.toLocaleString() || "0",
              label: "Completed",
              highlight: true,
            },
            {
              icon: <Target className="h-3.5 w-3.5 text-primary/70" />,
              value: typingStats.startedTests?.toLocaleString() || "0",
              label: "Started",
              highlight: false,
            },
            {
              icon: <TrendingUp className="h-3.5 w-3.5 text-primary/70" />,
              value: `${completionRate}%`,
              label: "Finish Rate",
              highlight: false,
            },
            {
              icon: <Clock className="h-3.5 w-3.5 text-primary/70" />,
              value: typingStats.timeTyping ? formatTime(typingStats.timeTyping) : "—",
              label: "Time Typed",
              highlight: false,
            },
          ].map(({ icon, value, label, highlight }) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-all duration-200 ${
                highlight
                  ? "border-primary/30 bg-primary/5 dark:bg-primary/10 hover:border-primary/50"
                  : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              <div className={`flex items-center justify-center h-6 w-6 rounded-lg ${
                highlight ? "bg-primary/10" : "bg-neutral-100 dark:bg-neutral-700/50"
              }`}>
                {icon}
              </div>
              <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white leading-none">
                {value}
              </span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wider leading-none">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            PERSONAL BESTS — per mode breakdown
        ══════════════════════════════════════════ */}
        {topModes.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                Personal Bests by Mode
              </span>
              <span className="text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700">
                {topModes.length} modes
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {topModes.map((mode) => {
                const pct = Math.min((mode.wpm / MAX_WPM) * 100, 100);
                const isTopMode = mode.wpm === highestWpm;
                return (
                  <div
                    key={mode.key}
                    className={`relative overflow-hidden rounded-xl p-3 border transition-all duration-200 ${
                      isTopMode
                        ? "border-primary/30 bg-primary/5 dark:bg-primary/10 hover:border-primary/50"
                        : "border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 hover:border-neutral-300 dark:hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Mode label */}
                      <div className="flex flex-col w-12 shrink-0">
                        <span className={`text-xs font-bold font-mono ${isTopMode ? "text-primary" : "text-neutral-500 dark:text-neutral-400"}`}>
                          {mode.label}
                        </span>
                        {isTopMode && (
                          <span className="text-[8px] text-primary/70 uppercase tracking-wider font-semibold leading-none mt-0.5">
                            best
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getWpmBg(mode.wpm)}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* WPM + ACC */}
                      <div className="flex items-baseline gap-1.5 shrink-0">
                        <span className={`text-sm font-bold font-mono ${getWpmColor(mode.wpm)}`}>
                          {Math.round(mode.wpm)}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          wpm
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono ml-1">
                          {Math.round(mode.acc)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {topModes.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-4 text-center">
            <p className="text-xs text-neutral-400">
              Belum ada personal best tercatat. Ayo mulai mengetik! 🐒
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
          <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
            Monkeytype API · cache 1h
          </span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono">
            monkeytype.com
          </span>
        </div>

      </div>
    </div>
  );
}