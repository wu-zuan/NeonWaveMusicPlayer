import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  listMusicFiles: (path: string) => ipcRenderer.invoke('files:listMusic', path),
  getAudioMetadata: (path: string, options?: { loadArtwork: boolean }) => ipcRenderer.invoke('files:getMetadata', path, options),
  getAudioArtwork: (path: string) => ipcRenderer.invoke('files:getArtwork', path),
  readFileBuffer: (path: string) => ipcRenderer.invoke('files:readBuffer', path),

  // Update
  checkUpdate: () => ipcRenderer.invoke('update:check'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  getAppVersion: () => ipcRenderer.invoke('app:version'),
  onUpdateStatus: (callback: (status: any) => void) => {
    ipcRenderer.on('update-status', (_, data) => callback(data))
    return () => ipcRenderer.removeAllListeners('update-status')
  },
  getArtistImage: (name: string) => ipcRenderer.invoke('search:artistImage', name),
  searchYouTube: (query: string) => ipcRenderer.invoke('search:youtube', query),
  getYouTubePreview: (url: string, title?: string, artist?: string) => ipcRenderer.invoke('search:youtubePreview', url, title, artist),
  downloadYouTube: (url: string, title: string, artist?: string, format?: string) => ipcRenderer.invoke('download:youtube', url, title, artist, format),
  downloadYouTubeToDir: (url: string, title: string, artist: string, dir: string, limitRate?: string, fileTimestamp?: number, format?: string) => ipcRenderer.invoke('download:youtubeToDir', url, title, artist, dir, limitRate, fileTimestamp, format),
  getLyrics: (title: string, artist: string, filePath?: string, duration?: number) => ipcRenderer.invoke('search:lyrics', title, artist, filePath, duration),
  onDownloadProgress: (callback: (data: { url: string, speed: string, percent?: number }) => void) => {
    ipcRenderer.on('download:progress', (_, data) => callback(data))
  },
  offDownloadProgress: () => {
    ipcRenderer.removeAllListeners('download:progress')
  },
  updateDiscordPresence: (data: any) => ipcRenderer.invoke('discord:updatePresence', data),
  clearDiscordPresence: () => ipcRenderer.invoke('discord:clearPresence')
})
