export interface LyricLine {
    time: number
    text: string
}

export function parseLrc(lrc: string): LyricLine[] {
    const lines = lrc.split('\n')
    const result: LyricLine[] = []
    
    let offset = 0 // in ms
    const offsetRegex = /\[offset:\s*(-?\d+)\s*\]/i
    const timeRegex = /\[(\d{2}):(\d{2})(\.\d{2,3})?\]/

    // Filter out standalone singer/role labels — at most 3 CJK chars + optional colon/bracket
    // e.g. "合", "汪苏泷：", "周兴哲" → filtered. "走吧你" (4+ chars) → kept as real lyrics.
    const singerLabelRegex = /^[\u4e00-\u9fa5]{1,3}[：:）)]?$/

    for (const line of lines) {
        const offsetMatch = offsetRegex.exec(line)
        if (offsetMatch) {
            offset = parseInt(offsetMatch[1])
            continue
        }

        const match = timeRegex.exec(line)
        if (match) {
            const min = parseInt(match[1])
            const sec = parseInt(match[2])
            const ms = match[3] ? parseFloat(match[3]) : 0

            const time = min * 60 + sec + ms
            const text = line.replace(timeRegex, '').trim()

            // Filter out standalone singer names
            if (text && !singerLabelRegex.test(text)) {
                result.push({ time, text })
            }
        }
    }

    // Apply offset to all lines
    if (offset !== 0) {
        const offsetSec = offset / 1000
        for (const line of result) {
            line.time = Math.max(0, line.time + offsetSec)
        }
    }

    return result.sort((a, b) => a.time - b.time)
}

export function getCurrentLineIndex(lyrics: LyricLine[], currentTime: number): number {
    let index = -1
    for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].time <= currentTime) { 
            index = i
        } else {
            break
        }
    }
    return index
}


