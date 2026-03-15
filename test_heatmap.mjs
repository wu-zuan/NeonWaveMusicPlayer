import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const YtDlpWrap = require('yt-dlp-wrap').default;
import path from 'path';

async function test() {
    const yt = new YtDlpWrap();
    const stdout = await yt.execPromise([
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        '--dump-json'
    ]);
    const dat = JSON.parse(stdout);
    if (dat.heatmap) {
        console.log("Heatmap available!");
        const best = [...dat.heatmap].sort((a,b) => b.value - a.value)[0];
        console.log("Best part starts at:", best.start_time, "value:", best.value);
    } else {
        console.log("No heatmap.");
    }
}
test().catch(console.error);
