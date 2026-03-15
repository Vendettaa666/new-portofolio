'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, Music2, Mic2, Hash, TrendingUp, Radio } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Period = '7day' | '1month' | 'overall';
type Tab    = 'recent' | 'tracks' | 'artists' | 'genres';

interface NowPlayingData {
  isPlaying: boolean;
  title:     string;
  artist:    string;
  album?:    string;
  albumArt?: string;
  url?:      string;
}

interface Track {
  title:      string;
  artist:     string;
  album?:     string;
  image?:     string;
  url?:       string;
  playcount?: number | string;
  playedAt?:  string;
}

interface Artist {
  name:       string;
  playcount:  number | string;
  url?:       string;
  image?:     string;
}

interface Tag {
  name:  string;
  count: number | string;
}

interface UserInfo {
  name:           string;
  totalScrobbles: number | string;
  image?:         string;
  registered?:    string;
}

interface MusicData {
  nowPlaying?:   NowPlayingData | null;
  recentTracks?: Track[];
  topTracks?:    Track[];
  topArtists?:   Artist[];
  topTags?:      Tag[];
  userInfo?:     UserInfo;
}

// ─── Last.fm Logo SVG ─────────────────────────────────────────────────────────
function LastFMLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-label="Last.fm">
      <path d="M10.584 17.209l-.88-2.392s-1.43 1.595-3.573 1.595c-1.897 0-3.244-1.65-3.244-4.289 0-3.381 1.705-4.591 3.382-4.591 2.419 0 3.189 1.567 3.849 3.574l.88 2.364c.879 2.667 2.528 4.81 7.289 4.81 3.41 0 5.719-1.045 5.719-3.793 0-2.226-1.265-3.381-3.629-3.931l-1.76-.385c-1.21-.275-1.567-.77-1.567-1.594 0-.935.742-1.485 1.953-1.485 1.32 0 2.034.495 2.144 1.677l2.749-.33C23.616 6.012 22.186 5 19.359 5c-2.556 0-4.866 1.045-4.866 4.069 0 1.897 1.1 3.107 3.409 3.684l1.898.44c1.43.33 1.677.935 1.677 1.677 0 .99-.936 1.43-2.859 1.43-2.749 0-3.904-1.54-4.564-3.604l-.935-2.858c-1.1-3.409-2.886-4.674-6.625-4.674C3.024 4.164.12 6.528.12 12c0 5.225 2.859 7.836 6.681 7.836 3.104 0 4.783-1.627 4.783-1.627z" />
    </svg>
  );
}

// ─── Animated music bars ──────────────────────────────────────────────────────
function MusicBars({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-2.5' : 'h-3.5';
  const w = size === 'sm' ? 'w-3'   : 'w-4';
  return (
    <span className={`flex items-end gap-[2px] ${h} ${w} shrink-0`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-primary"
          style={{ animation: 'mtbar 0.85s ease-in-out infinite', animationDelay: `${i * 0.17}s` }}
        />
      ))}
    </span>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-lg bg-neutral-100 dark:bg-neutral-700/60 animate-pulse ${className}`} />;
}

// ─── Section Divider ─────────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-700/50" />
      <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500 shrink-0 px-1">
        {label}
      </span>
      <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-700/50" />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function relativeTime(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatCount(n?: number | string): string {
  const num = typeof n === 'string' ? parseInt(n, 10) : (n ?? 0);
  if (isNaN(num)) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

function toNum(n?: number | string): number {
  return typeof n === 'string' ? parseInt(n, 10) || 0 : (n ?? 0);
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabButton({
  active, onClick, icon: Icon, label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </button>
  );
}

// ─── Period Selector ─────────────────────────────────────────────────────────
function PeriodSelector({ period, onChange }: { period: Period; onChange: (p: Period) => void }) {
  const options: { value: Period; label: string }[] = [
    { value: '7day',    label: '7 Days'  },
    { value: '1month',  label: '1 Month' },
    { value: 'overall', label: 'All Time'},
  ];
  return (
    <div className="flex gap-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5 shrink-0">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`text-[10px] px-2.5 py-1 rounded-md font-semibold tracking-wide transition-all duration-150 ${
            period === o.value
              ? 'bg-white dark:bg-neutral-700 text-primary shadow-sm'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Playcount Bar ────────────────────────────────────────────────────────────
function PlaycountBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 4;
  return (
    <div className="h-1 w-16 rounded-full bg-neutral-100 dark:bg-neutral-700/60 overflow-hidden shrink-0">
      <div
        className="h-full rounded-full bg-primary/50 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Deterministic gradient colors from artist name ──────────────────────────
const GRADIENT_PAIRS = [
  ['#ef4444', '#f97316'], // red → orange
  ['#f97316', '#eab308'], // orange → yellow
  ['#22c55e', '#14b8a6'], // green → teal
  ['#14b8a6', '#06b6d4'], // teal → cyan
  ['#3b82f6', '#6366f1'], // blue → indigo
  ['#6366f1', '#8b5cf6'], // indigo → violet
  ['#8b5cf6', '#ec4899'], // violet → pink
  ['#ec4899', '#f43f5e'], // pink → rose
  ['#0ea5e9', '#3b82f6'], // sky → blue
  ['#a855f7', '#6366f1'], // purple → indigo
];

function gradientFromString(str: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENT_PAIRS[Math.abs(hash) % GRADIENT_PAIRS.length];
}

// ─── Fallback art — shows initials for tracks, icon for generic ───────────────
function ArtFallback({
  size, rounded = 'rounded-lg', label,
}: {
  size: string; rounded?: string; label?: string;
}) {
  if (label) {
    const [from, to] = gradientFromString(label);
    const initial    = label.replace(/^the\s+/i, '').charAt(0).toUpperCase();
    return (
      <div
        className={`${size} ${rounded} flex items-center justify-center shrink-0 font-bold text-sm text-white shadow-sm`}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {initial}
      </div>
    );
  }
  return (
    <div className={`${size} ${rounded} bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0`}>
      <Music2 className="h-4 w-4 text-neutral-400" />
    </div>
  );
}

// ─── Artist Avatar — real photo from iTunes, gradient initials as fallback ────
function ArtistAvatar({ name, image, size = 'h-10 w-10' }: { name: string; image?: string | null; size?: string }) {
  const [imgError, setImgError] = useState(false);
  const [from, to]              = gradientFromString(name);
  const initial                 = name.replace(/^the\s+/i, '').charAt(0).toUpperCase();

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={name}
        onError={() => setImgError(true)}
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-700 group-hover:ring-primary/30 group-hover:scale-105 transition-all duration-200`}
      />
    );
  }
  return (
    <div
      className={`${size} shrink-0 rounded-full flex items-center justify-center ring-2 ring-neutral-100 dark:ring-neutral-700 group-hover:ring-primary/30 group-hover:scale-105 transition-all duration-200 font-bold text-sm text-white shadow-sm`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initial}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LastFMStats() {
  const [data,          setData]          = useState<MusicData | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [periodLoading, setPeriodLoading] = useState(false);
  const [activeTab,     setActiveTab]     = useState<Tab>('recent');
  const [period,        setPeriod]        = useState<Period>('7day');

  // ── Initial load + 30s polling ──────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res  = await fetch(`/api/music?period=${period}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('[LastFMStats]', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    const id = setInterval(fetchAll, 30_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Re-fetch on period change ───────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    setPeriodLoading(true);
    fetch(`/api/music?period=${period}`)
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setPeriodLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  // ── Derived state ───────────────────────────────────────────────────────────
  const nowPlaying   = data?.nowPlaying  ?? null;
  const recentTracks = data?.recentTracks ?? [];
  const topTracks    = data?.topTracks   ?? [];
  const topArtists   = data?.topArtists  ?? [];
  const topTags      = data?.topTags     ?? [];
  const userInfo     = data?.userInfo;

  const filteredRecent = nowPlaying
    ? recentTracks.filter((t) => t.title !== nowPlaying.title || t.artist !== nowPlaying.artist)
    : recentTracks;

  const maxTrackPlay  = Math.max(1, ...topTracks.map((t)  => toNum(t.playcount)));
  const maxArtistPlay = Math.max(1, ...topArtists.map((a) => toNum(a.playcount)));
  const maxTagCount   = Math.max(1, ...topTags.map((g)    => toNum(g.count)));

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes mtbar {
          0%, 100% { height: 3px; }
          50%       { height: 14px; }
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

          {/* ══════════════════════════════════════════════════════════════
              HEADER
          ══════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <LastFMLogo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Last.fm</h3>
                <p className="text-xs mt-0.5 text-neutral-500 dark:text-neutral-400">Listening Activity</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Scrobbles pill */}
              {userInfo && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full
                  bg-neutral-100 dark:bg-neutral-700/60">
                  <TrendingUp className="h-3 w-3 text-primary shrink-0" />
                  <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {formatCount(userInfo.totalScrobbles)} scrobbles
                  </span>
                </div>
              )}
              {/* Live dot */}
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              NOW PLAYING — hero
          ══════════════════════════════════════════════════════════════ */}
          {loading ? (
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
              <Skeleton className="h-16 w-16 rounded-full shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ) : (nowPlaying || recentTracks[0]) ? (() => {
            const track     = nowPlaying ?? { ...recentTracks[0], isPlaying: false };
            const isPlaying = !!nowPlaying?.isPlaying;
            const artUrl    = (track as NowPlayingData).albumArt ?? (track as Track).image ?? '';
            const trackUrl  = track.url ?? '#';

            return (
              <a
                href={trackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200
                  border-neutral-200 dark:border-neutral-700
                  bg-neutral-50 dark:bg-neutral-800/50
                  hover:border-primary/30 dark:hover:border-primary/30
                  hover:bg-primary/5 dark:hover:bg-primary/5"
              >
                {/* Album art */}
                <div className="relative shrink-0 h-16 w-16">
                  {artUrl ? (
                    <img
                      src={artUrl}
                      alt={track.title}
                      className={`h-16 w-16 object-cover shadow-md transition-all duration-500 ${
                        isPlaying
                          ? 'rounded-full shadow-primary/20'
                          : 'rounded-xl opacity-80 dark:opacity-60'
                      }`}
                      style={isPlaying ? { animation: 'vinyl-spin 10s linear infinite' } : undefined}
                    />
                  ) : (
                    <ArtFallback size="h-16 w-16" rounded={isPlaying ? 'rounded-full' : 'rounded-xl'} />
                  )}
                  {isPlaying && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="h-3.5 w-3.5 rounded-full bg-white dark:bg-neutral-900 shadow-md ring-2 ring-primary/50" />
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {isPlaying ? (
                      <>
                        <MusicBars />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                          Now Playing
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                        Last Played
                      </span>
                    )}
                  </div>
                  <p className="text-base font-bold truncate text-neutral-900 dark:text-white group-hover:text-primary transition-colors duration-150">
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
                <svg className="h-4 w-4 shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            );
          })() : (
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 justify-center">
              <Radio className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm text-neutral-400 dark:text-neutral-500">Tidak ada data tersedia</p>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB NAVIGATION
          ══════════════════════════════════════════════════════════════ */}
          <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden -mx-1 px-1">
            <TabButton active={activeTab === 'recent'}  onClick={() => setActiveTab('recent')}  icon={Music2}    label="Recent"      />
            <TabButton active={activeTab === 'tracks'}  onClick={() => setActiveTab('tracks')}  icon={TrendingUp} label="Top Tracks"  />
            <TabButton active={activeTab === 'artists'} onClick={() => setActiveTab('artists')} icon={Mic2}       label="Top Artists" />
            <TabButton active={activeTab === 'genres'}  onClick={() => setActiveTab('genres')}  icon={Hash}       label="Genres"      />
          </div>

          {/* ══════════════════════════════════════════════════════════════
              TAB: RECENTLY PLAYED
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'recent' && (
            <div className="flex flex-col gap-1.5">
              <SectionDivider label="Recently Played" />

              {/* Skeleton */}
              {loading && [...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-2 animate-pulse">
                  <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-2.5 w-3/4" />
                    <Skeleton className="h-2 w-1/2" />
                  </div>
                </div>
              ))}

              {/* Track rows */}
              {!loading && filteredRecent.slice(0, 6).map((track, i) => (
                <a
                  key={`recent-${track.title}-${i}`}
                  href={track.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/40 transition-all duration-150"
                >
                  <span className="w-4 text-center text-[11px] font-mono font-semibold shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-primary/50 transition-colors">
                    {i + 1}
                  </span>

                  {track.image
                    ? <img src={track.image} alt={track.title} className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-200" />
                    : <ArtFallback size="h-9 w-9" label={track.title} />
                  }

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-neutral-800 dark:text-neutral-200 group-hover:text-primary transition-colors duration-150">
                      {track.title}
                    </p>
                    <p className="text-xs truncate text-neutral-400 dark:text-neutral-500">{track.artist}</p>
                  </div>

                  {track.playedAt && (
                    <span className="text-[10px] text-neutral-300 dark:text-neutral-600 shrink-0 font-mono group-hover:text-neutral-400 transition-colors">
                      {relativeTime(track.playedAt)}
                    </span>
                  )}

                  <svg className="h-3.5 w-3.5 shrink-0 text-neutral-200 dark:text-neutral-700 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150"
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
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB: TOP TRACKS
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'tracks' && (
            <div className="flex flex-col gap-3">
              {/* Period header */}
              <div className="flex items-center justify-between gap-2">
                <SectionDivider label="Top Tracks" />
                <PeriodSelector period={period} onChange={setPeriod} />
              </div>

              {/* Skeleton */}
              {(loading || periodLoading) && [...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-1.5 animate-pulse">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-2.5 w-2/3" />
                    <Skeleton className="h-2 w-1/3" />
                  </div>
                  <Skeleton className="h-1 w-16 rounded-full" />
                </div>
              ))}

              {/* Track rows */}
              {!loading && !periodLoading && topTracks.slice(0, 8).map((track, i) => (
                <a
                  key={`track-${track.title}-${i}`}
                  href={track.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/40 transition-all duration-150"
                >
                  <span className="w-4 text-center text-[11px] font-mono font-semibold shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-primary/50 transition-colors">
                    {i + 1}
                  </span>

                  {track.image
                    ? <img src={track.image} alt={track.title} className="h-10 w-10 shrink-0 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-200" />
                    : <ArtFallback size="h-10 w-10" label={track.title} />
                  }

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-neutral-800 dark:text-neutral-200 group-hover:text-primary transition-colors duration-150">
                      {track.title}
                    </p>
                    <p className="text-xs truncate text-neutral-400 dark:text-neutral-500">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <PlaycountBar value={toNum(track.playcount)} max={maxTrackPlay} />
                    <span className="text-[10px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 w-8 text-right">
                      {formatCount(track.playcount)}
                    </span>
                  </div>

                  <svg className="h-3.5 w-3.5 shrink-0 text-neutral-200 dark:text-neutral-700 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}

              {!loading && !periodLoading && topTracks.length === 0 && (
                <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 py-3">
                  Belum ada data top tracks.
                </p>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB: TOP ARTISTS
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'artists' && (
            <div className="flex flex-col gap-3">
              {/* Period header */}
              <div className="flex items-center justify-between gap-2">
                <SectionDivider label="Top Artists" />
                <PeriodSelector period={period} onChange={setPeriod} />
              </div>

              {/* Skeleton */}
              {(loading || periodLoading) && [...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-2 animate-pulse">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-2 w-1/4" />
                  </div>
                  <Skeleton className="h-1 w-16 rounded-full" />
                </div>
              ))}

              {/* Artist rows */}
              {!loading && !periodLoading && topArtists.slice(0, 8).map((artist, i) => (
                <a
                  key={`artist-${artist.name}-${i}`}
                  href={artist.url ?? `https://www.last.fm/music/${encodeURIComponent(artist.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/40 transition-all duration-150"
                >
                  <span className="w-4 text-center text-[11px] font-mono font-semibold shrink-0 text-neutral-300 dark:text-neutral-600 group-hover:text-primary/50 transition-colors">
                    {i + 1}
                  </span>

                  <ArtistAvatar name={artist.name} image={artist.image} />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-neutral-800 dark:text-neutral-200 group-hover:text-primary transition-colors duration-150">
                      {artist.name}
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                      {formatCount(artist.playcount)} plays
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <PlaycountBar value={toNum(artist.playcount)} max={maxArtistPlay} />
                    <span className="text-[10px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 w-8 text-right">
                      {formatCount(artist.playcount)}
                    </span>
                  </div>

                  <svg className="h-3.5 w-3.5 shrink-0 text-neutral-200 dark:text-neutral-700 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-150"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}

              {!loading && !periodLoading && topArtists.length === 0 && (
                <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 py-3">
                  Belum ada data top artists.
                </p>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              TAB: GENRES / TAGS
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'genres' && (
            <div className="flex flex-col gap-4">
              <SectionDivider label="Favorite Genres" />

              {/* Skeleton */}
              {loading && (
                <div className="flex flex-wrap gap-2">
                  {[80, 120, 60, 100, 70, 90, 50, 110, 75, 95].map((w, i) => (
                    <Skeleton key={i} className={`h-7 rounded-full`} style={{ width: w }} />
                  ))}
                </div>
              )}

              {/* Tag cloud */}
              {!loading && topTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {topTags.map((tag) => {
                    const ratio = toNum(tag.count) / maxTagCount;
                    const size  = ratio > 0.7 ? 'text-sm px-3 py-1.5' : ratio > 0.4 ? 'text-xs px-2.5 py-1' : 'text-[11px] px-2 py-0.5';
                    const bg    = ratio > 0.7
                      ? 'bg-primary/15 text-primary border-primary/20 hover:bg-primary/25'
                      : ratio > 0.4
                        ? 'bg-primary/8 text-primary/80 border-primary/15 hover:bg-primary/15'
                        : 'bg-neutral-100 dark:bg-neutral-700/60 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700';
                    return (
                      <a
                        key={tag.name}
                        href={`https://www.last.fm/tag/${encodeURIComponent(tag.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${size} ${bg} rounded-full border font-semibold transition-all duration-150 capitalize tracking-wide inline-flex items-center justify-center leading-none`}
                      >
                        {tag.name}
                      </a>
                    );
                  })}
                </div>
              )}

              {!loading && topTags.length === 0 && (
                <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 py-3">
                  Belum ada data genre.
                </p>
              )}

              {/* ── Scrobble Stats ── */}
              {userInfo && (
                <>
                  <SectionDivider label="Profile Stats" />
                  <div className="grid grid-cols-2 gap-3">
                    {/* Total scrobbles */}
                    <div className="flex flex-col gap-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                          Total Scrobbles
                        </span>
                      </div>
                      <p className="text-xl font-bold text-neutral-900 dark:text-white">
                        {formatCount(userInfo.totalScrobbles)}
                      </p>
                    </div>

                    {/* Username */}
                    <a
                      href={`https://www.last.fm/user/${userInfo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-150"
                    >
                      <div className="flex items-center gap-1.5">
                        <LastFMLogo className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                          Username
                        </span>
                      </div>
                      <p className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-primary transition-colors truncate">
                        {userInfo.name}
                      </p>
                    </a>

                    {/* Top genre */}
                    {topTags[0] && (
                      <div className="flex flex-col gap-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50">
                        <div className="flex items-center gap-1.5">
                          <Hash className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                            Top Genre
                          </span>
                        </div>
                        <p className="text-base font-bold text-neutral-900 dark:text-white capitalize truncate">
                          {topTags[0].name}
                        </p>
                      </div>
                    )}

                    {/* Top artist */}
                    {topArtists[0] && (
                      <div className="flex flex-col gap-1 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50">
                        <div className="flex items-center gap-1.5">
                          <Mic2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 dark:text-neutral-500">
                            Top Artist
                          </span>
                        </div>
                        <p className="text-base font-bold text-neutral-900 dark:text-white truncate">
                          {topArtists[0].name}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              FOOTER
          ══════════════════════════════════════════════════════════════ */}
          <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
              <ShieldCheck className="h-3 w-3 shrink-0" />
              Updates every 30s
            </div>
            <a
              href={userInfo ? `https://www.last.fm/user/${userInfo.name}` : 'https://www.last.fm'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-neutral-400 dark:text-neutral-500 hover:text-primary dark:hover:text-primary transition-colors duration-150 font-mono"
            >
              last.fm ↗
            </a>
          </div>

        </div>
      </div>
    </>
  );
}