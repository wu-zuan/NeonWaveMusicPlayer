
import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus
} from '@discordjs/voice';
import { Readable } from 'node:stream';

export class DiscordBotManager {
    private client: Client | null = null;
    private player = createAudioPlayer();
    private currentConnection: any = null;
    public isConnected = false;
    public currentGuildId: string | null = null;
    public currentChannelId: string | null = null;

    constructor() {
        this.player.on('error', error => {
            console.error('[DiscordBot] Audio Player Error:', error.message);
        });

        this.player.on(AudioPlayerStatus.Playing, () => {
            console.log('[DiscordBot] Audio Player Playing');
        });

        this.player.on(AudioPlayerStatus.Idle, () => {
            console.log('[DiscordBot] Audio Player Idle');
        });
    }

    async login(token: string): Promise<{ username: string, avatar: string | null }> {
        // Destroy old client if exists
        if (this.client) {
            await this.disconnect();
            await this.client.destroy();
        }

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates
            ]
        });

        return new Promise((resolve, reject) => {
            if (!this.client) return reject("Client init failed");

            // Timeout safety
            const timeout = setTimeout(() => {
                reject(new Error("Login timed out"));
            }, 10000);

            this.client.once('ready', async (c) => {
                clearTimeout(timeout);
                console.log(`[DiscordBot] Ready! Logged in as ${c.user.tag}`);
                this.isConnected = true;
                resolve({
                    username: c.user.tag,
                    avatar: c.user.avatarURL()
                });
            });

            this.client.login(token).catch((e) => {
                clearTimeout(timeout);
                reject(e);
            });
        });
    }

    getGuilds() {
        if (!this.client || !this.isConnected) throw new Error("Bot not connected");
        return this.client.guilds.cache.map(g => ({
            id: g.id,
            name: g.name,
            icon: g.iconURL(),
            memberCount: g.memberCount
        })).sort((a, b) => a.name.localeCompare(b.name));
    }

    getChannels(guildId: string) {
        if (!this.client || !this.isConnected) throw new Error("Bot not connected");
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) throw new Error("Guild not found");

        const channels = guild.channels.cache
            .filter(c => c.type === ChannelType.GuildVoice)
            .map(c => ({
                id: c.id,
                name: c.name,
                userLimit: c.userLimit,
                members: c.members.map(m => m.user.tag) // Preview who is there
            }))
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort by position? usually position is better but name is safely available

        return channels;
    }

    async joinChannel(guildId: string, channelId: string) {
        if (!this.client || !this.isConnected) throw new Error("Bot not connected");
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) throw new Error("Guild not found");

        const channel = guild.channels.cache.get(channelId);
        if (!channel || channel.type !== ChannelType.GuildVoice) throw new Error("Invalid channel");

        try {
            this.currentConnection = joinVoiceChannel({
                channelId: channelId,
                guildId: guildId,
                adapterCreator: guild.voiceAdapterCreator as any, // Type cast often needed with strict TS
            });

            this.currentConnection.subscribe(this.player);

            this.currentGuildId = guildId;
            this.currentChannelId = channelId;

            console.log(`[DiscordBot] Joined channel ${channel.name} in ${guild.name}`);
            return true;
        } catch (e) {
            console.error("[DiscordBot] Join Error:", e);
            throw e;
        }
    }

    async leaveChannel() {
        if (this.currentConnection) {
            this.currentConnection.destroy();
            this.currentConnection = null;
            this.currentGuildId = null;
            this.currentChannelId = null;
            return true;
        }
        return false;
    }

    async disconnect() {
        this.stop();
        await this.leaveChannel();
        if (this.client) {
            await this.client.destroy();
            this.client = null;
            this.isConnected = false;
        }
    }

    // Play local file
    async playFile(filePath: string) {
        try {
            console.log(`[DiscordBot] Playing file: ${filePath}`);
            // Force ffmpeg via createAudioResource for broader format support if needed, 
            // but for simple mp3, direct stream might work. 
            // Using ffmpeg is safer for various formats (flac, etc)
            const resource = createAudioResource(filePath, {
                metadata: {
                    title: filePath
                }
            });
            this.player.play(resource);
        } catch (e) {
            console.error("[DiscordBot] Play File Error:", e);
        }
    }

    // Play Stream (from ytdl for example)
    // Note: If resource is a Readable stream
    async playStream(stream: Readable) {
        try {
            console.log(`[DiscordBot] Playing stream`);
            const resource = createAudioResource(stream);
            this.player.play(resource);
        } catch (e) {
            console.error("[DiscordBot] Play Stream Error:", e);
        }
    }

    pause() {
        this.player.pause();
    }

    resume() {
        this.player.unpause();
    }

    stop() {
        this.player.stop();
    }
}
