import { app, BrowserWindow, ipcMain, dialog, Notification } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import { autoUpdater } from 'electron-updater'
import { exec } from 'node:child_process'
import { parseFile } from 'music-metadata'

const require = createRequire(import.meta.url)
let ffmpegPath = require('ffmpeg-static')
if (app.isPackaged) {
  ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked')
}

function runPowerShell(scriptPath: string): Promise<string> {
  return new Promise((resolve) => {
    exec(`powershell -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout) => {
      if (error) {
        // reject(error) // Don't reject, just return unknown
        resolve("unknown")
        return
      }
      resolve(stdout.trim())
    })
  })
}

// Allow updating to pre-releases if needed
autoUpdater.allowPrerelease = true

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(process.env.VITE_PUBLIC!, 'logo.png'),
    titleBarStyle: 'hidden', // Custom title bar for premium look
    titleBarOverlay: {
      color: '#00000000',
      symbolColor: '#ffffff',
      height: 30
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      webSecurity: false, // simplified for local file access in dev
      backgroundThrottling: false
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Auto Updater Listeners
autoUpdater.on('checking-for-update', () => {
  win?.webContents.send('update-status', { status: 'checking' })
})
autoUpdater.on('update-available', (info) => {
  win?.webContents.send('update-status', { status: 'available', info })
})
autoUpdater.on('update-not-available', (info) => {
  win?.webContents.send('update-status', { status: 'not-available', info })
})
autoUpdater.on('error', (err) => {
  win?.webContents.send('update-status', { status: 'error', error: err.message })
})
autoUpdater.on('download-progress', (progressObj) => {
  win?.webContents.send('update-status', { status: 'downloading', progress: progressObj })
})
autoUpdater.on('update-downloaded', (info) => {
  win?.webContents.send('update-status', { status: 'downloaded', info })

  // Custom Notification with App Icon and Simple Chinese
  const notification = new Notification({
    title: 'NeonWave 更新',
    body: '新版本已下載完成，將於重啟後自動安裝。',
    icon: path.join(process.env.VITE_PUBLIC!, 'logo.png')
  })
  notification.show()
})

app.whenReady().then(() => {
  // Set App ID for Windows Notifications
  if (process.platform === 'win32') {
    app.setAppUserModelId('NeonWave')
  }

  // Register 'media' protocol to bypass some security if needed, or rely on webSecurity: false for now
  createWindow()

  // IPC Handlers
  ipcMain.handle('dialog:openDirectory', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win!, {
      properties: ['openDirectory']
    })
    if (canceled) {
      return null
    }
    return filePaths[0]
  })

  ipcMain.handle('files:listMusic', async (_, folderPath) => {
    if (!folderPath) return []
    try {
      const files = await fs.readdir(folderPath)
      const supportedExtensions = ['.mp3', '.wav', '.wma', '.m4a', '.flac', '.ogg', '.mp4', '.mov', '.wmv', '.avi']

      const fileStats = await Promise.all(files.map(async file => {
        const fullPath = path.join(folderPath, file)
        const ext = path.extname(file).toLowerCase()
        if (!supportedExtensions.includes(ext)) return null

        try {
          const stats = await fs.stat(fullPath)
          return {
            fullPath,
            mtime: stats.mtime.getTime()
          }
        } catch (e) {
          return null
        }
      }))

      return fileStats
        .filter((f): f is { fullPath: string, mtime: number } => f !== null)
        .sort((a, b) => b.mtime - a.mtime)
        .map(f => f.fullPath)
    } catch (error) {
      console.error('Error reading directory:', error)
      return []
    }
  })

  ipcMain.handle('files:readBuffer', async (_, filePath) => {
    try {
      const buffer = await fs.readFile(filePath)
      return buffer
    } catch (error) {
      console.error('Error reading file:', error)
      return null
    }
  })

  ipcMain.handle('files:getMetadata', async (_, filePath) => {
    try {
      const metadata = await parseFile(filePath)
      let artwork = null
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const pic = metadata.common.picture[0]
        artwork = `data:${pic.format};base64,${Buffer.from(pic.data).toString('base64')}`
      }

      return {
        title: metadata.common.title,
        artist: metadata.common.artist,
        album: metadata.common.album,
        artwork: artwork,
        duration: metadata.format.duration,
        codec: metadata.format.codec,
        bitrate: metadata.format.bitrate,
        sampleRate: metadata.format.sampleRate
      }
    } catch (e) {
      // console.warn('Failed to parse metadata:', filePath, e)
      return null
    }
  })

  ipcMain.handle('app:active-window', async () => {
    // Logic for path: in Prod, we assume scripts are in resources or similar.
    // For now, stick to dev path relative to APP_ROOT.
    const scriptPath = path.join(process.env.APP_ROOT, 'scripts/get-active-window.ps1')
    return await runPowerShell(scriptPath)
  })

  // yt-dlp-wrap integration
  const YtDlpWrap = createRequire(import.meta.url)('yt-dlp-wrap').default

  // Ensure we have a binary (lazy load helper)
  const getYtDlp = async () => {
    const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
    const binaryPath = path.join(app.getPath('userData'), binaryName)

    // Check existence
    try {
      await fs.access(binaryPath)
    } catch {
      // Download if missing
      console.log('Downloading yt-dlp binary...')
      await YtDlpWrap.downloadFromGithub(binaryPath)
      console.log('Downloaded yt-dlp to', binaryPath)
    }

    const wrapper = new YtDlpWrap(binaryPath)
    return wrapper
  }

  ipcMain.handle('search:youtube', async (_, query) => {
    try {
      const yt = await getYtDlp()
      // ytsearch20:query triggers yt-dlp to search and return first 20 results
      // --dump-json outputs JSON for each result
      // --flat-playlist ensures we get fast results without full extraction
      // --default-search ytsearch20
      const stdout = await yt.execPromise([
        `ytsearch20:${query}`,
        '--dump-json',
        '--flat-playlist'
      ])

      const results = stdout
        .trim()
        .split('\n')
        .map((line: string) => {
          try { return JSON.parse(line) } catch { return null }
        })
        .filter((v: any) => v && v.id)
        .map((v: any) => ({
          id: v.id,
          title: v.title,
          artist: v.channel || v.uploader || 'Unknown',
          duration: v.duration,
          thumbnail: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, // yt-dlp flat-playlist sometimes misses thumbs
          url: v.url || `https://www.youtube.com/watch?v=${v.id}`
        }))

      return results
    } catch (e) {
      console.error("Yt-dlp search error:", e)
      return []
    }
  })

  ipcMain.handle('download:youtube', async (_, url, inputTitle, inputArtist) => {
    try {
      const yt = await getYtDlp()

      // Get ffmpeg path
      const ffmpegPath = createRequire(import.meta.url)('ffmpeg-static')
        .replace('app.asar', 'app.asar.unpacked') // Fix for production builds

      // 1. Get Info to sanitize title properly (optional, but good)
      // Actually yt-dlp will handle most, but we need a save path.
      let safeTitle = inputTitle.replace(/[\\/:*?"<>|]/g, '_').trim()

      // 2. Pick path
      const { filePath } = await dialog.showSaveDialog(win!, {
        title: '下載歌曲',
        defaultPath: `${safeTitle}.m4a`, // Force m4a for best playback
        filters: [{ name: 'Audio (m4a)', extensions: ['m4a'] }]
      })

      if (!filePath) return null

      // 3. Download
      return new Promise((resolve, reject) => {
        // Prepare args
        const args = [
          url,
          '-f', 'bestaudio[ext=m4a]',
          '--ffmpeg-location', ffmpegPath,
          '--add-metadata',
          '--embed-thumbnail',
          '-o', filePath
        ]

        // If we have explicit artist/title, force them into metadata
        // Note: yt-dlp parse-metadata syntax: "STRING:%(field)s"
        if (inputArtist) {
          args.push('--parse-metadata', `${inputArtist}:%(artist)s`)
          args.push('--parse-metadata', `${inputArtist}:%(album_artist)s`)
        }
        if (inputTitle) {
          args.push('--parse-metadata', `${inputTitle}:%(title)s`)
        }

        const eventEmitter = yt.exec(args)

        eventEmitter.on('progress', () => {
          // Could send progress to renderer if we wanted
          // win?.webContents.send('download-progress', progress)
        })

        eventEmitter.on('error', (err: any) => {
          console.error("yt-dlp error:", err)
          reject(new Error(`下載錯誤: ${err.message}`))
        })

        eventEmitter.on('close', () => {
          resolve(filePath)
        })
      })

    } catch (e: any) {
      console.error("Download fatal error:", e)
      throw new Error(e.message) // Propagate pure message
    }
  })

  ipcMain.handle('search:artistImage', async (_, artistName) => {
    try {
      // 1. Try Deezer
      // Add a small timeout to respect potential rate limits if called rapidly
      const deezerUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=1`
      try {
        const resDeezer = await fetch(deezerUrl)
        if (resDeezer.ok) {
          const dataDeezer: any = await resDeezer.json()
          if (dataDeezer && dataDeezer.data && dataDeezer.data.length > 0) {
            const pic = dataDeezer.data[0].picture_medium || dataDeezer.data[0].picture_big
            if (pic) return pic
          }
        }
      } catch (err) {
        // Deezer failed, proceed to fallback
      }

      // 2. Fallback to iTunes (Album Art)
      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&media=music&entity=album&limit=1`
      const resItunes = await fetch(itunesUrl)
      if (resItunes.ok) {
        const dataItunes: any = await resItunes.json()
        if (dataItunes && dataItunes.results && dataItunes.results.length > 0) {
          const artwork = dataItunes.results[0].artworkUrl100
          if (artwork) {
            return artwork.replace('100x100bb', '600x600bb')
          }
        }
      }

      // 3. Fallback to TheAudioDB (Test API)
      try {
        const audioDbUrl = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName)}`
        const resAudioDb = await fetch(audioDbUrl)
        if (resAudioDb.ok) {
          const dataAudioDb: any = await resAudioDb.json()
          if (dataAudioDb && dataAudioDb.artists && dataAudioDb.artists.length > 0) {
            const artistObj = dataAudioDb.artists[0]
            const pic = artistObj.strArtistThumb || artistObj.strArtistFanart
            if (pic) return pic
          }
        }
      } catch (err) {
        // ignore
      }

      return null
    } catch (e) {
      console.error('Error fetching artist image:', e)
      return null
    }
  })

  ipcMain.handle('search:lyrics', async (_, title, artist, filePath, _duration) => {
    try {
      const getArtistTitle = createRequire(import.meta.url)('get-artist-title')

      console.log(`[Lyrics] Search Request: Title="${title}", Artist="${artist}"`)

      // Helper: Clean junk from strings
      const cleanString = (str: string) => {
        if (!str) return ''
        let s = str

        // 1. Unconditional removal of lyric/quote brackets (Content is usually lyrics snippets)
        s = s.replace(/『[^』]*』/g, '')
        s = s.replace(/「[^」]*」/g, '')

        // 2. Smart removal of brackets
        // If content contains junk keywords (MV, Version, etc), remove the whole block.
        // Otherwise, just remove the brackets and keep the content.
        const junkKeywords = [
          'official', 'music video', 'preview', 'trailer', 'teaser',
          'lyric', 'lyrics', 'sub', 'vietsub', 'pinyin', 'engsub',
          '動態歌詞', '动态歌词', '歌詞', '歌词', '字幕',
          'concert', 'stage', 'performance', '現場', '现场',
          'cover', 'remix', 'medley', 'live',
          'version', 'ver', '版', '翻唱', '原唱',
          'ost', 'soundtrack', 'theme song', 'op', 'ed',
          'hd', 'hq', 'sq', '4k', '1080p', 'hi-res',
          'pure', 'full', 'complete', '純享', '纯享',
          'feat', 'ft',
          'prod', 'presents',
          '好聲音', '好声音', '歌手', '聲生不息', '声生不息', '天賜的聲音', '天赐的声音',
          '蒙面唱將', '蒙面唱将', '我們的歌', '我们的歌', '時光音樂會', '时光音乐会'
        ]

        const isJunk = (text: string) => {
          const lower = text.toLowerCase()
          return junkKeywords.some(k => lower.includes(k))
        }

        const replaceSmart = (text: string, open: string, close: string) => {
          const esc = (c: string) => '\\' + c
          const regex = new RegExp(`${esc(open)}([^${esc(close)}]*)?${esc(close)}`, 'gi')

          return text.replace(regex, (_, content) => {
            if (!content) return ' '
            if (isJunk(content)) return ' '
            return ' ' + content + ' '
          })
        }

        s = replaceSmart(s, '(', ')')
        s = replaceSmart(s, '（', '）')
        s = replaceSmart(s, '[', ']')
        s = replaceSmart(s, '【', '】')
        s = replaceSmart(s, '{', '}')
        s = replaceSmart(s, '《', '》')

        // 3. Remove loose junk phrases
        const looseJunk = [
          'Official Music Video', 'Official Lyric Video', 'Official Video', 'Official Audio', 'Official MV',
          'Music Video', 'Lyric Video',
          'Theme Song', 'Ending Theme', 'Opening Theme',
          'Dynamic Lyrics', 'High Quality'
        ]

        looseJunk.forEach(p => {
          const regex = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
          s = s.replace(regex, ' ')
        })

        // 4. Remove loose junk words (careful with boundaries)
        const wordsToRemove = [
          'official', 'mv', 'lyric', 'lyrics', 'video', 'hd', 'hq', 'sq', '4k',
          'live', 'cover', 'remix', 'feat', 'ft',
          '動態歌詞', '单纯', '純享', '纯享', 'vietsub', 'pinyin'
        ]

        wordsToRemove.forEach(w => {
          // Simple replace for Chinese/Mixed, Word boundary for English
          if (/^[a-z0-9]+$/i.test(w)) {
            s = s.replace(new RegExp(`\\b${w}\\b`, 'gi'), ' ')
          } else {
            s = s.replace(new RegExp(w, 'gi'), ' ')
          }
        })

        // 5. Symbols to space (Keep characters that might be part of names, remove separators)
        s = s.replace(/[:"'_\|\.,!@#$%^&*+=?\/\\♪♫~`\-]/g, ' ')

        // 6. Final Trim
        return s.replace(/\s+/g, ' ').trim()
      }

      // Helper: Search LRCLib
      const searchLrcLib = async (q: string, targetArtist?: string) => {
        try {
          const url = `https://lrclib.net/api/search?q=${encodeURIComponent(q)}`
          const res = await fetch(url)
          if (!res.ok) return null
          const list: any[] = await res.json()

          if (Array.isArray(list) && list.length > 0) {
            // Find synced lyrics
            let matches = list.filter(t => t.syncedLyrics && t.syncedLyrics.length > 0)

            if (matches.length > 0) {
              // 1. Precise Artist Match
              if (targetArtist) {
                const precise = matches.find(t => t.artistName.toLowerCase().includes(targetArtist.toLowerCase()))
                if (precise) {
                  console.log(`[Lyrics] LRCLib Strict Match: ${precise.trackName}`)
                  return precise.syncedLyrics
                }
              }
              // 2. Return first synced found
              return matches[0].syncedLyrics
            }
          }
        } catch (e) {
          console.error("LRCLib Error:", e)
        }
        return null
      }

      // Helper: Search Netease (Fallback)
      const searchNetease = async (q: string) => {
        try {
          // Netease Web API
          const searchUrl = `https://music.163.com/api/search/get/web?s=${encodeURIComponent(q)}&type=1&offset=0&total=true&limit=5`
          const res = await fetch(searchUrl, {
            headers: {
              'Referer': 'https://music.163.com/',
              'Cookie': 'appver=2.0.2'
            }
          })
          if (!res.ok) return null
          const data: any = await res.json()

          if (data.result && data.result.songs && data.result.songs.length > 0) {
            const song = data.result.songs[0]
            const songId = song.id

            // Get Lyrics
            const lyricUrl = `https://music.163.com/api/song/lyric?id=${songId}&lv=1&kv=1&tv=-1`
            const lrcRes = await fetch(lyricUrl, {
              headers: { 'Referer': 'https://music.163.com/', 'Cookie': 'appver=2.0.2' }
            })
            if (!lrcRes.ok) return null
            const lrcData: any = await lrcRes.json()

            if (lrcData.lrc && lrcData.lrc.lyric) {
              console.log(`[Lyrics] Netease Match: ${song.name}`)
              return lrcData.lrc.lyric
            }
          }
        } catch (e) {
          console.error("Netease Error:", e)
        }
        return null
      }

      // --- Final Result Handling (Converter) ---
      const convertToTraditional = (text: string | null) => {
        if (!text) return null
        try {
          // Lazy load OpenCC only when needed
          const OpenCC = require('opencc-js')
          const converter = OpenCC.Converter({ from: 'cn', to: 'tw' })
          return converter(text)
        } catch (e) {
          console.error("OpenCC conversion failed:", e)
          return text // Return original if conversion fails
        }
      }

      // --- Execution Flow ---

      // 1. Try Strict Metadata (LRCLib)
      if (title && artist) {
        const query = `${title} ${artist}`
        const res = await searchLrcLib(query, artist)
        if (res) return convertToTraditional(res)
      }

      // 2. Try Cleaned Metadata (LRCLib)
      const cTitle = cleanString(title)
      const cArtist = cleanString(artist)
      if (cTitle && (cTitle !== title || cArtist !== artist)) {
        console.log(`[Lyrics] Retry with cleaned metadata: ${cTitle} ${cArtist}`)
        const query = `${cTitle} ${cArtist}`
        const res = await searchLrcLib(query, cArtist)
        if (res) return convertToTraditional(res)
      }

      // 3. Try Netease (Title + Artist)
      if (title && artist) {
        console.log(`[Lyrics] Fallback to Netease: ${title} ${artist}`)
        const res = await searchNetease(`${title} ${artist}`)
        if (res) return convertToTraditional(res)
      }

      // 4. Try Filename Parse
      if (filePath) {
        let filename = path.basename(filePath, path.extname(filePath))
        filename = filename.replace(/_/g, ' ')

        // 4a. get-artist-title logic
        const parsed = getArtistTitle(filename)
        if (parsed && parsed.length === 2) {
          const [a, t] = parsed
          console.log(`[Lyrics] Parsed Filename: ${t} - ${a}`)

          let res = await searchLrcLib(`${t} ${a}`, a)
          if (res) return convertToTraditional(res)

          res = await searchNetease(`${t} ${a}`)
          if (res) return convertToTraditional(res)
        }

        // 4b. Raw Filename Cleaned
        const cFilename = cleanString(filename)
        console.log(`[Lyrics] Raw Filename: ${cFilename}`)
        let res = await searchLrcLib(cFilename)
        if (res) return convertToTraditional(res)

        res = await searchNetease(cFilename)
        if (res) return convertToTraditional(res)
      }

      console.log("[Lyrics] Not found in any source.")
      return null
    } catch (e) {
      console.error('Error fetching lyrics:', e)
      return null
    }
  })

  // Update IPC
  ipcMain.handle('update:check', () => {
    autoUpdater.checkForUpdates()
  })

  ipcMain.handle('update:install', () => {
    // Silent install, force run after
    autoUpdater.quitAndInstall(true, true)
  })

  ipcMain.handle('app:version', () => {
    return app.getVersion()
  })
})
