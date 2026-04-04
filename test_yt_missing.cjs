const fs = require('fs');
const YtDlp = require('yt-dlp-wrap').default;

(async () => {
    try {
        const d1 = JSON.parse(fs.readFileSync('wu.nwp', 'utf8'));
        const missingTitles = [
          'en - 煙火裡的塵埃『只有我守著安靜的沙漠 等待著花開，只有我看著別人的快樂 竟然會感慨。』【高音質|動態歌詞】♫·Cov\ner (原唱:華晨宇)',
          '突然的自我 伍佰AndChinaBlue ♫「等不完守候,如果仅有此生\n 又何用待从头」♫ 超美動態歌詞Lyrics Music ♫ hccmusic-chan\nnel',
          '【纯享】#周兴哲 #姚晓棠 《屋顶》感受独属于自己的那份心\n动与默契｜《声生不息·华流季》Infinity And Beyond·Mandopop\n｜ MangoTV',
          'Eric周興哲《我很快樂 I_m Happy》Official Music Video',
          '吉星出租 - 轉身即心痛『怎麼轉身又是一陣心痛，只好攥緊 \n雙手任淚橫流。』【高音質_動態歌詞Lyrics】♫',
          '蘇星婕 - 下一個天亮（原唱：郭靜）『你的肩膀是我豁達的 \n天堂，等下一個天亮 把偷拍我看海的照片送我好嗎？』【動態歌\n詞_Vietsub_Pinyin Lyrics】',
          'en - 春泥『風中你的淚滴 滴滴落在回憶裡，讓我們取名叫做\n珍惜。』【高音質_動態歌詞Lyrics】♫(原唱_庾澄慶) · 翻唱歌 \n曲',
          '《时光音乐会》张杰唱《泡沫》破碎感扑面而来。Jason Zhan\ng sings _The Foam_ with a sense of fragmentation.',      
          'en - 一直很安靜·2023『給你的愛一直很安靜，來交換你偶爾\n給的關心，明明是三個人的電影，我卻始終不能有姓名。』【動 \n態歌詞_Vietsub_Pinyin Lyrics】'
        ].map(s => s.replace(/\n| /g, ''));
        
        let missing = d1.tracks.filter(t => {
            const tStr = t.title.replace(/\n| /g, '');
            return missingTitles.some(mt => mt === tStr || mt.includes(tStr) || tStr.includes(mt));
        });
        
        console.log("Found missing tracks to test:", missing.length);
        
        const yt = new YtDlp();
        
        for (const t of missing) {
            console.log("\nTesting title:", t.title);
            const query = `${t.title} ${t.artist || ''}`.trim();
            console.log("Query:", query);
            
            try {
                const stdout = await yt.execPromise([
                    `ytsearch3:${query}`,
                    '--dump-json',
                    '--flat-playlist'
                ]);
                
                const results = stdout.trim().split('\n').filter(Boolean);
                console.log(`Found ${results.length} results.`);
            } catch (err) {
                console.log("Search failed:", err.message.substring(0, 100));
            }
        }
        
    } catch(e) {
        console.error(e);
    }
})();
