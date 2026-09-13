export interface ArtworkResult {
    artwork?: string
    duration?: number
}

interface ArtworkRequest {
    promise: Promise<ArtworkResult | undefined>
    release: () => void
}

interface PendingArtwork {
    path: string
    consumers: number
    started: boolean
    promise: Promise<ArtworkResult | undefined>
    resolve: (result: ArtworkResult | undefined) => void
    reject: (error: unknown) => void
}

// One cache owns every result, including misses. Bounding both the entry count
// and the retained strings prevents large embedded covers from growing forever.
export function createArtworkLoader(
    load: (path: string) => Promise<ArtworkResult>,
    { maxEntries = 80, maxBytes = 16 * 1024 * 1024, concurrency = 2 } = {}
) {
    const cache = new Map<string, { result: ArtworkResult; bytes: number }>()
    const pending = new Map<string, PendingArtwork>()
    const queue = new Map<string, PendingArtwork>()
    let cacheBytes = 0
    let activeLoads = 0

    const get = (path: string): ArtworkResult | undefined => {
        const entry = cache.get(path)
        if (!entry) return undefined
        cache.delete(path)
        cache.set(path, entry)
        return entry.result
    }

    const remember = (path: string, result: ArtworkResult) => {
        const previous = cache.get(path)
        if (previous) {
            cacheBytes -= previous.bytes
            cache.delete(path)
        }
        const bytes = (path.length + (result.artwork?.length || 0)) * 2
        // Oversized artwork can still be displayed by its mounted consumer.
        if (bytes > maxBytes || maxEntries < 1) return
        while (cache.size >= maxEntries || cacheBytes + bytes > maxBytes) {
            const oldestPath = cache.keys().next().value
            if (oldestPath === undefined) break
            cacheBytes -= cache.get(oldestPath)!.bytes
            cache.delete(oldestPath)
        }
        cache.set(path, { result, bytes })
        cacheBytes += bytes
    }

    const runNext = () => {
        while (activeLoads < Math.max(1, concurrency) && queue.size > 0) {
            const task = queue.values().next().value!
            queue.delete(task.path)
            task.started = true
            activeLoads += 1
            const finish = () => {
                pending.delete(task.path)
                activeLoads -= 1
                runNext()
            }
            // Defer invocation so even synchronous loader failures release a slot.
            Promise.resolve().then(() => load(task.path)).then(result => {
                remember(task.path, result)
                finish()
                task.resolve(result)
            }, error => {
                finish()
                task.reject(error)
            })
        }
    }

    const request = (path: string): ArtworkRequest => {
        const cached = get(path)
        if (cached) return { promise: Promise.resolve(cached), release: () => {} }

        let task = pending.get(path)
        if (!task) {
            let resolve!: PendingArtwork['resolve']
            let reject!: PendingArtwork['reject']
            const promise = new Promise<ArtworkResult | undefined>((res, rej) => {
                resolve = res
                reject = rej
            })
            task = { path, consumers: 0, started: false, promise, resolve, reject }
            pending.set(path, task)
            queue.set(path, task)
        }
        task.consumers += 1
        runNext()

        let released = false
        const subscribedTask = task
        return {
            promise: task.promise,
            release: () => {
                if (released) return
                released = true
                subscribedTask.consumers -= 1
                if (!subscribedTask.started && subscribedTask.consumers === 0) {
                    queue.delete(path)
                    pending.delete(path)
                    subscribedTask.resolve(undefined)
                }
            }
        }
    }

    return { get, remember, request }
}
