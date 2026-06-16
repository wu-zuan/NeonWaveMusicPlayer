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
import { searchArtistImage } from './utils/artistSearch'

const require = createRequire(import.meta.url)
let ffmpegPath = require('ffmpeg-static')
if (app.isPackaged) {
  ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked')
}


// Disable hardware acceleration to prevent GPU TDR crashes (nvlddmkm Event 153)
// We will conditionally enable/disable it below based on system libraries
if (process.platform === 'win32') {
  const system32 = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32')
  const hasMfplat = fsSync.existsSync(path.join(system32, 'mfplat.dll'))
  const hasVcruntime = fsSync.existsSync(path.join(system32, 'vcruntime140.dll'))

  if (!hasMfplat || !hasVcruntime) {
    // Fallback: System lacks media features or C++ runtime, disable GPU entirely to prevent startup crashes
    app.disableHardwareAcceleration()
    app.commandLine.appendSwitch('disable-gpu')
    app.commandLine.appendSwitch('disable-software-rasterizer')
    app.commandLine.appendSwitch('disable-gpu-sandbox')
    app.commandLine.appendSwitch('no-sandbox')
  } else {
    // Normal Windows environment: Keep GPU acceleration enabled, but disable sandbox to prevent AMD GPU / LTSC driver conflicts
    app.commandLine.appendSwitch('disable-gpu-sandbox')
    app.commandLine.appendSwitch('no-sandbox')
  }
} else {
  app.disableHardwareAcceleration()
}




autoUpdater.allowPrerelease = true
autoUpdater.autoInstallOnAppQuit = false

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    
    if (win) {
      if (win.isMinimized()) win.restore()
      win.show()
      win.focus()
      win.setAlwaysOnTop(true)
      win.focus()
      win.setAlwaysOnTop(false)
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
    if (win) {
      win.show()
      win.focus()
      win.setAlwaysOnTop(true)
      win.focus()
      win.setAlwaysOnTop(false)
    }
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

  win.on('closed', () => {
    win = null
    if (miniWin && !miniWin.isDestroyed()) {
      try { miniWin.close() } catch (e) {}
      miniWin = null
    }
    app.quit()
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

  app.on('will-quit', () => {
    (app as any).isQuitting = true
    if (monitorProcess) {
      try { monitorProcess.kill() } catch (e) {}
    }
    if (discordBot) {
      try { discordBot.stop() } catch (e) {}
      try { discordBot.leaveChannel() } catch (e) {}
      if (discordBot.client) {
        try { discordBot.client.destroy() } catch (e) {}
      }
    }
  })
  
  createWindow()

  
  const discordRPC = new DiscordRPCManager()

  
  // LRU image cache — limit to 200 entries to prevent unbounded memory growth
  const IMAGE_CACHE_MAX = 200;
  const imageCache = new Map<string, string>();

  function getFromImageCache(key: string): string | undefined {
    const val = imageCache.get(key);
    if (val) {
      // Move to end (most recently used)
      imageCache.delete(key);
      imageCache.set(key, val);
    }
    return val;
  }

  function setImageCache(key: string, value: string) {
    if (imageCache.has(key)) {
      imageCache.delete(key);
    } else if (imageCache.size >= IMAGE_CACHE_MAX) {
      // Evict oldest entry
      const oldest = imageCache.keys().next().value!;
      imageCache.delete(oldest);
    }
    imageCache.set(key, value);
  }

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

    
    const cached = getFromImageCache(cacheKey);
    if (cached) {
        artworkUrl = cached;
    } else if (data.artworkUrl && data.artworkUrl.startsWith('http') && !data.artworkUrl.includes('localhost')) {
        artworkUrl = data.artworkUrl;
    }

    
    discordRPC.setActivity({ ...data, artworkUrl }).catch(() => {});

    
    if (artworkUrl === 'logo' && data.artworkUrl) {
        
        (async () => {
             try {
                const uploadedUrl = await uploadToCloud(data.artworkUrl);
                if (uploadedUrl) {
                    setImageCache(cacheKey, uploadedUrl);
                    
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
          if (!getFromImageCache(cacheKey) && metadata.common.picture && metadata.common.picture.length > 0) {
            
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
              setImageCache(cacheKey, `https://telegra.ph${json[0].src}`);
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
        try {
            if (win && !win.isDestroyed()) win.destroy()
            if (miniWin && !miniWin.isDestroyed()) miniWin.destroy()
        } catch (e) {}
        autoUpdater.quitAndInstall(true, true)
    })

    ipcMain.handle('window:togglePlay', () => {
        if (win && !win.isDestroyed()) {
            win.webContents.send('player:togglePlay')
        }
    })

    ipcMain.handle('window:restoreMain', () => {
        if (win && !win.isDestroyed()) {
            if (win.isMinimized()) win.restore()
            win.show()
            win.focus()
            win.setAlwaysOnTop(true)
            win.focus()
            win.setAlwaysOnTop(false)
        }
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

  const fileArtworkCache = new Map<string, string | null>()

  ipcMain.handle('files:getArtwork', async (_, filePath) => {
    if (fileArtworkCache.has(filePath)) {
      return fileArtworkCache.get(filePath)
    }
    try {
      const metadata = await mm.parseFile(filePath, { skipCovers: false }) 
      let result: string | null = null
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const pic = metadata.common.picture[0]
        result = `data:${pic.format};base64,${Buffer.from(pic.data).toString('base64')}`
      }
      if (fileArtworkCache.size >= 500) {
        const firstKey = fileArtworkCache.keys().next().value
        if (firstKey) fileArtworkCache.delete(firstKey)
      }
      fileArtworkCache.set(filePath, result)
      return result
    } catch (e) {
      return null
    }
  })

  ipcMain.handle('files:getMetadata', async (_, filePath, options = { loadArtwork: true }) => {
    try {
      const parseOptions = options.loadArtwork ? {} : { skipCovers: true }
      const metadata = await mm.parseFile(filePath, parseOptions)

      let artwork = null
      if (options.loadArtwork) {
        if (fileArtworkCache.has(filePath)) {
          artwork = fileArtworkCache.get(filePath) || null
        } else if (metadata.common.picture && metadata.common.picture.length > 0) {
          const pic = metadata.common.picture[0]
          artwork = `data:${pic.format};base64,${Buffer.from(pic.data).toString('base64')}`
          if (fileArtworkCache.size >= 500) {
            const firstKey = fileArtworkCache.keys().next().value
            if (firstKey) fileArtworkCache.delete(firstKey)
          }
          fileArtworkCache.set(filePath, artwork)
        } else {
          fileArtworkCache.set(filePath, null)
        }
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
      const ytSearch = createRequire(import.meta.url)('yt-search')
      const r = await ytSearch(query)
      if (!r || !r.videos) return []
      
      const results = r.videos.slice(0, 12).map((v: any) => ({
        id: v.videoId,
        title: v.title,
        artist: v.author?.name || 'Unknown',
        duration: v.seconds,
        thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        url: v.url
      }))

      return results
    } catch (e) {
      console.error("yt-search error:", e)
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
    return searchArtistImage(artistName)
  })

  ipcMain.handle('search:lyrics', async (_, title, artist, filePath, duration, aiConfig) => {
    try {
      const getArtistTitle = createRequire(import.meta.url)('get-artist-title')

      console.log(`[Lyrics] Search Request: Title="${title}", Artist="${artist}", Duration=${duration}, AIConfig=${JSON.stringify(aiConfig || {})}`)

      // Helper to convert Simplified Chinese to Traditional Chinese
      const convertToTraditional = (text: string | null) => {
        if (!text) return null
        try {
          const OpenCC = require('opencc-js')
          const converter = OpenCC.Converter({ from: 'cn', to: 'tw' })
          return converter(text)
        } catch { return text }
      }

      // --- 1. Local Cache Check ---
      if (filePath) {
        try {
          const extName = path.extname(filePath)
          const lrcPath = filePath.substring(0, filePath.length - extName.length) + '.lrc'
          try {
            await fs.access(lrcPath)
            const cachedLrc = await fs.readFile(lrcPath, 'utf8')
            if (cachedLrc && cachedLrc.trim().length > 0) {
              console.log(`[Lyrics] Found local cached LRC at: ${lrcPath}`)
              return cachedLrc
            }
          } catch (e) {
            // Local file doesn't exist
          }
        } catch (err) {
          console.error('[Lyrics] Error accessing local cache:', err)
        }
      }

      // --- Helper to save result to local cache ---
      const saveToLocalCache = async (lyricsText: string) => {
        if (filePath && lyricsText) {
          try {
            const extName = path.extname(filePath)
            const lrcPath = filePath.substring(0, filePath.length - extName.length) + '.lrc'
            await fs.writeFile(lrcPath, lyricsText, 'utf8')
            console.log(`[Lyrics] Cached lrc locally to: ${lrcPath}`)
          } catch (e) {
            console.error('[Lyrics] Failed to write local cache file:', e)
          }
        }
      }

      // --- 2. AI Lyrics Fetch/Generation ---
      if (aiConfig && aiConfig.provider && aiConfig.provider !== 'default') {
        try {
          let searchInfo = {
            title: title || '',
            artist: artist || '',
            filename: filePath ? path.basename(filePath) : ''
          }

          // Read embedded ID3 tags if mode is 'audio' or 'audio_filename'
          if (filePath && (aiConfig.mode === 'audio' || aiConfig.mode === 'audio_filename')) {
            try {
              const mm = createRequire(import.meta.url)('music-metadata')
              const metadata = await mm.parseFile(filePath, { skipCovers: true })
              if (metadata.common.title) searchInfo.title = metadata.common.title
              if (metadata.common.artist) searchInfo.artist = metadata.common.artist
            } catch (err) {
              console.warn('[Lyrics] Failed to read ID3 tags for AI search:', err)
            }
          }

          // Build prompt
          let promptDetails = ""
          if (aiConfig.mode === 'filename') {
            promptDetails += `- Filename: "${searchInfo.filename || searchInfo.title}"\n`
          } else if (aiConfig.mode === 'audio') {
            promptDetails += `- Track Title: "${searchInfo.title}"\n- Artist: "${searchInfo.artist}"\n`
          } else {
            promptDetails += `- Track Title: "${searchInfo.title}"\n- Artist: "${searchInfo.artist}"\n- Filename: "${searchInfo.filename}"\n`
          }

          if (duration) {
            promptDetails += `- Song Duration: ${Math.floor(duration)} seconds\n`
          }

          const systemPrompt = `You are a synchronized lyrics database. You MUST output ONLY the synced LRC lyrics with [mm:ss.xx] timestamps for the requested song. No explanations, no markdown blocks.`
          const userPrompt = `Please find or generate the synchronized lyrics (LRC format) for this song.
The lyrics MUST contain precise timestamps in the [minutes:seconds.hundredths] format (e.g., [00:12.34]).

Song details:
${promptDetails}

CRITICAL REQUIREMENTS:
1. Output ONLY the raw LRC content.
2. DO NOT wrap the output in markdown code blocks (\`\`\`), HTML, or any other explanations.
3. If this is a cover version (翻唱), ensure the lyrics and timestamps match this version, particularly aligning with the total duration of ${duration ? Math.floor(duration) : 'unknown'} seconds. Adjust the spacing and timestamps of the lines so they fit naturally from the beginning to the end of the song duration.
4. If you absolutely cannot find or generate any lyrics, output exactly: "Lyrics not found".`

          const provider = aiConfig.provider
          const apiKey = aiConfig.apiKey || ''
          const endpoint = aiConfig.endpoint || ''
          const model = aiConfig.model || ''
          
          let aiOutput: string | null = null
          console.log(`[Lyrics AI] Calling provider: ${provider}, model: ${model}`)

          if (provider === 'gemini') {
            const finalModel = model || 'gemini-1.5-flash'
            const url = endpoint || `https://generativelanguage.googleapis.com/v1beta/models/${finalModel}:generateContent?key=${apiKey}`
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }]
              })
            })
            if (!response.ok) {
              const errText = await response.text()
              throw new Error(`Gemini API error: ${response.status} - ${errText}`)
            }
            const resJson: any = await response.json()
            aiOutput = resJson.candidates?.[0]?.content?.parts?.[0]?.text || null
          } else if (provider === 'claude') {
            const finalModel = model || 'claude-3-5-sonnet-20241022'
            const url = endpoint || 'https://api.anthropic.com/v1/messages'
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
              },
              body: JSON.stringify({
                model: finalModel,
                max_tokens: 4000,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }]
              })
            })
            if (!response.ok) {
              const errText = await response.text()
              throw new Error(`Claude API error: ${response.status} - ${errText}`)
            }
            const resJson: any = await response.json()
            aiOutput = resJson.content?.[0]?.text || null
          } else {
            // OpenAI-compatible (openai, openrouter, ollama, openwebui, chatgpt)
            let finalEndpoint = endpoint
            if (!finalEndpoint) {
              if (provider === 'openai' || provider === 'chatgpt') {
                finalEndpoint = 'https://api.openai.com/v1/chat/completions'
              } else if (provider === 'openrouter') {
                finalEndpoint = 'https://openrouter.ai/api/v1/chat/completions'
              } else if (provider === 'ollama') {
                finalEndpoint = 'http://localhost:11434/v1/chat/completions'
              } else if (provider === 'opwebui') {
                finalEndpoint = 'http://localhost:3000/api/v1/chat/completions'
              }
            } else {
              if (!finalEndpoint.endsWith('/chat/completions')) {
                if (finalEndpoint.endsWith('/')) {
                  finalEndpoint += 'chat/completions'
                } else {
                  finalEndpoint += '/chat/completions'
                }
              }
            }
            const finalModel = model || (
              provider === 'openai' ? 'gpt-4o-mini' :
              provider === 'openrouter' ? 'meta-llama/llama-3-8b-instruct:free' :
              provider === 'ollama' ? 'llama3' :
              provider === 'opwebui' ? 'llama3' : ''
            )

            const headers: any = { 'Content-Type': 'application/json' }
            if (apiKey) {
              headers['Authorization'] = `Bearer ${apiKey}`
            }

            const response = await fetch(finalEndpoint, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                model: finalModel,
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: userPrompt }
                ]
              })
            })

            if (!response.ok) {
              const errText = await response.text()
              throw new Error(`AI API error (${provider}): ${response.status} - ${errText}`)
            }

            const resJson: any = await response.json()
            aiOutput = resJson.choices?.[0]?.message?.content || null
          }

          if (aiOutput) {
            let cleaned = aiOutput.trim()
            // Clean markdown blocks
            cleaned = cleaned.replace(/```(?:lrc|ini|txt|)?\n([\s\S]*?)\n```/g, '$1')
            cleaned = cleaned.replace(/```([\s\S]*?)```/g, '$1')
            cleaned = cleaned.trim()

            if (cleaned && !cleaned.toLowerCase().includes('lyrics not found') && cleaned.includes('[')) {
              const traditionalLrc = convertToTraditional(cleaned)
              if (traditionalLrc) {
                console.log(`[Lyrics AI] Successfully retrieved lyrics via AI.`)
                await saveToLocalCache(traditionalLrc)
                return traditionalLrc
              }
            }
          }
          console.log(`[Lyrics AI] AI response was empty or invalid. Falling back to default search.`)
        } catch (err) {
          console.error('[Lyrics AI] Failed to fetch via AI, falling back to default search:', err)
        }
      }

      // --- 3. Default Guessing Logic (LRCLib / Netease) ---

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
        const promises: Promise<any[]>[] = []

        const varietyMatch = filename.match(/(.+?)《(.+?)》(.*)/)
        if (varietyMatch) {
          const rawArtist = varietyMatch[1] 
          const rawTitle = varietyMatch[2]  

          const cA = cleanString(rawArtist).replace(/合唱/g, '').trim()
          const cT = cleanString(rawTitle)

          if (cT) {
            const query = `${cT} ${cA}`
            console.log(`[Lyrics] Strategy C-0 (Variety Pattern): ${query}`)
            promises.push(searchLrcLib(query, duration))
            promises.push(searchNetease(query, duration))

            if (cA.length > 0) {
              console.log(`[Lyrics] Strategy C-0 (Title + Duration): ${cT}`)
              promises.push(searchLrcLib(cT, duration))
              promises.push(searchNetease(cT, duration))
            }
          }
        }

        const parsed = getArtistTitle(filename.replace(/_/g, ' '))
        if (parsed && parsed.length === 2) {
          const [a, t] = parsed
          const query = `${t} ${a}`
          console.log(`[Lyrics] Strategy C-1 (Parsed): ${query}`)
          promises.push(searchLrcLib(query, duration))
          promises.push(searchNetease(query, duration))
        }

        const cFilename = cleanString(filename)
        console.log(`[Lyrics] Strategy C-2 (Raw Cleaned): ${cFilename}`)
        promises.push(searchLrcLib(cFilename, duration))
        promises.push(searchNetease(cFilename, duration))

        const resultsList = await Promise.all(promises)
        resultsList.forEach(res => {
          candidates.push(...res)
        })
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
            console.log(`[Lyrics] Calibration: No duration matches found.`)
          }
        }
      }

      finalPool.sort((a, b) => {
        if (Math.abs(a.diff - b.diff) > 0.5) return a.diff - b.diff 
        return 0
      })

      const bestMatch = finalPool[0]
      console.log(`[Lyrics] Selected: ${bestMatch.track} (${bestMatch.artist}) [${bestMatch.source}] Diff=${bestMatch.diff.toFixed(2)}s`)

      const finalLyrics = convertToTraditional(bestMatch.lyrics)
      if (finalLyrics) {
        await saveToLocalCache(finalLyrics)
      }
      return finalLyrics

    } catch (e) {
      console.error('Error fetching lyrics:', e)
      return null
    }
  })
})
