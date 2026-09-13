import fs from 'node:fs/promises'
import path from 'node:path'
import { parseFile, type IAudioMetadata } from 'music-metadata'
import { BoundedCache, createConcurrencyLimit } from '../../shared/boundedCache.ts'

type TrackMetadata = {
  title: string | null
  artist: string | null
  album: string | null
  duration: number
  codec: string | null
  bitrate: number | null
  sampleRate: number | null
}
type CachedMetadata = { signature: string; metadata: TrackMetadata }
type CachedArtwork = { signature: string; artwork: string | null }
type MetadataResult = TrackMetadata & { artwork: string | null }

const METADATA_MAX_BYTES = 8 * 1024 * 1024
const ARTWORK_MAX_BYTES = 32 * 1024 * 1024

export class MediaMetadataService {
  private cachePath: string
  private parse: typeof parseFile
  private metadata = new BoundedCache<string, CachedMetadata>(10000, METADATA_MAX_BYTES, (entry, key) =>
    2 * (key.length + entry.signature.length + JSON.stringify(entry.metadata).length))
  private artwork = new BoundedCache<string, CachedArtwork>(200, ARTWORK_MAX_BYTES, (entry, key) =>
    2 * (key.length + entry.signature.length + (entry.artwork?.length || 0)))
  private inFlight = new Map<string, Promise<MetadataResult>>()
  private limit = createConcurrencyLimit(4)
  private loading: Promise<void> | null = null
  private flushTimer: NodeJS.Timeout | null = null
  private flushing: Promise<void> | null = null
  private dirty = false
  private closed = false

  constructor(cachePath: string, parser: typeof parseFile = parseFile) {
    this.cachePath = cachePath
    this.parse = parser
  }

  private load(): Promise<void> {
    if (!this.loading) {
      this.loading = (async () => {
        try {
          // Discard caches from older versions that have grown without a bound.
          if ((await fs.stat(this.cachePath)).size > METADATA_MAX_BYTES * 2) return
          const data = JSON.parse(await fs.readFile(this.cachePath, 'utf8'))
          const entries: Array<[string, CachedMetadata]> = data?.version === 2 && Array.isArray(data.entries)
            ? data.entries
            : Object.entries(data || {}).flatMap(([key, metadata]) => {
                const separator = key.lastIndexOf('\0')
                return separator < 0 ? [] : [[key.slice(0, separator), {
                  signature: `legacy:${key.slice(separator + 1)}`,
                  metadata: metadata as TrackMetadata
                }] as [string, CachedMetadata]]
              })
          for (const [filePath, entry] of entries) {
            if (typeof filePath === 'string' && typeof entry?.signature === 'string' && entry.metadata && typeof entry.metadata === 'object') {
              this.metadata.set(filePath, entry)
            }
          }
        } catch {
          // Missing or damaged cache: parsing the original files repairs it.
          this.metadata.clear()
        }
      })()
    }
    return this.loading
  }

  private markDirty(): void {
    if (this.closed) return
    this.dirty = true
    if (this.flushTimer) return
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null
      void this.flush().catch(error => console.warn('[MetaCache] flush failed:', error))
    }, 1500)
    this.flushTimer.unref()
  }

  async flush(): Promise<void> {
    if (this.flushing) {
      await this.flushing
      if (this.dirty) await this.flush()
      return
    }
    if (!this.dirty) return
    this.dirty = false
    const contents = JSON.stringify({ version: 2, entries: Array.from(this.metadata.items()) })
    this.flushing = (async () => {
      await fs.mkdir(path.dirname(this.cachePath), { recursive: true })
      const temporaryPath = `${this.cachePath}.tmp`
      await fs.writeFile(temporaryPath, contents)
      await fs.rename(temporaryPath, this.cachePath)
    })()
    try {
      await this.flushing
    } catch (error) {
      this.dirty = true
      throw error
    } finally {
      this.flushing = null
    }
  }

  async close(): Promise<void> {
    this.closed = true
    if (this.flushTimer) clearTimeout(this.flushTimer)
    this.flushTimer = null
    try {
      await this.flush()
    } finally {
      this.metadata.clear()
      this.artwork.clear()
    }
  }

  async get(filePath: string, loadArtwork: boolean): Promise<MetadataResult> {
    await this.load()
    const stat = await fs.stat(filePath)
    const signature = `${stat.mtimeMs}:${stat.size}`
    let cachedMetadata = this.metadata.get(filePath)
    if (cachedMetadata?.signature === `legacy:${Math.round(stat.mtimeMs)}`) {
      cachedMetadata = { ...cachedMetadata, signature }
      this.metadata.set(filePath, cachedMetadata)
      this.markDirty()
    }
    if (cachedMetadata && cachedMetadata.signature !== signature) {
      this.metadata.delete(filePath)
      cachedMetadata = undefined
    }
    let cachedArtwork = this.artwork.get(filePath)
    if (cachedArtwork && cachedArtwork.signature !== signature) {
      this.artwork.delete(filePath)
      cachedArtwork = undefined
    }
    if (cachedMetadata && (!loadArtwork || cachedArtwork)) {
      return { ...cachedMetadata.metadata, artwork: loadArtwork ? cachedArtwork!.artwork : null }
    }

    const key = `${filePath}\0${signature}\0${loadArtwork}`
    // A cover parse includes the tags, so a concurrent lightweight reader can share it.
    const existing = this.inFlight.get(key) || (!loadArtwork && this.inFlight.get(`${filePath}\0${signature}\0true`))
    if (existing) {
      const result = await existing
      return loadArtwork ? result : { ...result, artwork: null }
    }
    const request = this.limit(async () => {
      const parsed = await this.parse(filePath, { skipCovers: !loadArtwork || Boolean(cachedArtwork) })
      const metadata = this.extractMetadata(parsed)
      let artwork = cachedArtwork?.artwork || null
      if (loadArtwork && !cachedArtwork) {
        const picture = parsed.common.picture?.[0]
        if (picture) artwork = `data:${picture.format};base64,${Buffer.from(picture.data.buffer, picture.data.byteOffset, picture.data.byteLength).toString('base64')}`
        if (!this.closed) this.artwork.set(filePath, { signature, artwork })
      }
      if (!this.closed) {
        this.metadata.set(filePath, { signature, metadata })
        this.markDirty()
      }
      return { ...metadata, artwork: loadArtwork ? artwork : null }
    })
    this.inFlight.set(key, request)
    try {
      return await request
    } finally {
      this.inFlight.delete(key)
    }
  }

  private extractMetadata(parsed: IAudioMetadata): TrackMetadata {
    return {
      title: parsed.common.title || null,
      artist: parsed.common.artist || null,
      album: parsed.common.album || null,
      duration: parsed.format.duration || 0,
      codec: parsed.format.codec || null,
      bitrate: parsed.format.bitrate || null,
      sampleRate: parsed.format.sampleRate || null
    }
  }
}
