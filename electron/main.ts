import { app, BrowserWindow, ipcMain, dialog, Notification, nativeImage, screen } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import { autoUpdater } from 'electron-updater'
import { spawn } from 'node:child_process'
import * as mm from 'music-metadata'
import { DiscordBotManager } from './discordBot'
import { DiscordRPCManager } from './discordRPC'

const require = createRequire(import.meta.url)
let ffmpegPath = require('ffmpeg-static')
if (app.isPackaged) {
  ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked')
}


if (process.argv.includes('--disable-gpu') || process.argv.includes('--no-gpu')) {
  app.disableHardwareAcceleration()
}

// GPU resilience: reduce GPU stress to prevent TDR (nvlddmkm Event 153)
app.commandLine.appendSwitch('disable-gpu-compositing') // Use software compositing to avoid GPU overload
app.commandLine.appendSwitch('disable-gpu-rasterization') // Prevent GPU raster which can trigger TDR
app.commandLine.appendSwitch('disable-software-rasterizer') // Avoid fallback software raster overhead
app.commandLine.appendSwitch('disable-gpu-sandbox') // Reduce GPU process restrictions
app.commandLine.appendSwitch('gpu-no-context-lost') // Don't crash on GPU context lost
app.commandLine.appendSwitch('disable-accelerated-video-decode') // Avoid GPU video decode stress
app.commandLine.appendSwitch('max-active-webgl-contexts', '1')


autoUpdater.allowPrerelease = true

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

Object.defineProperty(globalThis, '__filename', { value: __filename })
Object.defineProperty(globalThis, '__dirname', { value: __dirname })

process.env.APP_ROOT = path.join(__dirname, '..')

let logStream: fsSync.WriteStream | null = null

export function writeLog(type: string, ...args: any[]) {
  if (!logStream) return
  const timestamp = new Date().toISOString()
  const message = args.map(arg => {
    if (typeof arg === 'object') {
      try { return JSON.stringify(arg) } catch (e) { return String(arg) }
    }
    return String(arg)
  }).join(' ')
  logStream.write(`[${timestamp}] [${type}] ${message}\n`)
}

function setupFileLogging() {
  const logPath = path.join(app.getPath('userData'), 'debug.log')
  try {
    fsSync.writeFileSync(logPath, `=== NeonWave Debug Session Started at ${new Date().toLocaleString()} ===\n`)
    logStream = fsSync.createWriteStream(logPath, { flags: 'a' })

    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    console.log = (...args) => {
      originalLog(...args)
      writeLog('INFO', ...args)
    }
    console.error = (...args) => {
      originalError(...args)
      writeLog('ERROR', ...args)
    }
    console.warn = (...args) => {
      originalWarn(...args)
      writeLog('WARN', ...args)
    }

    process.on('uncaughtException', (error) => {
      writeLog('CRITICAL', 'Uncaught Exception:', error.message, error.stack)
      originalError('Uncaught Exception:', error)
    })

    process.on('unhandledRejection', (reason) => {
      writeLog('CRITICAL', 'Unhandled Rejection:', reason)
      originalError('Unhandled Rejection:', reason)
    })
  } catch (e) {
    console.error('Failed to setup file logging:', e)
  }
}

setupFileLogging()

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let miniWin: BrowserWindow | null = null
let activeWindowName = "unknown"
let monitorProcess: any = null
let discordBot: any = null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(process.env.VITE_PUBLIC!, 'logo.png'),
    titleBarStyle: 'hidden', 
    titleBarOverlay: {
      color: '#00000000',
      symbolColor: '#ffffff',
      height: 30
    },
    show: false, 
    backgroundColor: '#020617', 
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      webSecurity: false, 
      backgroundThrottling: false,
      devTools: true
    },
  })

  win.webContents.on('console-message', (_, level, message, line, sourceId) => {
    const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR']
    const levelStr = levels[level] || 'INFO'
    writeLog(`RENDERER-MAIN-${levelStr}`, `[${path.basename(sourceId)}:${line}] ${message}`)
  })

  
  win.once('ready-to-show', () => {
    win?.show()
    win?.focus()
  })

  
  win.on('unresponsive', () => {
    console.warn('Renderer unresponsive')
    dialog.showMessageBox(win!, {
      type: 'warning',
      title: 'NeonWave 無回應',
      message: '應用程式似乎沒有回應，是否重新載入？',
      buttons: ['重新載入', '稍候'],
      defaultId: 0
    }).then(({ response }) => {
      if (response === 0) win?.reload()
    })
  })

  
  // Handle GPU process crash (TDR recovery)
  win.webContents.on('render-process-gone', (_event, details) => {
    console.error('Renderer process gone:', details.reason)
    if (details.reason === 'crashed' || details.reason === 'killed') {
      // GPU TDR or crash — silently reload after a short delay
      console.warn('[GPU Recovery] Renderer crashed/killed, auto-reloading in 2s...', details.reason)
      setTimeout(() => {
        if (win && !win.isDestroyed()) {
          win.reload()
        }
      }, 2000)
    } else if (details.reason !== 'clean-exit') {
      dialog.showMessageBox(win!, {
        type: 'error',
        title: 'NeonWave 錯誤',
        message: '渲染進程意外終止，應用程式將嘗試重新載入。',
        detail: `原因: ${details.reason}`
      }).then(() => {
        win?.reload()
      })
    }
  })

  // Handle child GPU process crashes specifically
  app.on('child-process-gone', (_event, details) => {
    if (details.type === 'GPU') {
      console.warn('[GPU Recovery] GPU child process gone:', details.reason)
      // Electron will restart the GPU process automatically;
      // we just log and let it recover
    }
  })

  
  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.warn(`Page failed to load: ${errorCode} ${errorDescription}`)
    
    if (VITE_DEV_SERVER_URL) {
      setTimeout(() => {
        win?.loadURL(VITE_DEV_SERVER_URL)
      }, 1000)
    }
  })

  
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  
  
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

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

  
  const notification = new Notification({
    title: 'NeonWave 更新',
    body: '新版本已下載完成，將於重啟後自動安裝。',
    icon: path.join(process.env.VITE_PUBLIC!, 'logo.png')
  })
  notification.show()
})

app.whenReady().then(() => {
  
  if (process.platform === 'win32') {
    app.setAppUserModelId('NeonWave')
  }

  function startActiveWindowMonitor() {
    if (process.platform !== 'win32') return
    const scriptPath = path.join(process.env.APP_ROOT!, 'scripts/get-active-window.ps1')
    
    try {
      monitorProcess = spawn('powershell.exe', [
        '-ExecutionPolicy', 'Bypass',
        '-NoProfile',
        '-File', scriptPath
      ], {
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true
      })

      monitorProcess.stdout.on('data', (data: Buffer) => {
        const name = data.toString().trim()
        if (name) {
          activeWindowName = name
        }
      })

      monitorProcess.on('close', () => {
        if ((app as any).isQuitting) return
        setTimeout(startActiveWindowMonitor, 5000)
      })
    } catch (e) {
      console.error('Failed to start active window monitor:', e)
    }
  }

  startActiveWindowMonitor()

  app.on('will-quit', async () => {
    (app as any).isQuitting = true
    if (monitorProcess) {
      try { monitorProcess.kill() } catch (e) {}
    }
    if (discordBot) {
      try { await discordBot.disconnect() } catch (e) {}
    }
    setTimeout(() => {
      process.exit(0)
    }, 800)
  })
  
  createWindow()

  
  const discordRPC = new DiscordRPCManager()

  
  const imageCache = new Map<string, string>();

  async function uploadToCloud(artworkUrl: string): Promise<string | null> {
    try {
      let buffer: Buffer;

      
      if (artworkUrl.startsWith('data:')) {
        const base64Data = artworkUrl.split('base64,')[1];
        buffer = Buffer.from(base64Data, 'base64');
      } else if (artworkUrl.startsWith('media://') || artworkUrl.startsWith('file://')) {
        let realPath = artworkUrl.replace('media://', '').replace('file://', '');
        realPath = decodeURIComponent(realPath);
        if (realPath.startsWith('/') && process.platform === 'win32') realPath = realPath.substring(1);
        
        try {
          buffer = await fs.readFile(realPath);
        } catch(e) {
          return null;
        }
      } else {
        return null;
      }

      
      const image = nativeImage.createFromBuffer(buffer);
      if (image.isEmpty()) return null;
      
      const resizedBuffer = image.resize({
        width: 512,
        height: 512,
        quality: 'better'
      }).toJPEG(80);

      
      
      
      const form = new FormData();
      const blob = new Blob([new Uint8Array(resizedBuffer)], { type: 'image/jpeg' });
      form.append('file', blob, 'cover.jpg');

      const response = await fetch('https://telegra.ph/upload', {
        method: 'POST',
        body: form
      });

      const res: any = await response.json();
      if (Array.isArray(res) && res[0] && res[0].src) {
        return `https://telegra.ph${res[0].src}`;
      }
    } catch (e) {
      console.error('[CloudUpload] Failed:', e);
    }
    return null;
  }

  ipcMain.handle('discord:updatePresence', async (_, data) => {
    const cacheKey = `${data.title}-${data.artist}`;
    let artworkUrl = 'logo'; 

    
    if (imageCache.has(cacheKey)) {
        artworkUrl = imageCache.get(cacheKey)!;
    } else if (data.artworkUrl && data.artworkUrl.startsWith('http') && !data.artworkUrl.includes('localhost')) {
        artworkUrl = data.artworkUrl;
    }

    
    discordRPC.setActivity({ ...data, artworkUrl }).catch(() => {});

    
    if (artworkUrl === 'logo' && data.artworkUrl) {
        
        (async () => {
             try {
                const uploadedUrl = await uploadToCloud(data.artworkUrl);
                if (uploadedUrl) {
                    imageCache.set(cacheKey, uploadedUrl);
                    
                    discordRPC.setActivity({ ...data, artworkUrl: uploadedUrl }).catch(() => {});
                }
             } catch (e) {
                 console.error('[DiscordRPC] Background upload failed:', e);
             }
        })();
    }

    return true;
  })

  ipcMain.handle('discord:clearCache', () => {
    imageCache.clear();
    return true;
  })

  ipcMain.handle('discord:scanAndUpload', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
    });

    if (result.canceled || result.filePaths.length === 0) return { status: 'canceled' };

    const folderPath = result.filePaths[0];
    
    const walk = async (dir: string): Promise<string[]> => {
      let files: string[] = [];
      const list = await fs.readdir(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) files = files.concat(await walk(fullPath));
        else if (/\.(mp3|m4a|flac|wav|ogg)$/i.test(file)) files.push(fullPath);
      }
      return files;
    };

    const files = await walk(folderPath);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const metadata = await mm.parseFile(file);
        const title = metadata.common.title;
        const artist = metadata.common.artist;
        
        if (title && artist) {
          const cacheKey = `${title}-${artist}`;
          if (!imageCache.has(cacheKey) && metadata.common.picture && metadata.common.picture.length > 0) {
            
            const pic = metadata.common.picture[0];
            const buffer = Buffer.from(pic.data);
            
            
            const { FormData } = require('formdata-node');
            const { Blob } = require('fetch-blob');
            const form = new FormData();
            const blob = new Blob([buffer], { type: pic.format || 'image/jpeg' });
            form.append('file', blob, 'cover.jpg');

            const res = await fetch('https://telegra.ph/upload', { method: 'POST', body: form });
            const json: any = await res.json();
            if (Array.isArray(json) && json[0] && json[0].src) {
              imageCache.set(cacheKey, `https://telegra.ph${json[0].src}`);
              successCount++;
            }
          }
        }
      } catch (e) {
        console.error(`[PreUpload] Error parsing ${file}:`, e);
      }

      
      win?.webContents.send('discord:scanProgress', {
        current: i + 1,
        total: files.length,
        success: successCount
      });
    }

    return { status: 'completed', total: files.length, success: successCount };
  });

  ipcMain.handle('discord:clearPresence', () => {
    return discordRPC.clearActivity()
  })

  
  discordBot = new DiscordBotManager()

  ipcMain.handle('discord:login', async (_, token) => {
    return await discordBot.login(token)
  })

  ipcMain.handle('discord:getGuilds', () => {
    return discordBot.getGuilds()
  })

  ipcMain.handle('discord:getChannels', (_, guildId) => {
    return discordBot.getChannels(guildId)
  })

  ipcMain.handle('discord:join', async (_, guildId, channelId) => {
    return await discordBot.joinChannel(guildId, channelId)
  })

  ipcMain.handle('discord:leave', async () => {
    return await discordBot.leaveChannel()
  })

  ipcMain.handle('discord:disconnect', async () => {
    return await discordBot.disconnect()
  })

  ipcMain.handle('discord:play', async (_, filePath) => {
    
    
    return await discordBot.playFile(filePath, ffmpegPath)
  })

  ipcMain.handle('discord:stop', () => {
    return discordBot.stop()
  })

  ipcMain.handle('discord:pause', () => {
    return discordBot.pause()
  })

  ipcMain.handle('discord:resume', () => {
    return discordBot.resume()
  })

  ipcMain.handle('discord:setVolume', (_, volume) => {
    return discordBot.setVolume(volume)
  })

  ipcMain.handle('discord:status', () => {
    return discordBot.getStatus()
  })

  
  ipcMain.handle('discord:startStreamMode', async () => {
    return await discordBot.playReceiverStream(ffmpegPath)
  })

  
  
  
  
  ipcMain.on('discord:audio-chunk', (_, buffer) => {
    discordBot.writeAudioChunk(new Uint8Array(buffer))
  })

  
  ipcMain.handle('update:check', () => {
    autoUpdater.checkForUpdatesAndNotify()
  })

    ipcMain.handle('update:install', () => {
        
        autoUpdater.quitAndInstall(false, true)
    })

    ipcMain.handle('app:version', () => {
        try {
            const version = app.getVersion()
            if (version && version !== '0.0.0') return version
            const pkg = require('../package.json')
            return pkg.version || '6.1.3'
        } catch (e) {
            return '6.1.3'
        }
    })

    
    let lastIgnoreMouseEvents: boolean | null = null
    ipcMain.on('player:sync', (_, data) => {
        if (miniWin && !miniWin.isDestroyed()) {
            miniWin.webContents.send('player:sync', data)
            
            const shouldIgnore = !!(data && data.isGameModeActive)
            if (lastIgnoreMouseEvents !== shouldIgnore) {
                lastIgnoreMouseEvents = shouldIgnore
                miniWin.setIgnoreMouseEvents(shouldIgnore, { forward: true })
            }
        }
    })

    ipcMain.handle('window:toggleMiniPlayer', () => {
        if (miniWin && !miniWin.isDestroyed()) {
            miniWin.close()
            miniWin = null
            return false
        }

        const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize
        const miniWidth = 180
        const miniHeight = 180
        const margin = 20

        miniWin = new BrowserWindow({
            width: miniWidth,
            height: miniHeight,
            x: screenWidth - miniWidth - margin,
            y: margin,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            resizable: false,
            skipTaskbar: true,
            thickFrame: false, 
            hasShadow: false, 
            backgroundColor: '#00000000',
            webPreferences: {
                preload: path.join(__dirname, 'preload.mjs'),
                webSecurity: false,
            }
        })

        miniWin.webContents.on('console-message', (_, level, message, line, sourceId) => {
            const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR']
            const levelStr = levels[level] || 'INFO'
            writeLog(`RENDERER-MINI-${levelStr}`, `[${path.basename(sourceId)}:${line}] ${message}`)
        })

        if (VITE_DEV_SERVER_URL) {
            miniWin.loadURL(`${VITE_DEV_SERVER_URL}?mini=true`)
        } else {
            miniWin.loadFile(path.join(RENDERER_DIST, 'index.html'), { query: { mini: 'true' } })
        }

        miniWin.on('closed', () => {
            miniWin = null
        })

        return true
    })

  
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

  ipcMain.handle('files:getArtwork', async (_, filePath) => {
    try {
      const metadata = await mm.parseFile(filePath, { skipCovers: false }) 
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const pic = metadata.common.picture[0]
        return `data:${pic.format};base64,${Buffer.from(pic.data).toString('base64')}`
      }
      return null
    } catch (e) {
      return null
    }
  })

  ipcMain.handle('files:getMetadata', async (_, filePath, options = { loadArtwork: true }) => {
    try {
      const parseOptions = options.loadArtwork ? {} : { skipCovers: true }
      const metadata = await mm.parseFile(filePath, parseOptions)

      let artwork = null
      if (options.loadArtwork && metadata.common.picture && metadata.common.picture.length > 0) {
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
      
      return null
    }
  })

  ipcMain.handle('app:active-window', () => {
    return activeWindowName
  })

  ipcMain.handle('app:clear-memory', async () => {
    try {
      const { session } = require('electron')
      await session.defaultSession.clearCache()
      if (global.gc) {
        global.gc()
      }
    } catch (e) {
      console.warn("Memory clear failed:", e)
    }
  })

  
  const YtDlpWrap = createRequire(import.meta.url)('yt-dlp-wrap').default

  
  const updateYtDlpInBackground = async () => {
    const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
    const binaryPath = path.join(app.getPath('userData'), binaryName)
    try {
      const wrapper = new YtDlpWrap(binaryPath)
      console.log("[Main] Checking for yt-dlp updates in background...")
      await wrapper.execPromise(["-U"])
      console.log("[Main] yt-dlp updated successfully.")
    } catch (e: any) {
      console.warn("[Main] Failed to update yt-dlp (background):", e.message)
    }
  }

  
  
  const getYtDlp = async () => {
    const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
    const binaryPath = path.join(app.getPath('userData'), binaryName)

    
    try {
      await fs.access(binaryPath)
    } catch {
      
      console.log('Downloading yt-dlp binary...')
      await YtDlpWrap.downloadFromGithub(binaryPath)
      console.log('Downloaded yt-dlp to', binaryPath)
    }

    return new YtDlpWrap(binaryPath)
  }

  
  updateYtDlpInBackground()

  
  ipcMain.handle('search:youtube', async (_, query) => {
    try {
      
      const yt = await getYtDlp()

      
      
      
      
      const stdout = await yt.execPromise([
        `ytsearch12:${query}`,
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
          thumbnail: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, 
          url: v.url || `https://www.youtube.com/watch?v=${v.id}`
        }))

      return results
    } catch (e) {
      console.error("Yt-dlp search error:", e)
      return []
    }
  })

  ipcMain.handle('search:youtubePreview', async (_, url, title?: string, artist?: string) => {
    try {
      const yt = await getYtDlp()
      const stdout = await yt.execPromise([url, '-J'])
      const dat = JSON.parse(stdout)
      let bestStart = 0
      let hasHeatmap = false

      if (dat.heatmap && dat.heatmap.length > 0) {
        
        const duration = dat.duration || 0
        const validHeatmap = dat.heatmap.filter((h: any) => h.start_time >= 15 && (duration === 0 || h.start_time <= duration - 15))
        const pool = validHeatmap.length > 0 ? validHeatmap : dat.heatmap
        
        const best = [...pool].sort((a: any, b: any) => b.value - a.value)[0]
        bestStart = best.start_time
        hasHeatmap = true
      }

      
      
      
      
      if (!hasHeatmap && title) {
        try {
          const query = artist ? `${title} ${artist}` : title
          const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(query)}`)
          if (res.ok) {
            const data: any[] = await res.json()
            if (data && data.length > 0 && data[0].syncedLyrics) {
              const lyrics = data[0].syncedLyrics
              const lines = lyrics.split('\n')
              const parsed: { time: number, text: string }[] = []
              const regex = /\[(\d{2}):(\d{2}\.\d{2})\]\s*(.*)/

              for (const line of lines) {
                const match = line.match(regex)
                if (match) {
                  const m = parseInt(match[1])
                  const s = parseFloat(match[2])
                  const text = match[3].trim()
                  if (text.length > 2) parsed.push({ time: m * 60 + s, text })
                }
              }

              if (parsed.length > 0) {
                const lineFreq = new Map<string, number>()
                for (const p of parsed) {
                  const t = p.text.toLowerCase()
                  lineFreq.set(t, (lineFreq.get(t) || 0) + 1)
                }

                let maxScore = 0
                let bestIdx = -1
                const WINDOW = 4
                for (let i = 0; i <= parsed.length - WINDOW; i++) {
                  let score = 0
                  for (let j = 0; j < WINDOW; j++) {
                    const t = parsed[i + j].text.toLowerCase()
                    const count = lineFreq.get(t) || 0
                    if (count > 1) score += count
                  }
                  if (score > maxScore) {
                    maxScore = score
                    bestIdx = i
                  }
                }

                
                if (bestIdx !== -1 && maxScore >= 4) {
                  bestStart = parsed[bestIdx].time
                } else {
                  
                  if (dat.duration) bestStart = Math.floor(dat.duration / 3)
                }
              }
            }
          }
        } catch (e) {   }
      }

      
      if (bestStart === 0 && dat.duration) {
        bestStart = Math.floor(dat.duration / 3)
      }

      
      const formats = dat.formats || []
      let audioFormats = formats.filter((f: any) => f.acodec !== 'none' && f.vcodec === 'none')
      let streamUrl = ''

      if (audioFormats.length > 0) {
        
        const m4aFormats = audioFormats.filter((f: any) => f.ext === 'm4a')
        if (m4aFormats.length > 0) audioFormats = m4aFormats

        audioFormats.sort((a: any, b: any) => (b.tbr || 0) - (a.tbr || 0))
        streamUrl = audioFormats[0].url
      } else {
        
        formats.sort((a: any, b: any) => (b.tbr || 0) - (a.tbr || 0))
        if (formats.length > 0) streamUrl = formats[0].url
      }

      return {
        url: streamUrl,
        startTime: bestStart
      }
    } catch (e: any) {
      console.error("Youtube preview error:", e)
      return null
    }
  })

  ipcMain.handle('download:youtube', async (_, url, inputTitle, inputArtist, format = 'm4a') => {
    try {
      const yt = await getYtDlp()

      
      const ffmpegPath = createRequire(import.meta.url)('ffmpeg-static')
        .replace('app.asar', 'app.asar.unpacked') 

      
      
      let safeTitle = inputTitle.replace(/[\\/:*?"<>|]/g, '_').trim()

      // 2. Pick path
      const defaultExt = format === 'mp4' ? 'mp4' : 'm4a'
      const { filePath } = await dialog.showSaveDialog(win!, {
        title: '下載歌曲',
        defaultPath: `${safeTitle}.${defaultExt}`,
        filters: format === 'mp4' ? [
           { name: 'Media (mp4)', extensions: ['mp4'] },
           { name: 'Audio (m4a)', extensions: ['m4a'] }
        ] : [
           { name: 'Audio (m4a)', extensions: ['m4a'] }
        ]
      })

      if (!filePath) return null

      // 3. Download
      return new Promise((resolve, reject) => {
        // Prepare args
        const fArg = format === 'mp4' ? 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/bestaudio[ext=m4a]/best' : 'bestaudio[ext=m4a]'
        const args = [
          url,
          '--no-playlist',
          '--force-overwrites',
          '-f', fArg,
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

  ipcMain.handle('download:youtubeToDir', async (_, url, inputTitle, inputArtist, outputDir, limitRate, fileTimestamp, format = 'm4a') => {
    try {
      const yt = await getYtDlp()

      // Get ffmpeg path
      const ffmpegPath = createRequire(import.meta.url)('ffmpeg-static')
        .replace('app.asar', 'app.asar.unpacked') // Fix for production builds

      let safeTitle = inputTitle.replace(/[\\/:*?"<>|]/g, '_').trim()
      const basePath = path.join(outputDir, safeTitle)

      return new Promise((resolve, reject) => {
        const fArg = format === 'mp4' ? 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/bestaudio[ext=m4a]/best' : 'bestaudio[ext=m4a]'
        const args = [
          url,
          '--no-playlist',
          '--force-overwrites',
          '-f', fArg
        ]

        if (limitRate && limitRate !== '0') {
          args.push('--limit-rate', limitRate)
        }

        args.push(
          '--ffmpeg-location', ffmpegPath,
          '--add-metadata',
          '--embed-thumbnail',
          '-o', `${basePath}.%(ext)s`
        )

        if (inputArtist) {
          args.push('--parse-metadata', `${inputArtist}:%(artist)s`)
          args.push('--parse-metadata', `${inputArtist}:%(album_artist)s`)
        }
        if (inputTitle) {
          args.push('--parse-metadata', `${inputTitle}:%(title)s`)
        }

        const eventEmitter = yt.exec(args)

        eventEmitter.on('progress', (progress: any) => {
          // Send progress updates to renderer
          if (win && progress && progress.currentSpeed) {
            win.webContents.send('download:progress', {
              url: url,
              speed: progress.currentSpeed,
              percent: progress.percent
            })
          }
        })

        // Fallback for manual parsing just in case
        eventEmitter.on('ytDlpEvent', (eventType: string, eventData: string) => {
          if (eventType === 'download' && eventData.includes('at')) {
            const speedMatch = eventData.match(/at\s+([0-9.]+[a-zA-Z]+\/s)/)
            if (speedMatch && win) {
              win.webContents.send('download:progress', { url: url, speed: speedMatch[1] })
            }
          }
        })

        eventEmitter.on('error', (err: any) => {
          console.error("yt-dlp error:", err)
          reject(new Error(`下載錯誤: ${err.message}`))
        })

        eventEmitter.on('close', async () => {
          let finalPath = path.join(outputDir, `${safeTitle}.mp4`)
          try {
            await fs.access(finalPath)
          } catch {
            finalPath = path.join(outputDir, `${safeTitle}.m4a`)
            try {
              await fs.access(finalPath)
            } catch {
              finalPath = path.join(outputDir, `${safeTitle}.webm`)
              try { await fs.access(finalPath) } catch {
                finalPath = path.join(outputDir, `${safeTitle}.mp3`) // Just in case
              }
            }
          }

          if (fileTimestamp) {
            try {
              const timeDate = new Date(fileTimestamp);
              await fs.utimes(finalPath, timeDate, timeDate);
            } catch (e) {
              console.error("Failed to set file timestamp:", e)
            }
          }
          resolve(finalPath)
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

  ipcMain.handle('search:lyrics', async (_, title, artist, filePath, duration) => {
    try {
      const getArtistTitle = createRequire(import.meta.url)('get-artist-title')

      console.log(`[Lyrics] Search Request: Title="${title}", Artist="${artist}", Duration=${duration}`)

      // --- 1. Enhanced Cleaning Logic ---
      const cleanString = (str: string) => {
        if (!str) return ''
        let s = str

        // Remove Japanese-style quotes
        s = s.replace(/『[^』]*』/g, '').replace(/「[^」」]*」/g, '')

        // Smart Bracket Removal
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
          'feat', 'ft', '合唱',
          'prod', 'presents',
          '好聲音', '好声音', '歌手', '聲生不息', '声生不息', '天賜的聲音', '天赐的声音',
          '蒙面唱將', '蒙面唱将', '我們的歌', '我们的歌', '時光音樂會', '时光音乐会',
          'mangotv', 'call me by fire', '乘風破浪', '披荊斬棘'
        ]
        const isJunk = (text: string) => junkKeywords.some(k => text.toLowerCase().includes(k))

        const replaceSmart = (text: string, open: string, close: string) => {
          const esc = (c: string) => '\\' + c
          const regex = new RegExp(`${esc(open)}([^${esc(close)}]*)?${esc(close)}`, 'gi')
          return text.replace(regex, (_, content) => {
            if (!content) return ' '
            if (isJunk(content)) return ' '
            // Keep content but remove brackets
            return ' ' + content + ' '
          })
        }

        s = replaceSmart(s, '(', ')')
        s = replaceSmart(s, '（', '）')
        s = replaceSmart(s, '[', ']')
        s = replaceSmart(s, '【', '】')
        s = replaceSmart(s, '{', '}')
        // Note: We handle 《》 carefully. In standard cleaning, we keep content.
        // But for filenames, we have a special strategy (C-0) below.
        s = replaceSmart(s, '《', '》')

        // Remove loose phrases
        const looseJunk = [
          'Official Music Video', 'Official Lyric Video', 'Official Video', 'Official Audio', 'Official MV',
          'Music Video', 'Lyric Video', 'Theme Song', 'Ending Theme', 'Opening Theme', 'Dynamic Lyrics'
        ]
        looseJunk.forEach(p => {
          const regex = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
          s = s.replace(regex, ' ')
        })

        // Remove specific words
        const wordsToRemove = [
          'official', 'mv', 'lyric', 'lyrics', 'video', 'hd', 'hq', 'sq', '4k',
          'live', 'cover', 'remix', 'feat', 'ft', 'mangotv',
          '動態歌詞', '单纯', '純享', '纯享', 'vietsub', 'pinyin'
        ]
        wordsToRemove.forEach(w => {
          if (/^[a-z0-9]+$/i.test(w)) {
            s = s.replace(new RegExp(`\\b${w}\\b`, 'gi'), ' ')
          } else {
            s = s.replace(new RegExp(w, 'gi'), ' ')
          }
        })

        // Normalize symbols
        s = s.replace(/[:"'_\|\.,!@#$%^&*+=?\/\\♪♫~`\-]/g, ' ')
        return s.replace(/\s+/g, ' ').trim()
      }

      
      const getDurationDiff = (candDur: number, targetDur?: number) => {
        if (!targetDur) return 0 
        return Math.abs(candDur - targetDur)
      }

      
      const searchLrcLib = async (q: string, targetDur?: number) => {
        try {
          const url = `https://lrclib.net/api/search?q=${encodeURIComponent(q)}`
          const res = await fetch(url)
          if (!res.ok) return []
          const list: any[] = await res.json()

          if (!Array.isArray(list)) return []

          
          return list
            .filter(t => t.syncedLyrics && t.syncedLyrics.length > 0)
            .map(t => ({
              source: 'LRCLib',
              id: t.id,
              track: t.trackName,
              artist: t.artistName,
              duration: t.duration, 
              lyrics: t.syncedLyrics,
              diff: targetDur ? getDurationDiff(t.duration, targetDur) : 0
            }))
        } catch (e) {
          console.error("LRCLib Error:", e)
          return []
        }
      }

      
      const searchNetease = async (q: string, targetDur?: number) => {
        try {
          
          const searchUrl = `https://music.163.com/api/search/get/web?s=${encodeURIComponent(q)}&type=1&offset=0&total=true&limit=5`
          const res = await fetch(searchUrl, {
            headers: { 'Referer': 'https://music.163.com/', 'Cookie': 'appver=2.0.2' }
          })
          if (!res.ok) return []
          const data: any = await res.json()

          if (!data.result || !data.result.songs) return []

          
          let candidates = data.result.songs.map((s: any) => ({
            id: s.id,
            track: s.name,
            artist: s.artists?.[0]?.name || 'Unknown',
            duration: s.duration / 1000, 
            diff: targetDur ? getDurationDiff(s.duration / 1000, targetDur) : 0
          }))

          
          if (targetDur) {
            candidates = candidates.filter((c: any) => c.diff <= 5)
            candidates.sort((a: any, b: any) => a.diff - b.diff)
          }

          if (candidates.length === 0) return []

          
          const best = candidates[0]
          const lyricUrl = `https://music.163.com/api/song/lyric?id=${best.id}&lv=1&kv=1&tv=-1`
          const lrcRes = await fetch(lyricUrl, {
            headers: { 'Referer': 'https://music.163.com/', 'Cookie': 'appver=2.0.2' }
          })
          const lrcData: any = await lrcRes.json()

          if (lrcData.lrc && lrcData.lrc.lyric) {
            return [{
              source: 'Netease',
              id: best.id,
              track: best.track,
              artist: best.artist,
              duration: best.duration,
              lyrics: lrcData.lrc.lyric,
              diff: best.diff
            }]
          }
        } catch (e) {
          console.error("Netease Error:", e)
        }
        return []
      }

      
      const convertToTraditional = (text: string | null) => {
        if (!text) return null
        try {
          const OpenCC = require('opencc-js')
          const converter = OpenCC.Converter({ from: 'cn', to: 'tw' })
          return converter(text)
        } catch { return text }
      }

      
      

      let candidates: any[] = []

      
      if (title && artist) {
        const query = `${title} ${artist}`
        console.log(`[Lyrics] Strategy A: ${query}`)

        
        const [lrcLibRes, neteaseRes] = await Promise.all([
          searchLrcLib(query, duration),
          searchNetease(query, duration)
        ])
        candidates.push(...lrcLibRes, ...neteaseRes)
      }

      
      
      const cTitle = cleanString(title)
      const cArtist = cleanString(artist)
      if (cTitle && (cTitle !== title || cArtist !== artist)) {
        const query = `${cTitle} ${cArtist}`
        console.log(`[Lyrics] Strategy B: ${query}`)
        const [lrcLibRes, neteaseRes] = await Promise.all([
          searchLrcLib(query, duration),
          searchNetease(query, duration)
        ])
        candidates.push(...lrcLibRes, ...neteaseRes)
      }

      
      if (filePath) {
        let filename = path.basename(filePath, path.extname(filePath))

        
        
        const varietyMatch = filename.match(/(.+?)《(.+?)》(.*)/)
        if (varietyMatch) {
          const rawArtist = varietyMatch[1] 
          const rawTitle = varietyMatch[2]  

          
          const cA = cleanString(rawArtist).replace(/合唱/g, '').trim()
          const cT = cleanString(rawTitle)

          if (cT) {
            const query = `${cT} ${cA}`
            console.log(`[Lyrics] Strategy C-0 (Variety Pattern): ${query}`)
            candidates.push(...await searchLrcLib(query, duration))
            candidates.push(...await searchNetease(query, duration))

            
            if (cA.length > 0) {
              console.log(`[Lyrics] Strategy C-0 (Title + Duration): ${cT}`)
              candidates.push(...await searchLrcLib(cT, duration))
              candidates.push(...await searchNetease(cT, duration))
            }
          }
        }

        
        const parsed = getArtistTitle(filename.replace(/_/g, ' '))
        if (parsed && parsed.length === 2) {
          const [a, t] = parsed
          const query = `${t} ${a}`
          console.log(`[Lyrics] Strategy C-1 (Parsed): ${query}`)
          candidates.push(...await searchLrcLib(query, duration))
          candidates.push(...await searchNetease(query, duration))
        }

        
        const cFilename = cleanString(filename)
        console.log(`[Lyrics] Strategy C-2 (Raw Cleaned): ${cFilename}`)
        candidates.push(...await searchLrcLib(cFilename, duration))
        candidates.push(...await searchNetease(cFilename, duration))
      }

      
      if (candidates.length === 0) {
        console.log("[Lyrics] No candidates found.")
        return null
      }

      
      
      const unique = new Map()
      candidates.forEach(c => {
        const key = `${c.source}-${c.id}`
        if (!unique.has(key)) unique.set(key, c)
      })
      let finalPool = Array.from(unique.values())

      
      
      if (duration && duration > 0) {
        const strictMatches = finalPool.filter(c => c.diff <= 4)
        if (strictMatches.length > 0) {
          console.log(`[Lyrics] Calibration: Found ${strictMatches.length} strict duration matches.`)
          finalPool = strictMatches
        } else {
          
          
          const lenientMatches = finalPool.filter(c => c.diff <= 10)
          if (lenientMatches.length > 0) {
            console.log(`[Lyrics] Calibration: Found ${lenientMatches.length} lenient duration matches.`)
            finalPool = lenientMatches
          } else {
            console.log(`[Lyrics] Calibration: No duration matches found. Closest is ${Math.min(...finalPool.map(c => c.diff))}s off.`)
            
            
            
            
          }
        }
      }

      
      
      
      finalPool.sort((a, b) => {
        if (Math.abs(a.diff - b.diff) > 0.5) return a.diff - b.diff 
        return 0
      })

      const bestMatch = finalPool[0]
      console.log(`[Lyrics] Selected: ${bestMatch.track} (${bestMatch.artist}) [${bestMatch.source}] Diff=${bestMatch.diff.toFixed(2)}s`)

      return convertToTraditional(bestMatch.lyrics)

    } catch (e) {
      console.error('Error fetching lyrics:', e)
      return null
    }
  })
})
