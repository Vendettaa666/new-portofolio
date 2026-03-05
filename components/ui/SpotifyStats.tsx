'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NowPlayingData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album?: string;
  albumImageUrl: string;
  songUrl: string;
}

interface Track {
  title: string;
  artist: string;
  album?: string;
  albumImageUrl: string;
  songUrl: string;
  playedAt?: string;
}

interface SpotifyState {
  nowPlaying: NowPlayingData | null;
  recentTracks: Track[];
}

// ─── Spotify Logo SVG ─────────────────────────────────────────────────────────
function SpotifyLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

// ─── Animated music bars ──────────────────────────────────────────────────────
function MusicBars({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-2.5' : 'h-3.5';
  const w = size === 'sm' ? 'w-3' : 'w-4';
  return (
    <span className={`flex items-end gap-[2px] ${h} ${w} shrink-0`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-primary"
          style={{
            animation: 'mtbar 0.85s ease-in-out infinite',
            animationDelay: `${i * 0.17}s`,
          }}
        />
      ))}
    </span>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`rounded-lg bg-neutral-100 dark:bg-neutral-700/60 animate-pulse ${className}`} />
  );
}

// ─── Relative time ────────────────────────────────────────────────────────────
function relativeTime(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SpotifyStats() {
  const [state, setState]     = useState<SpotifyState>({ nowPlaying: null, recentTracks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resNow, resHistory] = await Promise.all([
          fetch('/api/spotify/now-playing'),
          fetch('/api/spotify/recently-played'),
        ]);

        const now     = await resNow.json();
        const history = await resHistory.json();

        setState({
          nowPlaying:   now.isPlaying ? now : null,
          recentTracks: history.tracks || [],
        });
      } catch (e) {
        console.error('[SpotifyStats]', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    const id = setInterval(fetchAll, 30_000);
    return () => clearInterval(id);
  }, []);

  const { nowPlaying, recentTracks } = state;

  // deduplicate recent: hide current playing song from list
  const filteredRecent = nowPlaying
    ? recentTracks.filter((t) => t.title !== nowPlaying.title || t.artist !== nowPlaying.artist)
    : recentTracks;

  return (
    <>
      {/* ── Keyframes injected once ── */}
      <style>{`
        @keyframes mtbar {
          0%,100% { height: 3px; }
          50%      { height: 14px; }
        }
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div className="relative overflow-hidden rounded-3xl shadow-sm
        border border-neutral-200 dark:border-neutral-700
        bg-white dark:bg-neutral-800/50
        transition-all duration-200">

        {/* ── Primary accent line ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary opacity-80" />

        <div className="p-6 md:p-8 flex flex-col gap-5">

          {/* ════════════════════════════════════════
              HEADER
          ════════════════════════════════════════ */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <SpotifyLogo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Spotify
                </h3>
                <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-400">
                  Listening Activity
                </p>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                Live
              </span>
            </div>
          </div>

          {/* ════════════════════════════════════════
              NOW PLAYING — hero section
          ════════════════════════════════════════ */}
          {loading ? (
            <div className="flex items-center gap-4 p-4 rounded-2xl
              border border-neutral-200 dark:border-neutral-700
              bg-neutral-50 dark:bg-neutral-800/50">
              <Skeleton className="h-16 w-16 rounded-full shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ) : (nowPlaying || recentTracks[0]) ? (() => {
            const track      = nowPlaying ?? { ...recentTracks[0], isPlaying: false };
            const isPlaying  = !!nowPlaying;
            return (
              <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl
                  border transition-all duration-200
                  border-neutral-200 dark:border-neutral-700
                  bg-neutral-50 dark:bg-neutral-800/50
                  hover:border-primary/30 dark:hover:border-primary/30
                  hover:bg-primary/5 dark:hover:bg-primary/5"
              >
                {/* Album art — spins when playing */}
                <div className="relative shrink-0 h-16 w-16">
                  <img
                    src={track.albumImageUrl}
                    alt={track.title}
                    className={`h-16 w-16 object-cover shadow-md transition-all duration-500
                      ${isPlaying
                        ? 'rounded-full shadow-primary/20'
                        : 'rounded-xl opacity-80 dark:opacity-60'
                      }`}
                    style={isPlaying
                      ? { animation: 'vinyl-spin 10s linear infinite' }
                      : undefined}
                  />
                  {/* Vinyl center dot */}
                  {isPlaying && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="h-3.5 w-3.5 rounded-full bg-white dark:bg-neutral-900 shadow-md ring-2 ring-primary/50" />
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  {/* Status row */}
                  <div className="flex items-center gap-2">
                    {isPlaying
                      ? <>
                          <MusicBars />
                          <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                            Now Playing
                          </span>
                        </>
                      : <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                          Last Played
                        </span>
                    }
                  </div>

                  <p className="text-base font-bold truncate
                    text-neutral-900 dark:text-white
                    group-hover:text-primary transition-colors duration-150">
                    {track.title}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                    {track.artist}
                    {track.album && (
                      <span className="text-neutral-300 dark:text-neutral-600"> · {track.album}</span>
                    )}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  className="h-4 w-4 shrink-0 text-neutral-300 dark:text-neutral-600
                    group-hover:text-primary group-hover:translate-x-0.5
                    transition-all duration-150"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            );
          })() : (
            <div className="flex items-center gap-3 p-4 rounded-2xl
              border border-dashed border-neutral-200 dark:border-neutral-700 text-center justify-center">
              <SpotifyLogo className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm text-neutral-400 dark:text-neutral-500">
                Tidak ada data tersedia
              </p>
            </div>
          )}

          {/* ════════════════════════════════════════
              RECENTLY PLAYED LIST
          ════════════════════════════════════════ */}
          <div className="flex flex-col gap-1.5">
            {/* Section label */}
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-700/50" />
              <span className="text-[10px] uppercase tracking-widest font-semibold
                text-neutral-400 dark:text-neutral-500 shrink-0 px-1">
                Recently Played
              </span>
              <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-700/50" />
            </div>

            {/* Skeleton */}
            {loading && (
              <>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-1 py-2 animate-pulse">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <Skeleton className="h-2.5 w-3/4" />
                      <Skeleton className="h-2 w-1/2" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Track list */}
            {!loading && filteredRecent.slice(0, 5).map((track, i) => (
              <a
                key={`${track.title}-${i}`}
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-2 py-2 rounded-xl
                  hover:bg-neutral-50 dark:hover:bg-neutral-700/40
                  transition-all duration-150"
              >
                {/* Index */}
                <span className="w-4 text-center text-[11px] font-mono font-semibold shrink-0
                  text-neutral-300 dark:text-neutral-600
                  group-hover:text-primary/50 transition-colors duration-150">
                  {i + 1}
                </span>

                {/* Album art */}
                <img
                  src={track.albumImageUrl}
                  alt={track.title}
                  className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-sm
                    group-hover:scale-105 group-hover:shadow-md
                    transition-all duration-200"
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate
                    text-neutral-800 dark:text-neutral-200
                    group-hover:text-primary transition-colors duration-150">
                    {track.title}
                  </p>
                  <p className="text-xs truncate text-neutral-400 dark:text-neutral-500">
                    {track.artist}
                  </p>
                </div>

                {/* Time ago */}
                {track.playedAt && (
                  <span className="text-[10px] text-neutral-300 dark:text-neutral-600 shrink-0
                    font-mono group-hover:text-neutral-400 transition-colors">
                    {relativeTime(track.playedAt)}
                  </span>
                )}

                {/* Arrow */}
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-neutral-200 dark:text-neutral-700
                    group-hover:text-primary group-hover:translate-x-0.5
                    transition-all duration-150"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}

            {!loading && filteredRecent.length === 0 && (
              <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 py-3">
                Belum ada riwayat putar.
              </p>
            )}
          </div>

          {/* ════════════════════════════════════════
              FOOTER
          ════════════════════════════════════════ */}
          <div className="flex items-center justify-between pt-1
            border-t border-neutral-100 dark:border-neutral-700/50">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
              <ShieldCheck className="h-3 w-3" />
              Updates every 30s
            </div>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-neutral-400 dark:text-neutral-500
                hover:text-primary dark:hover:text-primary transition-colors duration-150 font-mono"
            >
              open.spotify.com ↗
            </a>
          </div>

        </div>
      </div>
    </>
  );
}