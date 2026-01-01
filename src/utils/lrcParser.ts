export interface LyricLine {
    time: number
    text: string
}

export function parseLrc(lrc: string): LyricLine[] {
    const lines = lrc.split('\n')
    const result: LyricLine[] = []

    // Time regex: [mm:ss.xx] or [mm:ss.xxx]
    const timeRegex = /\[(\d{2}):(\d{2})(\.\d{2,3})?\]/

    for (const line of lines) {
        const match = timeRegex.exec(line)
        if (match) {
            const min = parseInt(match[1])
            const sec = parseInt(match[2])
            const ms = match[3] ? parseFloat(match[3]) : 0

            const time = min * 60 + sec + ms
            const text = line.replace(timeRegex, '').trim()

            if (text) {
                result.push({ time, text })
            }
        }
    }

    return result.sort((a, b) => a.time - b.time)
}

export function getCurrentLineIndex(lyrics: LyricLine[], currentTime: number): number {
    // Find the last line that has started
    let index = -1
    for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].time <= currentTime + 0.2) { // 0.2s offset for sync feel
            index = i
        } else {
            break
        }
    }
    return index
}
