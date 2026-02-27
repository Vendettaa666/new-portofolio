import { NextResponse } from 'next/server';
import { getNowPlaying } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await getNowPlaying();
    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }
    const song = await response.json();
    if (!song.item) return NextResponse.json({ isPlaying: false });

    return NextResponse.json({
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((a: any) => a.name).join(', '),
      albumImageUrl: song.item.album.images[0].url,
      songUrl: song.item.external_urls.spotify,
    });
  } catch {
    return NextResponse.json({ isPlaying: false }, { status: 500 });
  }
}