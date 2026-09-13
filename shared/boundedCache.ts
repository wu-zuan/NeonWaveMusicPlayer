// Map insertion order gives constant-time LRU eviction without scanning the library.
export class BoundedCache<K, V> {
  private entries = new Map<K, { value: V; bytes: number }>()
  private byteCount = 0
  private maxEntries: number
  private maxBytes: number
  private sizeOf: (value: V, key: K) => number

  constructor(maxEntries: number, maxBytes: number, sizeOf: (value: V, key: K) => number) {
    this.maxEntries = maxEntries
    this.maxBytes = maxBytes
    this.sizeOf = sizeOf
  }

  get size() { return this.entries.size }
  get bytes() { return this.byteCount }

  get(key: K): V | undefined {
    const entry = this.entries.get(key)
    if (!entry) return undefined
    this.entries.delete(key)
    this.entries.set(key, entry)
    return entry.value
  }

  set(key: K, value: V): void {
    this.delete(key)
    const bytes = this.sizeOf(value, key)
    // A single huge cover may be returned to the caller, but must not be retained.
    if (bytes > this.maxBytes || this.maxEntries < 1) return
    while (this.entries.size >= this.maxEntries || this.byteCount + bytes > this.maxBytes) {
      const oldest = this.entries.keys().next()
      if (oldest.done) break
      this.delete(oldest.value)
    }
    this.entries.set(key, { value, bytes })
    this.byteCount += bytes
  }

  delete(key: K): void {
    const entry = this.entries.get(key)
    if (!entry) return
    this.byteCount -= entry.bytes
    this.entries.delete(key)
  }

  clear(): void {
    this.entries.clear()
    this.byteCount = 0
  }

  *items(): IterableIterator<[K, V]> {
    for (const [key, entry] of this.entries) yield [key, entry.value]
  }
}

// Create only a small number of worker promises, even for very large folders.
export async function mapConcurrent<T, R>(items: readonly T[], concurrency: number, map: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length)
  let nextIndex = 0
  await Promise.all(Array.from({ length: Math.min(items.length, Math.max(1, Math.floor(concurrency))) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++
      results[index] = await map(items[index])
    }
  }))
  return results
}

export function createConcurrencyLimit(concurrency: number) {
  let active = 0
  const waiting: Array<() => void> = []
  return async <T>(run: () => Promise<T>): Promise<T> => {
    if (active >= concurrency) await new Promise<void>(resolve => waiting.push(resolve))
    else active++
    try {
      return await run()
    } finally {
      const next = waiting.shift()
      if (next) next()
      else active--
    }
  }
}
