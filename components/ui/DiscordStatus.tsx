// components/portofolio/DiscordStatus.tsx
"use client";

import { useEffect, useState } from "react";
import { Music2, Gamepad2, Monitor, ShieldCheck, Clock } from "lucide-react";

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
  online:  { dot: "bg-green-500",   badge: "border-green-500/20 bg-green-500/10 text-green-500",   label: "Online",         ring: "ring-green-500/30"  },
  idle:    { dot: "bg-yellow-500",  badge: "border-yellow-500/20 bg-yellow-500/10 text-yellow-500", label: "Idle",           ring: "ring-yellow-500/30" },
  dnd:     { dot: "bg-red-500",     badge: "border-red-500/20 bg-red-500/10 text-red-400",          label: "Do Not Disturb", ring: "ring-red-500/30"    },
  offline: { dot: "bg-neutral-500", badge: "border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-500", label: "Offline", ring: "" },
};

// ─── Discord Logo ─────────────────────────────────────────────────────────────
function DiscordLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.052a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

// ─── Elapsed timer ────────────────────────────────────────────────────────────
function ElapsedTimer({ start }: { start: number }) {
  const [elapsed, setElapsed] = useState(Date.now() - start);

  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - start), 1000);
    return () => clearInterval(id);
  }, [start]);

  const s = Math.floor(elapsed / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = h > 0
    ? [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":")
    : [m, sec].map((v) => String(v).padStart(2, "0")).join(":");

  return (
    <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 tabular-nums">
      {parts}
    </span>
  );
}

// ─── Spotify progress bar ─────────────────────────────────────────────────────
function SpotifyProgress({ start, end }: { start: number; end: number }) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed]   = useState(0);

  useEffect(() => {
    const calc = () => {
      const now     = Date.now();
      const total   = end - start;
      const el      = now - start;
      setProgress(Math.min((el / total) * 100, 100));
      setElapsed(el);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [start, end]);

  const fmt = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <div className="mt-3">
      <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tabular-nums">
          {fmt(elapsed)}
        </span>
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono tabular-nums">
          {fmt(end - start)}
        </span>
      </div>
    </div>
  );
}

// ─── Activity asset URL ───────────────────────────────────────────────────────
function getActivityAssetUrl(activity: Activity): string | null {
  const asset = activity.assets?.large_image;
  if (!asset) return null;
  if (asset.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${asset.replace("mp:external/", "")}`;
  }
  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${asset}.png`;
  }
  return null;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-lg bg-neutral-100 dark:bg-neutral-700/60 animate-pulse ${className}`} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DiscordStatus() {
  const [data, setData]       = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("[DiscordStatus]", err);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
    const id = setInterval(fetch_, 10_000);
    return () => clearInterval(id);
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 p-6 md:p-8">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-80" />
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div className="rounded-3xl p-5 border border-red-500/20 bg-red-500/5 text-red-400 text-sm font-mono">
        ⚠ Failed to load Discord status.
      </div>
    );
  }

  const status       = STATUS_CONFIG[data.discord_status];
  const avatarUrl    = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=128`;
  const decorUrl     = data.discord_user.avatar_decoration_data?.asset
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${data.discord_user.avatar_decoration_data.asset}.png?size=160&passthrough=true`
    : null;

  // Activities — exclude Spotify (type 2)
  const visibleActivities = data.activities.filter((a) => a.type !== 2);

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
              <DiscordLogo className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Discord Status
              </h3>
              <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-400">
                Real-time presence via Lanyard
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
              Live
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════
            USER PROFILE CARD
        ════════════════════════════════════════ */}
        <div className="flex items-center gap-4 p-4 rounded-2xl
          border border-neutral-200 dark:border-neutral-700
          bg-neutral-50 dark:bg-neutral-800/50">

          {/* Avatar + decoration + status dot */}
          <div className="relative shrink-0 w-16 h-16">
            <img
              src={avatarUrl}
              alt={data.discord_user.username}
              className={`w-16 h-16 rounded-full object-cover ring-2 ${status.ring}`}
            />
            {decorUrl && (
              <img
                src={decorUrl}
                alt=""
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                style={{ transform: "scale(1.15)" }}
              />
            )}
            {/* Status dot */}
            <span
              className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-neutral-900 ${status.dot}`}
            />
          </div>

          {/* Name + username */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
              {data.discord_user.display_name ?? data.discord_user.username}
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate mt-0.5">
              @{data.discord_user.username}
            </p>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-1.5 mt-2 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}>
              {data.discord_status === "online" ? (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
              ) : (
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              )}
              {status.label}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            SPOTIFY — listening now
        ════════════════════════════════════════ */}
        {data.listening_to_spotify && data.spotify && (
          <a
            href={`https://open.spotify.com/track/${data.spotify.track_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border transition-all duration-200
              border-neutral-200 dark:border-neutral-700
              bg-neutral-50 dark:bg-neutral-800/50
              hover:border-primary/30 dark:hover:border-primary/30
              hover:bg-primary/5 dark:hover:bg-primary/5
              p-4"
          >
            <div className="flex items-center gap-3">
              {/* Album art */}
              <div className="relative shrink-0">
                <img
                  src={data.spotify.album_art_url}
                  alt={data.spotify.album}
                  className="w-12 h-12 rounded-xl object-cover shadow-md
                    group-hover:scale-105 transition-transform duration-200"
                />
                {/* Spotify dot */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow">
                  <Music2 className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Music2 className="h-3 w-3 text-primary shrink-0" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Listening to Spotify
                  </span>
                </div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate
                  group-hover:text-primary transition-colors duration-150">
                  {data.spotify.song}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {data.spotify.artist}
                  <span className="text-neutral-300 dark:text-neutral-600"> · {data.spotify.album}</span>
                </p>
              </div>

              {/* Arrow */}
              <svg className="h-4 w-4 shrink-0 text-neutral-300 dark:text-neutral-600
                group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Progress bar */}
            {data.spotify.timestamps && (
              <SpotifyProgress
                start={data.spotify.timestamps.start}
                end={data.spotify.timestamps.end}
              />
            )}
          </a>
        )}

        {/* ════════════════════════════════════════
            ACTIVITIES — game / app / watching
            Shows ALL visible activities, not just first
        ════════════════════════════════════════ */}
        {!data.listening_to_spotify && visibleActivities.length > 0 && (
          <div className="flex flex-col gap-2">
            {visibleActivities.map((activity, idx) => {
              const imgUrl    = getActivityAssetUrl(activity);
              const isGame    = activity.type === 0;
              const isWatch   = activity.type === 3;
              const typeLabel = isGame ? "Playing" : isWatch ? "Watching" : "Using";
              const TypeIcon  = isGame ? Gamepad2 : Monitor;

              return (
                <div
                  key={`${activity.name}-${idx}`}
                  className="flex items-start gap-3 p-4 rounded-2xl
                    border border-neutral-200 dark:border-neutral-700
                    bg-neutral-50 dark:bg-neutral-800/50
                    transition-all duration-200"
                >
                  {/* App icon */}
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={activity.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <TypeIcon className="h-5 w-5 text-primary" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Type label */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <TypeIcon className="h-3 w-3 text-primary shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                        {typeLabel}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {activity.name}
                    </p>

                    {activity.details && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {activity.details}
                      </p>
                    )}
                    {activity.state && (
                      <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
                        {activity.state}
                      </p>
                    )}

                    {/* Elapsed timer if timestamps available */}
                    {activity.timestamps?.start && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock className="h-3 w-3 text-neutral-400 dark:text-neutral-500 shrink-0" />
                        <ElapsedTimer start={activity.timestamps.start} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════════════
            IDLE — no activity
        ════════════════════════════════════════ */}
        {!data.listening_to_spotify && visibleActivities.length === 0 && (
          <div className="flex items-center gap-3 p-4 rounded-2xl
            border border-neutral-200 dark:border-neutral-700
            bg-neutral-50 dark:bg-neutral-800/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-700/50 shrink-0">
              <Monitor className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                No current activity
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Not doing anything right now
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════ */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
            <ShieldCheck className="h-3 w-3" />
            Powered by Lanyard API · Updates every 10s
          </div>
        </div>

      </div>
    </div>
  );
}