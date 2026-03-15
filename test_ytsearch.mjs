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
    if(dat.entries) {
      console.log('Heatmap:', dat.entries[0].heatmap);
      const best = [...(dat.entries[0].heatmap||[])].sort((a,b)=>b.value-a.value)[0];
      console.log('Best:', best);
      console.log('Formats:', dat.entries[0].formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none').map(a => a.ext + ' ' + a.tbr));
    } else {
      console.log('Heatmap:', dat.heatmap);
      const best = [...(dat.heatmap||[])].sort((a,b)=>b.value-a.value)[0];
      console.log('Best:', best);
      console.log('Formats:', dat.formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none').map(a => a.ext + ' ' + a.tbr));
    }
}
test().catch(console.error);
