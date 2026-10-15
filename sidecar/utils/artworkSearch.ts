// Track artwork URL lookup for Discord Rich Presence.
// Replaces the old telegra.ph upload flow (that API is dead) — instead of
// uploading the user's local cover image, look the song up on public music
// APIs and use their CDN artwork URL directly. No user data leaves the machine.

import { fetchMusicApi } from './musicApi'

// Misses are cached too. Without this, every presence update and every
// library-scan file without artwork sends another request to the APIs.
const HIT_TTL_MS = 24 * 60 * 60_000
const MISS_TTL_MS = 60 * 60_000
const cache = new Map<string, { value: string | null; at: number; ttl: number }>()
const inFlight = new Map<string, Promise<string | null>>()

export function searchTrackArtwork(title: string, artist: string): Promise<string | null> {
    const term = `${title || ''} ${artist || ''}`.trim()
    if (!term) return Promise.resolve(null)

    const hit = cache.get(term)
    if (hit && Date.now() - hit.at < hit.ttl) return Promise.resolve(hit.value)

    const pending = inFlight.get(term)
    if (pending) return pending

    const lookup = findTrackArtwork(term).then(value => {
        cache.set(term, { value, at: Date.now(), ttl: value ? HIT_TTL_MS : MISS_TTL_MS })
        return value
    }).finally(() => {
        inFlight.delete(term)
    })
    inFlight.set(term, lookup)
    return lookup
}

async function findTrackArtwork(term: string): Promise<string | null> {
    // 1. iTunes Search API — no auth, stable CDN URLs
    const itunes = await fetchMusicApi(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=1`
    )
    const itunesArt = itunes?.results?.[0]?.artworkUrl100
    if (typeof itunesArt === 'string' && itunesArt) {
        return itunesArt.replace('100x100bb', '512x512bb')
    }

    // 2. Deezer fallback
    const deezer = await fetchMusicApi(
        `https://api.deezer.com/search?q=${encodeURIComponent(term)}&limit=1`
    )
    const deezerArt = deezer?.data?.[0]?.album?.cover_big
    if (typeof deezerArt === 'string' && deezerArt) {
        return deezerArt
    }

    return null
}
