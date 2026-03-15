import fetch from 'node-fetch';

async function test() {
    const res = await fetch('https://music.163.com/api/search/get/web?s=周杰倫 晴天&type=1&limit=1', {
        headers: { 'Referer': 'https://music.163.com/', 'Cookie': 'appver=2.0.2' }
    });
    const d = await res.json();
    const id = d.result.songs[0].id;

    // detail
    const res2 = await fetch(`https://music.163.com/api/song/detail/?id=${id}&ids=[${id}]`, {
        headers: { 'Referer': 'https://music.163.com/', 'Cookie': 'appver=2.0.2' }
    });
    const d2 = await res2.json();
    console.log(JSON.stringify(d2.songs[0], null, 2));
}

test().catch(console.error);
