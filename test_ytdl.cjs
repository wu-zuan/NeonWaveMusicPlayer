const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

async function test() {
    console.log('Starting test...');
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; 
    try {
        console.log('Validating URL...');
        if (!ytdl.validateURL(url)) {
            console.error('Invalid URL');
            return;
        }

        console.log('Fetching Info...');
        const info = await ytdl.getInfo(url);
        console.log('Title:', info.videoDetails.title);

        console.log('Starting Stream...');
        const stream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });

        stream.on('info', (info, format) => {
            console.log('Stream Info received:', format.mimeType);
            stream.destroy(); 
            console.log('Test Success: Connection established.');
        });

        stream.on('error', (err) => {
            console.error('Stream Error:', err);
        });

    } catch (e) {
        console.error('Global Error:', e);
    }
}

test();
