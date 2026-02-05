
import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    AudioResource
} from '@discordjs/voice';
import { PassThrough } from 'node:stream';

export class DiscordBotManager {
    private client: Client | null = null;
    private player = createAudioPlayer();
    private currentResource: AudioResource | null = null;
    private currentConnection: any = null;
    private streamInput: PassThrough | null = null;
    public isConnected = false;
    public currentGuildId: string | null = null;
    public currentChannelId: string | null = null;

    constructor() {
        this.player.on('error', error => {
            console.error('[DiscordBot] Audio Player Error:', error.message);
        });
    }

    async login(token: string): Promise<{ username: string, avatar: string | null }> {
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

            const timeout = setTimeout(() => {
                reject(new Error("Login timed out"));
            }, 10000);

            this.client.once('ready', async (c) => {
                clearTimeout(timeout);
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
                members: c.members.map(m => m.user.tag)
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

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
                adapterCreator: guild.voiceAdapterCreator as any,
            });

            this.currentConnection.subscribe(this.player);

            this.currentGuildId = guildId;
            this.currentChannelId = channelId;

            return true;
        } catch (e) {
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

    getStatus() {
        return {
            isConnected: this.isConnected,
            username: this.client?.user?.tag || null,
            avatar: this.client?.user?.avatarURL() || null,
            currentGuildId: this.currentGuildId,
            currentChannelId: this.currentChannelId,
            currentGuildName: this.client?.guilds.cache.get(this.currentGuildId!)?.name || null,
            currentChannelName: this.client?.guilds.cache.get(this.currentGuildId!)?.channels.cache.get(this.currentChannelId!)?.name || null
        };
    }

    async playFile(filePath: string, ffmpegPath?: string) {
        try {
            if (!this.currentConnection) {
                throw new Error('No active voice connection. Please join a channel first.');
            }

            const connState = this.currentConnection.state.status;

            if (connState === 'destroyed' || connState === 'disconnected') {
                throw new Error(`Voice connection is ${connState}. Cannot play audio.`);
            }

            if (!ffmpegPath) {
                const resource = createAudioResource(filePath, {
                    metadata: { title: filePath },
                    inlineVolume: true
                });
                this.currentResource = resource;
                resource.volume?.setVolume(1.0);
                this.player.play(resource);
                return;
            }

            const { spawn } = await import('node:child_process');

            const args = [
                '-i', filePath,
                '-analyzeduration', '0',
                '-loglevel', '0',
                '-f', 's16le',
                '-ar', '48000',
                '-ac', '2',
                'pipe:1'
            ];

            const ffmpegProcess = spawn(ffmpegPath, args);

            let hasStarted = false;

            ffmpegProcess.on('error', (err) => {
                console.error('[DiscordBot] FFmpeg Spawn Error:', err);
            });

            ffmpegProcess.on('close', () => { });

            ffmpegProcess.stdout?.on('data', () => {
                if (!hasStarted) {
                    hasStarted = true;
                }
            });

            const resource = createAudioResource(ffmpegProcess.stdout, {
                inputType: StreamType.Raw,
                metadata: {
                    title: filePath
                },
                inlineVolume: true
            });
            this.currentResource = resource;
            resource.volume?.setVolume(1.0);

            this.player.play(resource);

        } catch (e) {
            throw e;
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

    setVolume(volume: number) {
        const normalized = Math.max(0, Math.min(100, volume)) / 100;

        if (this.currentResource && this.currentResource.volume) {
            this.currentResource.volume.setVolume(normalized);
            return true;
        }
        return false;
    }

    async playReceiverStream(ffmpegPath?: string) {
        if (!this.currentConnection) throw new Error("Not connected");

        this.streamInput = new PassThrough();

        if (ffmpegPath) {
            const { spawn } = await import('node:child_process');

            const args = [
                '-i', 'pipe:0',
                '-analyzeduration', '0',
                '-loglevel', '0',
                '-f', 's16le',
                '-ar', '48000',
                '-ac', '2',
                'pipe:1'
            ];

            const ffmpegProcess = spawn(ffmpegPath, args);

            ffmpegProcess.stdin.on('error', () => { });

            this.streamInput.pipe(ffmpegProcess.stdin);

            this.streamInput.on('error', () => { });

            ffmpegProcess.on('error', () => {
                if (this.streamInput) this.streamInput.destroy();
            });

            ffmpegProcess.on('close', () => {
                if (this.streamInput) this.streamInput.destroy();
            });

            const resource = createAudioResource(ffmpegProcess.stdout, {
                inputType: StreamType.Raw,
                inlineVolume: true
            });

            this.currentResource = resource;
            resource.volume?.setVolume(1.0);
            this.player.play(resource);

        } else {
            const resource = createAudioResource(this.streamInput, {
                inputType: StreamType.WebmOpus,
                inlineVolume: true
            });

            this.currentResource = resource;
            resource.volume?.setVolume(1.0);
            this.player.play(resource);
        }

        return true;
    }

    writeAudioChunk(buffer: Uint8Array) {
        if (this.streamInput && !this.streamInput.destroyed) {
            try {
                this.streamInput.write(buffer);
            } catch (e) {
                // ignore
            }
        }
    }
}
