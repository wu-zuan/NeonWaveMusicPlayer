import fetch from 'node-fetch';

/**
 * Basic heuristic to find the chorus/most repeated section 
 * from synced lyrics (LRC payload from LRCLib)
 */
async function getChorusStartTime(q) {
    try {
        const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if(!data || data.length === 0 || !data[0].syncedLyrics) return null;
        
        const lyrics = data[0].syncedLyrics;
        
        // 1. Parse LRC into objects { time: seconds, text: string }
        const lines = lyrics.split('\n');
        const parsed = [];
        
        // Match [mm:ss.xx] text
        const regex = /\[(\d{2}):(\d{2}\.\d{2})\]\s*(.*)/;
        for(const line of lines) {
            const match = line.match(regex);
            if(match) {
                const m = parseInt(match[1]);
                const s = parseFloat(match[2]);
                const text = match[3].trim();
                const time = m * 60 + s;
                if(text.length > 2) {
                    parsed.push({ time, text });
                }
            }
        }
        
        if(parsed.length === 0) return null;
        
        // 2. Find Repeated Blocks (The Chorus)
        // We'll compare chunks of 3-4 lines and see which block appears most often or is longest match.
        // A simpler but highly effective method: Count line frequencies.
        // The chorus usually consists of highly repeated lyric lines.
        
        const lineFreq = new Map();
        for(let i=0; i<parsed.length; i++) {
            const t = parsed[i].text.toLowerCase();
            lineFreq.set(t, (lineFreq.get(t) || 0) + 1);
        }
        
        // Find the block of consecutive lines that are highly repeated
        let maxChorusScore = 0;
        let bestChorusStartIndex = -1;
        
        // We'll score windows of 4 lines
        const WINDOW_SIZE = 4;
        for(let i=0; i <= parsed.length - WINDOW_SIZE; i++) {
            let score = 0;
            for(let j=0; j<WINDOW_SIZE; j++) {
                const t = parsed[i+j].text.toLowerCase();
                const count = lineFreq.get(t);
                if(count > 1) {
                    score += count; // Heavily weight lines that appear multiple times
                }
            }
            if(score > maxChorusScore) {
                maxChorusScore = score;
                bestChorusStartIndex = i;
            }
        }
        
        if(bestChorusStartIndex !== -1) {
            // We found the likely chorus. We want to return the first instance of it,
            // or we could just jump slightly before the first line of the best section found.
            console.log("Chorus starts around:", parsed[bestChorusStartIndex].text);
            console.log("Time:", parsed[bestChorusStartIndex].time);
            return parsed[bestChorusStartIndex].time;
        }

        // Fallback: 1/3 of the song
        return null;

    } catch (e) {
        console.error(e);
        return null;
    }
}

getChorusStartTime('周杰倫 晴天').then(console.log);
getChorusStartTime('五月天 突然好想你').then(console.log);
