"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(channel, listener) {
    const wrappedListener = (event, ...args) => listener(event, ...args);
    electron.ipcRenderer.on(channel, wrappedListener);
    return () => electron.ipcRenderer.removeListener(channel, wrappedListener);
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  openDirectory: () => electron.ipcRenderer.invoke("dialog:openDirectory"),
  listMusicFiles: (path) => electron.ipcRenderer.invoke("files:listMusic", path),
  getAudioMetadata: (path, options) => electron.ipcRenderer.invoke("files:getMetadata", path, options),
  getAudioArtwork: (path) => electron.ipcRenderer.invoke("files:getArtwork", path),
  readFileBuffer: (path) => electron.ipcRenderer.invoke("files:readBuffer", path),
  readFileBufferPartial: (path, maxBytes) => electron.ipcRenderer.invoke("files:readBufferPartial", path, maxBytes),
  checkUpdate: () => electron.ipcRenderer.invoke("update:check"),
  installUpdate: () => electron.ipcRenderer.invoke("update:install"),
  getAppVersion: () => electron.ipcRenderer.invoke("app:version"),
  onUpdateStatus: (callback) => {
    electron.ipcRenderer.on("update-status", (_, data) => callback(data));
    return () => electron.ipcRenderer.removeAllListeners("update-status");
  },
  getArtistImage: (name) => electron.ipcRenderer.invoke("search:artistImage", name),
  searchYouTube: (query, pagesToLoad) => electron.ipcRenderer.invoke("search:youtube", query, pagesToLoad),
  getYouTubePreview: (url, title, artist) => electron.ipcRenderer.invoke("search:youtubePreview", url, title, artist),
  downloadYouTube: (url, title, artist, format) => electron.ipcRenderer.invoke("download:youtube", url, title, artist, format),
  downloadYouTubeToDir: (url, title, artist, dir, limitRate, fileTimestamp, format) => electron.ipcRenderer.invoke("download:youtubeToDir", url, title, artist, dir, limitRate, fileTimestamp, format),
  getLyrics: (title, artist, filePath, duration, aiConfig) => electron.ipcRenderer.invoke("search:lyrics", title, artist, filePath, duration, aiConfig),
  onDownloadProgress: (callback) => {
    electron.ipcRenderer.on("download:progress", (_, data) => callback(data));
  },
  offDownloadProgress: () => {
    electron.ipcRenderer.removeAllListeners("download:progress");
  },
  updateDiscordPresence: (data) => electron.ipcRenderer.invoke("discord:updatePresence", data),
  clearDiscordPresence: () => electron.ipcRenderer.invoke("discord:clearPresence")
});
