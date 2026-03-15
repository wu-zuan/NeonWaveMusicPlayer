/// <reference types="vite/client" />

interface Window {
    ipcRenderer: {
        invoke<T = any>(channel: string, ...args: any[]): Promise<T>
        openDirectory(): Promise<string | null>
        listMusicFiles(path: string): Promise<string[]>
        getAudioMetadata(path: string, options?: { loadArtwork: boolean }): Promise<any>
        getAudioArtwork(path: string): Promise<string | null>
        readFileBuffer(path: string): Promise<Uint8Array | null>

        checkUpdate(): Promise<void>
        installUpdate(): Promise<void>
        getAppVersion(): Promise<string>
        onUpdateStatus(callback: (status: any) => void): () => void
        searchYouTube(query: string): Promise<any[]>
        getYouTubePreview(url: string, title?: string, artist?: string): Promise<{ url: string, startTime: number } | null>
        downloadYouTube(url: string, title: string, artist?: string): Promise<string | null>
        getArtistImage(name: string): Promise<string | null>
        getLyrics(title: string, artist: string, filePath?: string, duration?: number): Promise<string | null>

        // Discord Bot
        invoke(channel: 'discord:login', token: string): Promise<{ username: string; avatar: string | null }>
        invoke(channel: 'discord:getGuilds'): Promise<any[]>
        invoke(channel: 'discord:getChannels', guildId: string): Promise<any[]>
        invoke(channel: 'discord:join', guildId: string, channelId: string): Promise<boolean>
        invoke(channel: 'discord:leave'): Promise<boolean>
        invoke(channel: 'discord:play', filePath: string): Promise<void>
        invoke(channel: 'discord:pause'): Promise<void>
        invoke(channel: 'discord:resume'): Promise<void>
        invoke(channel: 'discord:stop'): Promise<void>
        invoke(channel: 'discord:setVolume', volume: number): Promise<boolean>
        invoke(channel: 'discord:startStreamMode'): Promise<boolean>
        invoke(channel: 'discord:status'): Promise<{ isConnected: boolean; username: string | null; avatar: string | null; currentGuildId: string | null; currentChannelId: string | null; currentGuildName: string | null; currentChannelName: string | null }>


        on(channel: string, listener: (...args: any[]) => void): void
        off(channel: string, listener: (...args: any[]) => void): void
        send(channel: string, ...args: any[]): void
    }
}
