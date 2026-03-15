import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const YtDlpWrap = require('yt-dlp-wrap').default;
import path from 'path';

async function test() {
    console.log("Fetching...");
    const yt = new YtDlpWrap();
    const stdout = await yt.execPromise([
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        '-J'
    ]);
    const dat = JSON.parse(stdout);
    
    let bestStart = 0;
    if (dat.heatmap) {
        const best = [...dat.heatmap].sort((a,b) => b.value - a.value)[0];
        bestStart = best.start_time;
        console.log("Heatmap best part starts at:", bestStart);
    } else {
        console.log("No heatmap.");
    }
    
    const formats = dat.formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none');
    // prefer m4a or bestaudio
    formats.sort((a,b) => b.tbr - a.tbr); // sort by bitrate
    const streamUrl = formats[0].url;
    console.log("Stream URL:", streamUrl.substring(0, 100) + '...');
}
test().catch(console.error);
