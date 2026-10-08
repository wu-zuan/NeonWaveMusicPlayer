export const isPreferenceKey = (key: string) => /^(neonwave_|nw_|discord_|artist_img_|lyrics_)/.test(key)

// Slider drags can produce dozens of updates. Persist only the latest pending
// value of each key, and retain failed writes so close can retry them.
export class PreferenceWriter {
    private pending = new Map<string, string | null>()
    private running: Promise<void> | null = null
    private timer: ReturnType<typeof setTimeout> | null = null
    private write: (key: string, value: string | null) => Promise<unknown>
    private onError: (error: unknown) => void

    constructor(
        write: (key: string, value: string | null) => Promise<unknown>,
        onError: (error: unknown) => void,
    ) { this.write = write; this.onError = onError }

    enqueue(key: string, value: string | null) {
        if (!isPreferenceKey(key)) return
        this.pending.set(key, value)
        if (this.timer !== null || this.running) return
        this.timer = setTimeout(() => {
            this.timer = null
            void this.flush().catch(this.onError)
        }, 80)
    }

    async flush(): Promise<void> {
        if (this.timer !== null) clearTimeout(this.timer)
        this.timer = null
        if (this.running) {
            await this.running
            return this.flush()
        }
        this.running = this.drain()
        try { await this.running } finally { this.running = null }
        // An enqueue can arrive after drain resolves but before this await
        // resumes. Do not leave that final update waiting until the next edit.
        if (this.pending.size) await this.flush()
    }

    private async drain() {
        while (this.pending.size) {
            const [key, value] = this.pending.entries().next().value!
            await this.write(key, value)
            if (this.pending.get(key) === value) this.pending.delete(key)
        }
    }
}

export function restorePreferences(storage: Storage, saved: Record<string, string>) {
    // Disk settings are shared across WebView windows and app updates. A stale
    // WebView cache must not take precedence over the last saved value.
    for (const [key, value] of Object.entries(saved)) {
        if (isPreferenceKey(key) && typeof value === 'string') storage.setItem(key, value)
    }
}
