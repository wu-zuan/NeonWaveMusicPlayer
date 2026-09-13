import { invoke } from '@tauri-apps/api/core'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'

type Listener = (event: unknown, ...args: any[]) => void
type DesktopEvent = { channel: string; args: any[] }
const listeners = new Map<string, Set<Listener>>()
let mediaBase = ''
let preferenceQueue: Promise<unknown> = Promise.resolve()
let audioQueue: Promise<unknown> = Promise.resolve()
const originalConsole = { ...console }

function decode(value: any): any {
  if (value?.$undefined === true) return undefined
  if (value && typeof value.$bytes === 'string') {
    const bytes = Uint8Array.from(atob(value.$bytes), character => character.charCodeAt(0))
    return value.arrayBuffer ? bytes.buffer : bytes
  }
  if (Array.isArray(value)) return value.map(decode)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decode(item)]))
  return value
}
function encode(value: any): any {
  if (value === undefined) return { $undefined: true }
  if (Array.isArray(value)) return value.map(encode)
  return value
}
export function mediaUrl(file: string) {
  if (!mediaBase) throw new Error('Desktop service has not initialized')
  return `${mediaBase}/local?path=${encodeURIComponent(file)}`
}
export function remoteMediaUrl(url: string) {
  return `${mediaBase}/remote?u=${encodeURIComponent(url)}`
}

const bridge = {
  on(channel: string, listener: Listener) {
    if (!listeners.has(channel)) listeners.set(channel, new Set())
    listeners.get(channel)!.add(listener)
    return () => { listeners.get(channel)?.delete(listener) }
  },
  off(channel: string, listener: Listener) { listeners.get(channel)?.delete(listener) },
  removeListener(channel: string, listener: Listener) { this.off(channel, listener) },
  removeAllListeners(channel: string) { listeners.delete(channel) },
  async invoke<T = any>(channel: string, ...args: any[]): Promise<T> {
    if (channel === 'window:close' || channel === 'update:install') await preferenceQueue
    if (channel === 'files:readBuffer' || channel === 'files:readBufferPartial') {
      try {
        const partial = channel.endsWith('Partial')
        const maxBytes = Math.min(Math.max(Number(args[1] ?? 128 * 1024 * 1024), 0), 128 * 1024 * 1024)
        if (partial && maxBytes === 0) return new Uint8Array() as T
        const response = await fetch(mediaUrl(args[0]) + (partial ? '' : `&maxBytes=${maxBytes}`), {
          headers: partial ? { Range: `bytes=0-${Math.floor(maxBytes) - 1}` } : {}, referrerPolicy: 'no-referrer'
        })
        if (!response.ok) throw new Error(`Audio read failed: HTTP ${response.status}`)
        const buffer = await response.arrayBuffer()
        return (partial ? new Uint8Array(buffer) : buffer) as T
      } catch (error) { console.error(error); return null as T }
    }
    return decode(await invoke<T>('desktop_invoke', { channel, args: args.map(encode) }))
  },
  send(channel: string, ...args: any[]) {
    if (channel === 'discord:audio-chunk') {
      // A binary body avoids JSON/base64 expansion in the real-time capture path.
      // Queue whole requests to retain MediaRecorder chunk ordering.
      audioQueue = audioQueue.then(async () => {
        const response = await fetch(`${mediaBase}/audio`, { method: 'POST', body: args[0], referrerPolicy: 'no-referrer' })
        if (!response.ok) throw new Error(`Discord audio transport failed: ${response.status}`)
      }).catch(error => console.error(error))
      return
    }
    void invoke('desktop_send', { channel, args }).catch(error => console.error(error))
  }
}

// The historical API name is intentional. No Electron module or preload remains;
// keeping the name and signatures avoids changing every renderer component.
export const desktop = {
  ...bridge,
  openDirectory: () => bridge.invoke('dialog:openDirectory'),
  listMusicFiles: (path: string) => bridge.invoke('files:listMusic', path),
  getAudioMetadata: (path: string, options?: { loadArtwork: boolean }) => bridge.invoke('files:getMetadata', path, options),
  getAudioMetadataBatch: (paths: string[]) => bridge.invoke('files:getMetadataBatch', paths),
  getAudioArtwork: (path: string) => bridge.invoke('files:getArtwork', path),
  readFileBufferPartial: (path: string, maxBytes: number) => bridge.invoke('files:readBufferPartial', path, maxBytes),
  readFileBuffer: (path: string, maxBytes?: number) => bridge.invoke('files:readBuffer', path, maxBytes),
  checkUpdate: () => bridge.invoke('update:check'),
  installUpdate: () => bridge.invoke('update:install'),
  getAppVersion: () => bridge.invoke('app:version'),
  onUpdateStatus: (callback: (status: any) => void) => bridge.on('update-status', (_, data) => callback(data)),
  getArtistImage: (name: string) => bridge.invoke('search:artistImage', name),
  searchYouTube: (query: string, pagesToLoad?: number) => bridge.invoke('search:youtube', query, pagesToLoad),
  getYouTubePreview: (url: string, title?: string, artist?: string) => bridge.invoke('search:youtubePreview', url, title, artist),
  downloadYouTube: (url: string, title: string, artist?: string, format?: string) => bridge.invoke('download:youtube', url, title, artist, format),
  downloadYouTubeToDir: (url: string, title: string, artist: string, dir: string, limitRate?: string, fileTimestamp?: number, format?: string) => bridge.invoke('download:youtubeToDir', url, title, artist, dir, limitRate, fileTimestamp, format),
  getLyrics: (title: string, artist: string, filePath?: string, duration?: number, aiConfig?: any) => bridge.invoke('search:lyrics', title, artist, filePath, duration, aiConfig),
  getGpuLyricsStatus: () => bridge.invoke('lyrics:gpuStatus'),
  getLyricsComputeDevices: () => bridge.invoke('lyrics:computeDevices'),
  calibrateLyricsGpu: (audioPath: string, rawLyrics: string | undefined, mode: string, force?: boolean, computeConfig?: any) => bridge.invoke('lyrics:gpuCalibrate', audioPath, rawLyrics, mode, force, computeConfig),
  onGpuLyricsProgress: (callback: (data: any) => void) => bridge.on('lyrics:gpuProgress', (_, data) => callback(data)),
  onDownloadProgress: (callback: (data: { url: string; speed: string; percent?: number }) => void) => { bridge.on('download:progress', (_, data) => callback(data)) },
  offDownloadProgress: () => bridge.removeAllListeners('download:progress'),
  updateDiscordPresence: (data: any) => bridge.invoke('discord:updatePresence', data),
  clearDiscordPresence: () => bridge.invoke('discord:clearPresence')
}

function installChrome(platform: string) {
  const mini = new URLSearchParams(location.search).get('mini') === 'true'
  // Preserve the existing CSS drag/no-drag regions without depending on an
  // Electron-only Chromium property. This also works in the transparent mini.
  document.addEventListener('mousedown', event => {
    if (event.button !== 0 || !(event.target instanceof Element)) return
    if (getComputedStyle(event.target).getPropertyValue('--nw-app-region').trim() !== 'drag') return
    event.preventDefault()
    if (event.detail === 2 && !mini) void bridge.invoke('window:maximize')
    else void bridge.invoke('window:startDrag')
  })
  if (platform !== 'win32' || mini) return
  document.addEventListener('contextmenu', event => {
    if (event.target instanceof Element && getComputedStyle(event.target).getPropertyValue('--nw-app-region').trim() === 'drag') {
      event.preventDefault()
      void bridge.invoke('window:systemMenu')
    }
  })
  const controls = document.createElement('div')
  controls.className = 'native-caption-controls'
  const icons = [
    ['最小化', 'window:minimize', '<path d="M1 6h10"/>'],
    ['最大化', 'window:maximize', '<path d="M1.5 1.5h9v9h-9z"/>'],
    ['關閉', 'window:close', '<path d="m1.5 1.5 9 9m0-9-9 9"/>']
  ]
  icons.forEach(([label, command, icon]) => {
    const button = document.createElement('button')
    button.setAttribute('aria-label', label)
    button.title = label
    button.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">${icon}</svg>`
    button.onclick = () => { void bridge.invoke(command).catch(console.error) }
    controls.appendChild(button)
  })
  const maximize = controls.children[1] as HTMLButtonElement
  bridge.on('window:maximized', (_, value) => {
    maximize.title = value ? '還原' : '最大化'
    maximize.setAttribute('aria-label', maximize.title)
    maximize.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">${value ? '<path d="M3.5 3.5v-2h7v7h-2m-7-5h7v7h-7z"/>' : icons[1][2]}</svg>`
  })
  document.body.appendChild(controls)
}

export async function initializeDesktop() {
  window.ipcRenderer = desktop
  const nativeWindow = getCurrentWebviewWindow()
  await nativeWindow.listen<DesktopEvent>('desktop-event', ({ payload }) => {
    for (const callback of [...listeners.get(payload.channel) || []]) {
      try { callback({}, ...payload.args.map(decode)) } catch (error) { originalConsole.error(error) }
    }
  })
  const bootstrap = await desktop.invoke<{ mediaBase: string; preferences: Record<string, string>; platform: string }>('desktop:bootstrap')
  mediaBase = bootstrap.mediaBase
  for (const [key, value] of Object.entries(bootstrap.preferences)) {
    if (localStorage.getItem(key) === null) localStorage.setItem(key, value)
  }
  const set = Storage.prototype.setItem
  const remove = Storage.prototype.removeItem
  const persist = (key: string, value: string | null) => {
    if (!/^(neonwave_|nw_|discord_|artist_img_|lyrics_)/.test(key)) return
    preferenceQueue = preferenceQueue.then(() => bridge.invoke('storage:set', key, value)).catch(error => originalConsole.error('Preference write failed', error))
  }
  Storage.prototype.setItem = function(key, value) { set.call(this, key, value); if (this === localStorage) persist(key, String(value)) }
  Storage.prototype.removeItem = function(key) { remove.call(this, key); if (this === localStorage) persist(key, null) }
  const clear = Storage.prototype.clear
  Storage.prototype.clear = function() {
    const keys = this === localStorage ? Object.keys(this) : []
    clear.call(this)
    keys.forEach(key => persist(key, null))
  }
  for (const level of ['log', 'info', 'warn', 'error', 'debug'] as const) {
    console[level] = (...args: any[]) => {
      originalConsole[level](...args)
      const message = args.map(value => value instanceof Error ? value.stack || value.message : typeof value === 'object' ? JSON.stringify(value) : String(value)).join(' ')
      void bridge.invoke('renderer:log', level, message).catch(() => {})
    }
  }
  window.addEventListener('error', event => console.error(event.error || event.message))
  window.addEventListener('unhandledrejection', event => console.error(event.reason))
  bridge.on('desktop:error', (_, message) => { console.error(message); alert(message) })
  if (nativeWindow.label === 'main') {
    bridge.on('desktop:before-close', () => { void preferenceQueue.then(() => bridge.invoke('app:quit')).catch(console.error) })
  }
  installChrome(bootstrap.platform)
}

export async function desktopReady() { await invoke('desktop_ready') }
export const writeClipboard = (text: string) => bridge.invoke('clipboard:writeText', text)
export const openDeveloperPortal = () => bridge.invoke('shell:openExternal', 'https://discord.com/developers/applications')
