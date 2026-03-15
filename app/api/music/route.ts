// ─── app/api/music/route.ts ───────────────────────────────────────────────────
import { NextResponse } from 'next/server';
import {
  getNowPlaying,
  getRecentTracks,
  getTopTracks,
  getTopArtists,
  getTopTagsFromArtists,
  getUserInfo,
} from '@/lib/lastfm';

export const revalidate = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = (['7day', '1month', 'overall'].includes(searchParams.get('period') ?? '')
    ? searchParams.get('period')
    : '7day') as '7day' | '1month' | 'overall';

  try {
    const [nowPlaying, recentTracks, topTracks, topArtists, topTags, userInfo] =
      await Promise.all([
        getNowPlaying(),
        getRecentTracks(10),
        getTopTracks(period, 10),
        getTopArtists(period, 10),       // fetch 10 artists to feed genre aggregation
        getTopTagsFromArtists(period, 10), // derive genres from artist tags
        getUserInfo(),
      ]);

    return NextResponse.json(
      { nowPlaying, recentTracks, topTracks, topArtists, topTags, userInfo },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' } }
    );
  } catch (err) {
    console.error('[/api/music]', err);
    return NextResponse.json({ error: 'Failed to fetch Last.fm data' }, { status: 500 });
  }
}