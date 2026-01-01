/// <reference types="vite/client" />

interface Window {
    ipcRenderer: {
        invoke<T = any>(channel: string, ...args: any[]): Promise<T>
        openDirectory(): Promise<string | null>
        listMusicFiles(path: string): Promise<string[]>
        getAudioMetadata(path: string): Promise<any>
        readFileBuffer(path: string): Promise<Uint8Array | null>

        checkUpdate(): Promise<void>
        installUpdate(): Promise<void>
        getAppVersion(): Promise<string>
        onUpdateStatus(callback: (status: any) => void): () => void
        searchYouTube(query: string): Promise<any[]>
        getArtistImage(name: string): Promise<string | null>
        getLyrics(title: string, artist: string, filePath?: string): Promise<string | null>

        on(channel: string, listener: (...args: any[]) => void): void
        off(channel: string, listener: (...args: any[]) => void): void
        send(channel: string, ...args: any[]): void
    }
}
