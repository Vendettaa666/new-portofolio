// components/portofolio/MonkeytypeStats.tsx
import Image from "next/image";
import { Keyboard, ShieldCheck, Flame, Calendar } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

// ─── ENV ──────────────────────────────────────────────────────────────────────
// Tambahkan di .env.local dan Vercel Environment Variables:
//   MONKEYTYPE_API_KEY=...
//   NEXT_PUBLIC_MONKEYTYPE_USERNAME=YourUsername   ← username publik Monkeytype kamu

// ─── Types ────────────────────────────────────────────────────────────────────
type PBEntry = {
  wpm: number;
  acc: number;
  raw?: number;
  consistency?: number;
};

type ProfileData = {
  name: string;
  addedAt: number;
  streak: number;
  maxStreak: number;
  xp: number;
  isPremium: boolean;
  discordAvatar?: string;
  discordId?: string;
  typingStats: {
    completedTests: number;
    startedTests: number;
    timeTyping: number;
  };
  personalBests: {
    time:  Record<string, PBEntry[]>;
    words: Record<string, PBEntry[]>;
  };
  allTimeLbs: {
    time: Record<string, Record<string, { rank: number; count: number }>>;
  };
};

// ─── Data Fetching ────────────────────────────────────────────────────────────
async function getProfileData(): Promise<ProfileData | null> {
  const apiKey   = process.env.MONKEYTYPE_API_KEY;
  const username = process.env.NEXT_PUBLIC_MONKEYTYPE_USERNAME;

  if (!apiKey || !username) {
    console.error(
      "[MonkeytypeStats] Missing MONKEYTYPE_API_KEY or NEXT_PUBLIC_MONKEYTYPE_USERNAME"
    );
    return null;
  }

  try {
    const res = await fetch(
      `https://api.monkeytype.com/users/${username}/profile`,
      {
        headers: { Authorization: `ApeKey ${apiKey}` },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`[MonkeytypeStats] profile error ${res.status}:`, body);
      return null;
    }

    const json = await res.json();
    return json.data as ProfileData;
  } catch (err) {
    console.error("[MonkeytypeStats] fetch failed:", err);
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatJoinDate(ms: number): string {
  return new Date(ms).toLocaleDateString("id-ID", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function topPercent(rank: number, count: number): string {
  if (!count) return "—";
  return ((rank / count) * 100).toFixed(2) + "%";
}

function getDiscordAvatarUrl(
  discordId?: string,
  discordAvatar?: string
): string | null {
  if (!discordId || !discordAvatar) return null;
  return `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.png?size=128`;
}

// ─── PB Column sub-component ──────────────────────────────────────────────────
function PBColumn({
  label,
  entries,
  keys,
  unit,
}: {
  label: string;
  entries: Record<string, PBEntry[]>;
  keys: string[];
  unit: string;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4 flex flex-col gap-3">
      <p className="text-[11px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
        {label}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((k) => {
          const entry = entries[k]?.[0];
          return (
            <div key={k} className="flex flex-col items-center gap-0.5">
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {k}{unit}
              </p>
              {entry ? (
                <>
                  <p className="text-xl font-black font-mono text-primary leading-tight">
                    {Math.round(entry.wpm)}
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                    {Math.round(entry.acc)}%
                  </p>
                </>
              ) : (
                <p className="text-xl font-bold font-mono text-neutral-300 dark:text-neutral-600 leading-tight">
                  —
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default async function MonkeytypeStats() {
  const profile = await getProfileData();

  if (!profile) {
    return (
      <div className="rounded-2xl p-5 border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono">
        ⚠ Failed to load Monkeytype stats. Cek{" "}
        <code className="text-red-300">MONKEYTYPE_API_KEY</code> dan{" "}
        <code className="text-red-300">NEXT_PUBLIC_MONKEYTYPE_USERNAME</code> di
        env.
      </div>
    );
  }

  const ts         = profile.typingStats;
  const pb         = profile.personalBests;
  const lbs        = profile.allTimeLbs?.time ?? {};
  const lb15       = lbs["15"]?.["english"];
  const lb60       = lbs["60"]?.["english"];
  const avatarUrl  = getDiscordAvatarUrl(profile.discordId, profile.discordAvatar);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 transition-all duration-200">
      <div className="relative p-6 md:p-8 flex flex-col gap-5">

        {/* ══════════════════════════════════════════
            HEADER
        ══════════════════════════════════════════ */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Keyboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Statistik Monkeytype
              </h3>
              <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-400">
                Statistik dan performa mengetik.
              </p>
            </div>
          </div>
          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono mt-1">
            {profile.name}
          </span>
        </div>

        {/* ══════════════════════════════════════════
            PROFILE — avatar · name · meta · 3 stats
        ══════════════════════════════════════════ */}
        <SpotlightCard
          spotlightColor="color-mix(in srgb, var(--theme-primary) 25%, transparent)"
          className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-5"
        >
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Avatar + identity */}
            <div className="flex items-center gap-4 sm:border-r border-neutral-200 dark:border-neutral-700 sm:pr-5 shrink-0">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={profile.name}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-primary/40 object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-black text-primary">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {profile.isPremium && (
                  <span className="absolute -bottom-1 -right-1 text-[9px] bg-primary text-white font-bold px-1.5 py-0.5 rounded-full leading-none">
                    PRO
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-base font-bold text-primary leading-tight">
                  {profile.name}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span>Bergabung {formatJoinDate(profile.addedAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <Flame className="h-3 w-3 shrink-0 text-primary" />
                  <span>
                    Streak Saat Ini:{" "}
                    <strong className="text-neutral-700 dark:text-neutral-200">
                      {profile.streak} hari
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* 3 big stats */}
            <div className="flex-1 grid grid-cols-3 divide-x divide-neutral-200 dark:divide-neutral-700">
              {[
                { label: "Tes Dimulai",         value: ts.startedTests.toLocaleString(),   highlight: false },
                { label: "Tes Selesai",          value: ts.completedTests.toLocaleString(), highlight: true  },
                { label: "Total Waktu Mengetik", value: formatTime(ts.timeTyping),           highlight: false },
              ].map(({ label, value, highlight }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center text-center px-2 py-1 gap-1"
                >
                  <p
                    className={`text-2xl font-black font-mono leading-none ${
                      highlight
                        ? "text-primary"
                        : "text-neutral-900 dark:text-white"
                    }`}
                  >
                    {value}
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wide leading-tight">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SpotlightCard>

        {/* ══════════════════════════════════════════
            LEADERBOARD RANK
        ══════════════════════════════════════════ */}
        {(lb15 || lb60) && (
          <SpotlightCard
            spotlightColor="color-mix(in srgb, var(--theme-primary) 25%, transparent)"
            className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4 flex flex-col sm:flex-row items-center gap-4"
          >
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 shrink-0 sm:w-40 text-center sm:text-left">
              Papan Peringkat<br />
              <span className="font-normal text-neutral-400">Bahasa Inggris</span>
            </p>

            <div className="flex-1 flex items-center justify-around gap-2 w-full">
              {lb15 && (
                <div className="flex flex-col items-center gap-0.5 text-center">
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    15 detik
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    teratas {topPercent(lb15.rank, lb15.count)}
                  </p>
                  <p className="text-2xl font-black font-mono text-primary leading-tight">
                    {lb15.rank.toLocaleString()}
                    <sup className="text-xs font-bold">{ordinal(lb15.rank)}</sup>
                  </p>
                </div>
              )}

              {lb15 && lb60 && (
                <div className="h-10 w-px bg-neutral-200 dark:bg-neutral-700" />
              )}

              {lb60 && (
                <div className="flex flex-col items-center gap-0.5 text-center">
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    60 detik
                  </p>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    teratas {topPercent(lb60.rank, lb60.count)}
                  </p>
                  <p className="text-2xl font-black font-mono text-primary leading-tight">
                    {lb60.rank.toLocaleString()}
                    <sup className="text-xs font-bold">{ordinal(lb60.rank)}</sup>
                  </p>
                </div>
              )}
            </div>
          </SpotlightCard>
        )}

        {/* ══════════════════════════════════════════
            PERSONAL BESTS — Time + Words
        ══════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row gap-3">
          <PBColumn
            label="Waktu"
            entries={pb.time  ?? {}}
            keys={["15", "30", "60", "120"]}
            unit="d"
          />
          <PBColumn
            label="Kata"
            entries={pb.words ?? {}}
            keys={["10", "25", "50", "100"]}
            unit="k"
          />
        </div>

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            <ShieldCheck className="h-3 w-3" />
            Powered by Monkeytype API · ISR cache 1h
          </div>
        </div>

      </div>
    </div>
  );
}