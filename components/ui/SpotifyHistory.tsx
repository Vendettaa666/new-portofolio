'use client';
import { useEffect, useState } from 'react';

export default function SpotifyHistory() {
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/spotify/recently-played')
      .then(res => res.json())
      .then(data => setTracks(data.tracks || []));
  }, []);

  return (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-neutral-800/50 border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-lg">
      <div className="flex items-center gap-2 pb-2 border-b-2 border-neutral-200 dark:border-neutral-700">
        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
          Recently Played
        </p>
      </div>
      
      <div className="flex flex-col gap-2">
        {tracks.slice(0, 5).map((track, i) => (
          <a 
            key={i} 
            href={track.songUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 rounded-xl transition-all group"
          >
            <img 
              src={track.albumImageUrl} 
              alt={track.title}
              className="w-10 h-10 rounded-lg shadow-md group-hover:shadow-lg transition-shadow" 
            />
            <div className="overflow-hidden flex-1">
              <p className="font-semibold text-sm truncate text-neutral-900 dark:text-neutral-200 group-hover:text-primary transition-colors">
                {track.title}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {track.artist}
              </p>
            </div>
            <svg 
              className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}