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
    <div className="flex flex-col gap-2 mt-4">
      <p className="text-[10px] font-bold text-neutral-400 uppercase">Recently Played</p>
      {tracks.slice(0, 5).map((track, i) => (
        <a key={i} href={track.songUrl} target="_blank" className="flex items-center gap-3 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all">
          <img src={track.albumImageUrl} className="w-8 h-8 rounded" />
          <div className="overflow-hidden text-sm">
            <p className="font-medium truncate dark:text-neutral-200">{track.title}</p>
            <p className="text-xs text-neutral-500 truncate">{track.artist}</p>
          </div>
        </a>
      ))}
    </div>
  );
}