import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import { autoUpdater } from 'electron-updater'
import { exec } from 'node:child_process'
import { parseFile } from 'music-metadata'

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
})

app.whenReady().then(() => {
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

      return files.filter(file => {
        return supportedExtensions.includes(path.extname(file).toLowerCase())
      }).map(file => path.join(folderPath, file))
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
      return {
        title: metadata.common.title,
        artist: metadata.common.artist,
        album: metadata.common.album,
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

  ipcMain.handle('search:youtube', async (_, query) => {
    try {
      const require = createRequire(import.meta.url)
      const yts = require('yt-search')
      const r = await yts(query)
      return r.videos.slice(0, 20).map((v: any) => ({
        id: v.videoId,
        title: v.title,
        artist: v.author.name,
        duration: v.seconds,
        thumbnail: v.thumbnail,
        url: v.url
      }))
    } catch (e) {
      console.error(e)
      return []
    }
  })

  ipcMain.handle('download:youtube', async (_, url, title) => {
    try {
      const require = createRequire(import.meta.url)
      // Use the more maintained fork
      const ytdl = require('@distube/ytdl-core')

      if (!ytdl.validateURL(url)) throw new Error('Invalid URL')

      // Pick download path
      const { filePath } = await dialog.showSaveDialog(win!, {
        title: '下載歌曲',
        defaultPath: `${title.replace(/[\\/:*?"<>|]/g, '_')}.mp3`,
        filters: [{ name: 'Audio', extensions: ['mp3'] }]
      })

      if (!filePath) return null // User canceled

      return new Promise((resolve, reject) => {
        // 'highestaudio' usually returns webm/opus or m4a/aac. 
        const stream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' })

        stream.on('error', (err: any) => {
          console.error('YTDL Stream Error:', err)
          reject(err)
        })

        import('node:fs').then(fsSync => {
          const writer = fsSync.createWriteStream(filePath)
          stream.pipe(writer)

          writer.on('finish', () => resolve(filePath))
          writer.on('error', (err: any) => {
            console.error('File Write Error:', err)
            reject(err)
          })
        })
      })

    } catch (e: any) {
      console.error("Download handler failed:", e)
      throw e
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

  ipcMain.handle('search:lyrics', async (_, title, artist, filePath) => {
    try {
      const isGeneric = !title || !artist || title.includes('Unknown') || artist.includes('Unknown')

      // 1. Precise Match (if we have metadata)
      if (!isGeneric) {
        const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(title)}`
        const res = await fetch(url)
        if (res.ok) {
          const data: any = await res.json()
          return data.syncedLyrics || data.plainLyrics || null
        }
      }

      // 2. Fuzzy / Filename Match (Fallback)
      if (filePath) {
        // Extract filename "Artist - Title.mp3" -> "Artist - Title"
        const filename = path.basename(filePath, path.extname(filePath))
        // Use Lrclib Search with 'q'
        const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(filename)}`
        const res = await fetch(searchUrl)
        if (res.ok) {
          const data: any[] = await res.json()
          if (data && data.length > 0) {
            // Simply pick the first one that has lyrics
            const bestMatch = data.find((t: any) => t.syncedLyrics) || data[0]
            return bestMatch.syncedLyrics || bestMatch.plainLyrics || null
          }
        }
      }

      return null
    } catch (e) {
      console.error('Error fetching lyrics:', e)
      return null
    }
  })

  // Update IPC
  ipcMain.handle('update:check', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })

  ipcMain.handle('update:install', () => {
    // Silent install, force run after
    autoUpdater.quitAndInstall(true, true)
  })

  ipcMain.handle('app:version', () => {
    return app.getVersion()
  })
})
