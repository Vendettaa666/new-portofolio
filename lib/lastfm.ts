// ─── lib/lastfm.ts ────────────────────────────────────────────────────────────

const API_KEY  = process.env.LASTFM_API_KEY!;
const USERNAME = process.env.LASTFM_USERNAME!;
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

export type Period = '7day' | '1month' | 'overall';

// Last.fm default placeholder image hash — treat as missing
const LASTFM_NO_IMAGE_HASH = '2a96cbd8b46e442fc41c2b86b821562f';

function validImage(url?: string | null): string | null {
  if (!url || url.trim() === '') return null;
  if (url.includes(LASTFM_NO_IMAGE_HASH)) return null;
  return url;
}

function pickImage(images: any[]): string | null {
  if (!Array.isArray(images)) return null;
  for (const size of ['extralarge', 'large', 'medium']) {
    const found = images.find((img) => img.size === size);
    if (validImage(found?.['#text'])) return found['#text'];
  }
  return null;
}

// User-scoped calls
async function fetchLastFM(method: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ method, user: USERNAME, api_key: API_KEY, format: 'json', ...extra });
  const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Last.fm API error: ${res.status}`);
  return res.json();
}

// Non-user calls (artist.getTopTags, track.getInfo)
async function fetchLastFMPublic(method: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ method, api_key: API_KEY, format: 'json', ...extra });
  const res = await fetch(`${BASE_URL}?${params}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  return res.json();
}

// ─── iTunes Search API — free, no key, real artist photos ─────────────────────
async function getArtistImageFromItunes(artistName: string): Promise<string | null> {
  try {
    const url  = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=1`;
    const res  = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h
    if (!res.ok) return null;
    const json = await res.json();
    const art: string | undefined = json.results?.[0]?.artworkUrl100;
    if (!art) return null;
    // Upscale 100x100 → 500x500
    return art.replace('100x100bb', '500x500bb');
  } catch {
    return null;
  }
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getNowPlaying() {
  const data  = await fetchLastFM('user.getrecenttracks', { limit: '1' });
  const track = data.recenttracks?.track?.[0];
  if (!track) return null;
  return {
    isPlaying: track['@attr']?.nowplaying === 'true',
    title:     track.name,
    artist:    track.artist['#text'],
    album:     track.album['#text'] || undefined,
    albumArt:  pickImage(track.image),
    url:       track.url,
  };
}

export async function getRecentTracks(limit = 10) {
  const data   = await fetchLastFM('user.getrecenttracks', { limit: String(limit + 1) });
  const tracks: any[] = data.recenttracks?.track ?? [];
  return tracks
    .filter((t) => !t['@attr']?.nowplaying)
    .slice(0, limit)
    .map((t) => ({
      title:    t.name,
      artist:   t.artist['#text'],
      album:    t.album['#text'] || undefined,
      image:    pickImage(t.image),
      url:      t.url,
      playedAt: t.date?.uts ? new Date(Number(t.date.uts) * 1000).toISOString() : undefined,
    }));
}

// Top Tracks: enrich missing images via track.getInfo
export async function getTopTracks(period: Period = '7day', limit = 10) {
  const data   = await fetchLastFM('user.gettoptracks', { period, limit: String(limit) });
  const tracks: any[] = data.toptracks?.track ?? [];

  const enriched = await Promise.all(
    tracks.map(async (t) => {
      const existingImage = pickImage(t.image);
      if (existingImage) {
        return { title: t.name, artist: t.artist.name, image: existingImage, url: t.url, playcount: Number(t.playcount) };
      }
      try {
        const info = await fetchLastFMPublic('track.getInfo', {
          track: t.name, artist: t.artist.name, username: USERNAME,
        });
        return {
          title: t.name, artist: t.artist.name,
          image: pickImage(info?.track?.album?.image),
          url: t.url, playcount: Number(t.playcount),
        };
      } catch {
        return { title: t.name, artist: t.artist.name, image: null, url: t.url, playcount: Number(t.playcount) };
      }
    })
  );
  return enriched;
}

// Top Artists: enriched with real photos from iTunes Search API
// (Last.fm deprecated artist images in 2020)
export async function getTopArtists(period: Period = 'overall', limit = 8) {
  const data    = await fetchLastFM('user.gettopartists', { period, limit: String(limit) });
  const artists: any[] = data.topartists?.artist ?? [];

  const enriched = await Promise.all(
    artists.map(async (a) => {
      const itunesImage = await getArtistImageFromItunes(a.name);
      return {
        name:      a.name,
        playcount: Number(a.playcount),
        url:       a.url,
        image:     itunesImage,
      };
    })
  );
  return enriched;
}

// Genres derived from top artists' tags — much more accurate than user.gettoptags
export async function getTopTagsFromArtists(
  period: Period = 'overall',
  artistLimit = 10
): Promise<{ name: string; count: number }[]> {
  const artists = await getTopArtists(period, artistLimit);
  if (!artists.length) return [];

  const NOISE_TAGS = new Set([
    'seen live', 'albums i own', 'favourite', 'favorites', 'love', 'awesome',
    'cool', 'beautiful', 'amazing', 'check', 'good', 'great', 'best',
    'under 2000 listeners', 'all', 'spotify',
  ]);

  const tagArrays = await Promise.allSettled(
    artists.map((artist) => fetchLastFMPublic('artist.getTopTags', { artist: artist.name }))
  );

  const tagScores = new Map<string, number>();

  tagArrays.forEach((result, idx) => {
    if (result.status !== 'fulfilled' || !result.value) return;
    const tags: any[] = result.value.toptags?.tag ?? [];
    const artistWeight = Math.log2(Number(artists[idx]?.playcount ?? 1) + 2);

    tags.slice(0, 8).forEach((tag) => {
      const name = tag.name.toLowerCase().trim();
      if (NOISE_TAGS.has(name)) return;
      const tagWeight = Number(tag.count) / 100;
      tagScores.set(name, (tagScores.get(name) ?? 0) + tagWeight * artistWeight);
    });
  });

  return Array.from(tagScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([name, count]) => ({ name, count: Math.round(count) }));
}

export async function getUserInfo() {
  const data = await fetchLastFM('user.getinfo');
  const user = data.user;
  return {
    name:           user.name,
    totalScrobbles: Number(user.playcount),
    registered:     user.registered?.['#text'] || undefined,
    image:          pickImage(user.image),
  };
}