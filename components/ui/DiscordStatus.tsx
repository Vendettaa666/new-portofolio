// components/portofolio/DiscordStatus.tsx
"use client";

import { useEffect, useState } from "react";
import { Music2, Gamepad2, Monitor } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Activity = {
  name: string;
  details?: string;
  state?: string;
  type: number;
  application_id?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  timestamps?: { start?: number; end?: number };
};

type LanyardData = {
  discord_status: "online" | "idle" | "dnd" | "offline";
  discord_user: {
    username: string;
    display_name?: string;
    avatar: string;
    id: string;
    avatar_decoration_data?: {
      asset: string;
      sku_id: string;
    };
  };
  activities: Activity[];
  listening_to_spotify: boolean;
  spotify: {
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
    track_id: string;
    timestamps: { start: number; end: number };
  } | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const DISCORD_ID = "770242596945395712";

const STATUS_CONFIG = {
  online:  { color: "bg-green-500",  label: "Online",         ring: "shadow-[0_0_8px_rgba(34,197,94,0.5)]"  },
  idle:    { color: "bg-yellow-500", label: "Idle",           ring: "shadow-[0_0_8px_rgba(234,179,8,0.5)]"  },
  dnd:     { color: "bg-red-500",    label: "Do Not Disturb", ring: "shadow-[0_0_8px_rgba(239,68,68,0.5)]"   },
  offline: { color: "bg-neutral-500",label: "Offline",        ring: ""                                       },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getActivityIcon(type: number) {
  if (type === 0) return <Gamepad2 className="h-3.5 w-3.5 text-blue-400" />;
  if (type === 3) return <Monitor  className="h-3.5 w-3.5 text-purple-400" />;
  return <Monitor className="h-3.5 w-3.5 text-neutral-400" />;
}

function getActivityAssetUrl(activity: Activity): string | null {
  const asset = activity.assets?.large_image;
  if (!asset) return null;
  if (asset.startsWith("mp:external/")) {
    const parts = asset.replace("mp:external/", "");
    return `https://media.discordapp.net/external/${parts}`;
  }
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${asset}.png`;
  }
  return null;
}

// ─── Spotify Progress Bar ─────────────────────────────────────────────────────
function SpotifyProgress({ start, end }: { start: number; end: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calc = () => {
      const now = Date.now();
      const total = end - start;
      const elapsed = now - start;
      setProgress(Math.min((elapsed / total) * 100, 100));
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [start, end]);

  const toMMSS = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  const elapsed = Date.now() - start;
  const total   = end - start;

  return (
    <div className="mt-2.5">
      <div className="w-full h-1 rounded-full bg-neutral-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-neutral-500 font-mono">{toMMSS(elapsed)}</span>
        <span className="text-[10px] text-neutral-500 font-mono">{toMMSS(total)}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DiscordStatus() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res  = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load Discord status", err);
        setLoading(false);
      }
    };

    fetchStatus();
    const id = setInterval(fetchStatus, 10_000);
    return () => clearInterval(id);
  }, []);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 p-6">
        <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-32 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-3 w-20 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (!data) {
    return (
      <div className="rounded-3xl p-5 border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono">
        ⚠ Failed to load Discord status.
      </div>
    );
  }

  const status = STATUS_CONFIG[data.discord_status];
  const avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=128`;

  // Avatar decoration (bingkai/frame avatar)
  const decorationAsset = data.discord_user.avatar_decoration_data?.asset;
  const decorationUrl = decorationAsset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${decorationAsset}.png?size=160&passthrough=true`
    : null;

  // Filter out Spotify from activities
  const visibleActivities = data.activities.filter((a) => a.type !== 2);
  const mainActivity = visibleActivities[0] ?? null;

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 transition-all duration-200">

      {/* Dot pattern — same as HeroCard */}
      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative p-6 flex flex-col gap-5">

        {/* ── User row ── */}
        <div className="flex items-center gap-4">

          {/* Avatar + decoration frame + status dot */}
          <div className="relative flex-shrink-0 w-16 h-16">
            {/* Base avatar */}
            <img
              src={avatarUrl}
              alt={data.discord_user.username}
              className="w-16 h-16 rounded-full object-cover"
            />

            {/* Avatar decoration frame — layered on top */}
            {decorationUrl && (
              <img
                src={decorationUrl}
                alt="Avatar decoration"
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{ transform: "scale(1.15)" }}
              />
            )}

            {/* Status dot */}
            <div
              className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-800 ${status.color} ${status.ring}`}
            />
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
              {data.discord_user.display_name ?? data.discord_user.username}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              @{data.discord_user.username}
            </p>
          </div>

          {/* Status badge — mirrors STATUS:ONLINE from HeroCard */}
          <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold whitespace-nowrap
            ${data.discord_status === "online"  ? "border-green-500/20 bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : ""}
            ${data.discord_status === "idle"    ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-500" : ""}
            ${data.discord_status === "dnd"     ? "border-red-500/20 bg-red-500/10 text-red-400" : ""}
            ${data.discord_status === "offline" ? "border-neutral-700 bg-neutral-800 text-neutral-500" : ""}
          `}>
            {data.discord_status === "online" && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            )}
            {data.discord_status !== "online" && (
              <span className={`h-2 w-2 rounded-full ${status.color}`} />
            )}
            {status.label}
          </div>
        </div>

        {/* ── Spotify ── */}
        {data.listening_to_spotify && data.spotify && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-4 transition-all duration-200">
            <div className="flex items-center gap-3">
              {/* Album art */}
              <div className="relative flex-shrink-0">
                <img
                  src={data.spotify.album_art_url}
                  alt={data.spotify.album}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                {/* Spotify icon overlay */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Music2 className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-green-500/10">
                    <Music2 className="h-3 w-3 text-green-400" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-green-500">
                    Listening to Spotify
                  </span>
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {data.spotify.song}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {data.spotify.artist}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            {data.spotify.timestamps && (
              <SpotifyProgress
                start={data.spotify.timestamps.start}
                end={data.spotify.timestamps.end}
              />
            )}
          </div>
        )}

        {/* ── Activity (game/app) ── */}
        {!data.listening_to_spotify && mainActivity && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 p-4 transition-all duration-200">
            <div className="flex items-center gap-3">
              {/* App icon */}
              {(() => {
                const imgUrl = getActivityAssetUrl(mainActivity);
                return imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={mainActivity.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    {getActivityIcon(mainActivity.type)}
                  </div>
                );
              })()}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10">
                    {getActivityIcon(mainActivity.type)}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-400">
                    {mainActivity.type === 0 ? "Playing" : "Watching"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {mainActivity.name}
                </p>
                {mainActivity.details && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {mainActivity.details}
                  </p>
                )}
                {mainActivity.state && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {mainActivity.state}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Idle / no activity ── */}
        {!data.listening_to_spotify && !mainActivity && (
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-3.5 flex items-center gap-2.5 text-neutral-500 dark:text-neutral-400">
            <Monitor className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs">No current activity</span>
          </div>
        )}

      </div>
    </div>
  );
}