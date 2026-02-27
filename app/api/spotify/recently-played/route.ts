import { NextResponse } from 'next/server';
import { getRecentlyPlayed } from '@/lib/spotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await getRecentlyPlayed();
    const data = await response.json();
    const tracks = data.items.map((item: any) => ({
      title: item.track.name,
      artist: item.track.artists.map((a: any) => a.name).join(', '),
      songUrl: item.track.external_urls.spotify,
      albumImageUrl: item.track.album.images[0].url,
    }));
    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ tracks: [] }, { status: 500 });
  }
}