import RPC from 'discord-rpc';

export class DiscordRPCManager {
    private client: RPC.Client | null = null;
    private clientId: string = '1464451133346021512'; // Reverted to correct NeonWave Client ID
    private isReady: boolean = false;
    private currentActivity: any = null;

    constructor() {
        // init on demand or now
    }

    async connect() {
        if (this.client) return;

        this.client = new RPC.Client({ transport: 'ipc' });

        this.client.on('ready', () => {
            console.log('[DiscordRPC] Ready');
            this.isReady = true;
            if (this.currentActivity) {
                this.setActivity(this.currentActivity);
            }
        });

        try {
            await this.client.login({ clientId: this.clientId });
        } catch (e) {
            console.error('[DiscordRPC] Login failed:', e);
            this.client = null;
            this.isReady = false;
        }
    }

    async setActivity(data: {
        title: string;
        artist?: string;
        album?: string;
        duration?: number;
        elapsed?: number;
        artworkUrl?: string; // Should be a public URL
        isPaused?: boolean;
    }) {
        this.currentActivity = data;
        if (!this.client || !this.isReady) {
            await this.connect();
            if (!this.isReady) return;
        }

        const { title, artist, duration, elapsed, artworkUrl, isPaused } = data;

        const activity: RPC.Presence = {
            details: title,
            state: artist || 'Listening...',
            largeImageKey: artworkUrl || 'logo',
            largeImageText: title,
            instance: false,
        };

        if (!isPaused && duration && elapsed !== undefined) {
            const startTimestamp = Date.now() - (elapsed * 1000);
            activity.startTimestamp = startTimestamp;
            activity.endTimestamp = startTimestamp + (duration * 1000);
        }

        if (isPaused) {
            activity.smallImageKey = 'pause';
            activity.smallImageText = 'Paused';
        } else {
            activity.smallImageKey = 'play';
            activity.smallImageText = 'Playing';
        }

        try {
            await this.client!.setActivity(activity);
        } catch (e) {
            console.error('[DiscordRPC] Set activity failed:', e);
        }
    }

    async searchArtistImage(artistName: string): Promise<string | null> {
        try {
            // 1. Try Deezer
            const deezerUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=1`
            try {
                const resDeezer = await fetch(deezerUrl)
                if (resDeezer.ok) {
                    const dataDeezer: any = await resDeezer.json()
                    if (dataDeezer && dataDeezer.data && dataDeezer.data.length > 0) {
                        return dataDeezer.data[0].picture_medium || dataDeezer.data[0].picture_big
                    }
                }
            } catch (err) { }

            // 2. Fallback to iTunes
            const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&media=music&entity=album&limit=1`
            const resItunes = await fetch(itunesUrl)
            if (resItunes.ok) {
                const dataItunes: any = await resItunes.json()
                if (dataItunes && dataItunes.results && dataItunes.results.length > 0) {
                    const artwork = dataItunes.results[0].artworkUrl100
                    if (artwork) return artwork.replace('100x100bb', '600x600bb')
                }
            }

            // 3. Fallback to TheAudioDB
            try {
                const audioDbUrl = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName)}`
                const resAudioDb = await fetch(audioDbUrl)
                if (resAudioDb.ok) {
                    const dataAudioDb: any = await resAudioDb.json()
                    if (dataAudioDb && dataAudioDb.artists && dataAudioDb.artists.length > 0) {
                        return dataAudioDb.artists[0].strArtistThumb || dataAudioDb.artists[0].strArtistFanart
                    }
                }
            } catch (err) { }
        } catch (e) { }
        return null
    }

    async clearActivity() {
        this.currentActivity = null;
        if (this.client && this.isReady) {
            try {
                await this.client.clearActivity();
            } catch (e) {
                console.error('[DiscordRPC] Clear activity failed:', e);
            }
        }
    }
}
