'use client';
import { useEffect, useState } from 'react';
import { Music } from 'lucide-react';

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setError(false);
        // 1. Cek lagu yang sedang diputar
        const resNow = await fetch('/api/spotify/now-playing');
        const now = await resNow.json();

        if (now.isPlaying) {
          setData(now);
        } else {
          // 2. KONDISI OFFLINE: Ambil lagu terakhir dari history
          const resHistory = await fetch('/api/spotify/recently-played');
          const history = await resHistory.json();
          if (history.tracks && history.tracks.length > 0) {
            setData({ ...history.tracks[0], isPlaying: false });
          }
        }
      } catch (error) {
        console.error("Error fetching Spotify:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update setiap 30 detik
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-sm">
        <div className="relative h-28 bg-gradient-to-br from-neutral-100 to-neutral-200/80 dark:from-neutral-800/60 dark:to-neutral-900/40 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700/50 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 animate-shimmer" />
        </div>
      </div>
    );
  }

  if (error || !data) return null;

  return (
    <div className="w-full max-w-md group">
      <a 
        href={data.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center overflow-hidden rounded-3xl transition-all duration-500 ease-out hover:scale-105"
      >
        {/* Background Gradient Card */}
        <div className={`relative w-full overflow-hidden backdrop-blur-xl border border-neutral-200/40 dark:border-neutral-700/40 rounded-3xl shadow-2xl hover:shadow-[0_25px_50px_rgba(29,185,84,0.25)] transition-all duration-500
          ${data.isPlaying 
            ? 'bg-gradient-to-b from-[#1DB954]/15 via-emerald-500/5 to-neutral-50/40 dark:from-[#1DB954]/25 dark:via-emerald-600/15 dark:to-neutral-900/50' 
            : 'bg-gradient-to-b from-neutral-50/80 to-neutral-100/60 dark:from-neutral-800/50 dark:to-neutral-900/40'}`}>
          
          {/* Animated background elements */}
          {data.isPlaying && (
            <>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#1DB954]/20 rounded-full blur-3xl animate-blob" />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </>
          )}

          {/* Content Container */}
          <div className="relative z-10 w-full flex flex-col items-center pt-6 pb-6 px-6">
            {/* Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 mb-6
              ${data.isPlaying 
                ? 'bg-[#1DB954]/25 dark:bg-[#1DB954]/35 border border-[#1DB954]/50 shadow-lg shadow-[#1DB954]/20' 
                : 'bg-neutral-200/50 dark:bg-neutral-700/50 border border-neutral-300/40 dark:border-neutral-600/40'}`}>
              <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${data.isPlaying ? 'bg-[#1DB954]' : 'bg-neutral-400'}`} />
              <span className={`text-xs font-bold tracking-widest uppercase transition-colors duration-300
                ${data.isPlaying ? 'text-[#1DB954]' : 'text-neutral-600 dark:text-neutral-400'}`}>
                {data.isPlaying ? '♵ Now Playing' : '♪ Last Played'}
              </span>
            </div>

            {/* Circular Album Art - Main Focus */}
            <div className="relative mb-8 group/vinyl">
              {/* Outer glow ring */}
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                data.isPlaying 
                  ? 'ring-4 ring-[#1DB954]/40 shadow-[0_0_30px_rgba(29,185,84,0.3)]' 
                  : 'ring-2 ring-neutral-300/40 dark:ring-neutral-600/40'
              }`} />

              {/* Vinyl Record Effect */}
              {data.isPlaying && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-900/20 to-transparent opacity-30" />
              )}

              {/* Album Art Image - Perfectly Circular */}
              <img 
                src={data.albumImageUrl} 
                alt={data.title}
                className={`w-32 h-32 rounded-full object-cover shadow-2xl transition-all duration-700
                  ${data.isPlaying ? 'animate-spin-slow drop-shadow-2xl' : 'grayscale-[50%] opacity-80'}`}
              />
              
              {/* Center Label (Vinyl Effect) */}
              {data.isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-neutral-900 to-black rounded-full shadow-xl flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#1DB954] rounded-full animate-pulse" />
                  </div>
                </div>
              )}

              {/* Music Bars Indicator */}
              {data.isPlaying && (
                <div className="absolute -bottom-3 -right-3 bg-white dark:bg-neutral-800 backdrop-blur-xl p-2.5 rounded-full border-2 border-neutral-200 dark:border-neutral-700 shadow-xl">
                  <div className="flex items-end justify-center gap-1 h-5 w-5">
                    <div className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_0.6s_infinite]" />
                    <div className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_0.8s_infinite]" />
                    <div className="w-0.5 bg-[#1DB954] rounded-full animate-[music-bar_1.0s_infinite]" />
                  </div>
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className="w-full flex flex-col items-center space-y-3 text-center">
              <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                How to Enjoy Life
              </h3>
              
              <h4 className={`font-bold text-xl sm:text-2xl leading-tight transition-colors duration-300 max-w-xs
                ${data.isPlaying 
                  ? 'text-neutral-900 dark:text-white group-hover:text-[#1DB954] dark:group-hover:text-[#1DB954]' 
                  : 'text-neutral-700 dark:text-neutral-200'}`}>
                {data.title}
              </h4>
              
              <p className={`text-sm sm:text-base transition-colors duration-300 max-w-xs
                ${data.isPlaying 
                  ? 'text-neutral-600 dark:text-neutral-400' 
                  : 'text-neutral-500 dark:text-neutral-500'}`}>
                by {data.artist}
              </p>
            </div>

            {/* External Link Button */}
            <button className={`mt-6 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300
              ${data.isPlaying 
                ? 'bg-[#1DB954]/20 border border-[#1DB954]/40 hover:bg-[#1DB954]/30 text-[#1DB954]' 
                : 'bg-neutral-200/40 dark:bg-neutral-700/40 border border-neutral-300/40 dark:border-neutral-600/40 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 text-neutral-600 dark:text-neutral-400'}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10"/>
              </svg>
              <span className="text-xs font-semibold">Listen on Spotify</span>
            </button>
          </div>
        </div>
      </a>

      {/* Additional shine effect on hover */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes music-bar {
          0%, 100% { height: 0.25rem; }
          50% { height: 1rem; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}