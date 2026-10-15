// Shared gate for public music metadata APIs (iTunes, Deezer, TheAudioDB).
// These services limit requests per IP. A library scan or repeated presence
// updates can exhaust that limit, and then every app on the same IP gets 429.
// Requests are serialized with a per-host gap, and a 429/403 pauses that host.

const MIN_GAP_MS: Record<string, number> = {
    'itunes.apple.com': 3000,
    'api.deezer.com': 300,
    'www.theaudiodb.com': 2000
}
const DEFAULT_GAP_MS = 1000
const BACKOFF_MS = 10 * 60_000

const lastRequestAt = new Map<string, number>()
const backoffUntil = new Map<string, number>()
let queue: Promise<unknown> = Promise.resolve()

export function fetchMusicApi(url: string, timeoutMs = 8000): Promise<any | null> {
    const host = new URL(url).hostname

    const run = async (): Promise<any | null> => {
        if ((backoffUntil.get(host) ?? 0) > Date.now()) return null

        const wait = (lastRequestAt.get(host) ?? 0) + (MIN_GAP_MS[host] ?? DEFAULT_GAP_MS) - Date.now()
        if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
        lastRequestAt.set(host, Date.now())

        try {
            const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
            if (res.status === 429 || res.status === 403) {
                backoffUntil.set(host, Date.now() + BACKOFF_MS)
                console.warn(`[MusicApi] ${host} answered ${res.status}; pausing lookups on this host for 10 minutes`)
                return null
            }
            if (!res.ok) return null
            return await res.json()
        } catch {
            return null
        }
    }

    const result = queue.then(run)
    queue = result.catch(() => null)
    return result
}
