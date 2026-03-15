import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const YtDlpWrap = require('yt-dlp-wrap').default;

async function test() {
    console.log("Fetching...");
    const yt = new YtDlpWrap();
    const stdout = await yt.execPromise([
        'ytsearch1:周杰倫 晴天',
        '-J'
    ]);
    const dat = JSON.parse(stdout);
    let heatmap = dat.entries ? dat.entries[0].heatmap : dat.heatmap;
    if(heatmap) {
      // Find the best part that is NOT the very beginning (e.g. skip first 15 seconds)
      const validHeatmap = heatmap.filter(h => h.start_time > 15);
      const best = [...validHeatmap].sort((a,b)=>b.value-a.value)[0];
      console.log('Filtered Best:', best);
    }
}
test().catch(console.error);
