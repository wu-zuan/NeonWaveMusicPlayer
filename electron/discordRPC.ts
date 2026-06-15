import RPC from 'discord-rpc';
import { searchArtistImage as searchArtistImageShared } from './utils/artistSearch';

export class DiscordRPCManager {
    private client: RPC.Client | null = null;
    private clientId: string = '1464451133346021512'; 
    private isReady: boolean = false;
    private currentActivity: any = null;

    constructor() {
        
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
            // Set a 5-second connection timeout for Discord RPC login
            const loginPromise = this.client.login({ clientId: this.clientId });
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Discord RPC login timed out after 5000ms')), 5000);
            });

            await Promise.race([loginPromise, timeoutPromise]);
        } catch (e) {
            console.error('[DiscordRPC] Connection failed or timed out:', e);
            if (this.client) {
                try {
                    await this.client.destroy();
                } catch (destroyErr) {
                    console.error('[DiscordRPC] Error destroying client:', destroyErr);
                }
            }
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
        artworkUrl?: string; 
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
        return searchArtistImageShared(artistName)
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
