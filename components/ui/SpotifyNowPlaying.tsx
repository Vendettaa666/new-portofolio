'use client';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const fetchStatus = async () => {
      try {
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
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Update setiap 30 detik
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="w-full max-w-sm h-24 bg-neutral-100 dark:bg-neutral-900 animate-pulse rounded-2xl" />;
  if (!data) return null;

  return (
    <div className="w-full max-w-sm">
      <a 
        href={data.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 p-4 bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm hover:border-[#1DB954] transition-all duration-300"
      >
        {/* Album Art */}
        <div className="relative flex-shrink-0">
          <img 
            src={data.albumImageUrl} 
            alt={data.title}
            className={`w-16 h-16 rounded-2xl shadow-lg transition-all duration-500 
              ${data.isPlaying ? 'animate-[spin_12s_linear_infinite] rounded-full ring-2 ring-[#1DB954]/20' : 'grayscale opacity-70'}`}
          />
          {data.isPlaying && (
            <div className="absolute -bottom-1 -right-1 bg-[#0c0c0c] p-1 rounded-full border border-neutral-800">
               <div className="flex items-end gap-[1px] h-3">
                  <div className="w-1 bg-[#1DB954] animate-[music-bar_0.6s_infinite]" />
                  <div className="w-1 bg-[#1DB954] animate-[music-bar_1.0s_infinite]" />
                  <div className="w-1 bg-[#1DB954] animate-[music-bar_0.8s_infinite]" />
               </div>
            </div>
          )}
        </div>

        {/* Text Info */}
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${data.isPlaying ? 'bg-[#1DB954] animate-pulse' : 'bg-neutral-500'}`} />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              {data.isPlaying ? 'Now Playing' : 'Latest Played'}
            </span>
          </div>
          
          <h4 className={`font-bold truncate mt-1 transition-colors ${data.isPlaying ? 'text-neutral-900 dark:text-white group-hover:text-[#1DB954]' : 'text-neutral-500'}`}>
            {data.title}
          </h4>
          <p className="text-xs text-neutral-400 truncate">
            {data.artist}
          </p>
        </div>

        {/* Arrow Icon */}
        <div className="text-neutral-300 group-hover:text-[#1DB954] group-hover:translate-x-1 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
        </div>
      </a>
    </div>
  );
}