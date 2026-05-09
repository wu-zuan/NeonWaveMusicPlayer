import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: [
                'yt-search',
                'cheerio',
                'iconv-lite',
                'whatwg-encoding',
                'discord.js',
                '@discordjs/voice',
                'libsodium-wrappers',
                '@snazzah/davey'
              ],
            },
          },
        },
      },
      preload: {
        
        
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      
      
      
      renderer: process.env.NODE_ENV === 'test'
        
        ? undefined
        : {},
    }),
  ],
})
