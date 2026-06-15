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
          define: {
            __filename: 'import.meta.filename',
            __dirname: 'import.meta.dirname',
          },
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
                '@snazzah/davey',
                'bufferutil',
                'utf-8-validate'
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
  build: {
    chunkSizeWarningLimit: 1000,
    cssMinify: true,
    rollupOptions: {}
  }
})
