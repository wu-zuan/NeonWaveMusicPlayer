
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs/promises'
import { autoUpdater } from 'electron-updater'
// @ts-ignore
import yts from 'yt-search'

const require = createRequire(import.meta.url)

// Allow updating to pre-releases if needed
autoUpdater.allowPrerelease = true

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
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

  ipcMain.handle('search:youtube', async (_, query) => {
    try {
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
