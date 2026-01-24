
import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    StreamType,
    AudioResource
} from '@discordjs/voice';
import { Readable, PassThrough } from 'node:stream';

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

    // Play local file - using explicit FFmpeg spawn for reliability
    async playFile(filePath: string, ffmpegPath?: string) {
        try {
            console.log(`[DiscordBot] Playing file: ${filePath}`);

            // Check if we have an active connection
            if (!this.currentConnection) {
                throw new Error('No active voice connection. Please join a channel first.');
            }

            // Check connection state
            const connState = this.currentConnection.state.status;
            console.log(`[DiscordBot] Connection state: ${connState}`);

            if (connState === 'destroyed' || connState === 'disconnected') {
                throw new Error(`Voice connection is ${connState}. Cannot play audio.`);
            }

            if (!ffmpegPath) {
                console.warn('[DiscordBot] No FFmpeg path provided, using fallback direct resource');
                const resource = createAudioResource(filePath, {
                    metadata: { title: filePath },
                    inlineVolume: true
                });
                this.currentResource = resource;
                resource.volume?.setVolume(1.0);
                this.player.play(resource);
                return;
            }

            // Spawn FFmpeg to convert to PCM
            // Arguments: Input file -> s16le/48000/2ch -> pipe:1
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

            console.log(`[DiscordBot] Spawning FFmpeg: ${ffmpegPath} ${args.join(' ')}`);
            const ffmpegProcess = spawn(ffmpegPath, args);

            let hasStarted = false;

            ffmpegProcess.on('error', (err) => {
                console.error('[DiscordBot] FFmpeg Spawn Error:', err);
            });

            ffmpegProcess.on('close', (code) => {
                console.log(`[DiscordBot] FFmpeg process exited with code ${code}`);
            });

            // Log stderr for diagnostics
            ffmpegProcess.stderr?.on('data', (data) => {
                const msg = data.toString();
                console.log(`[DiscordBot] FFmpeg: ${msg}`);
            });

            // Monitor stdout to confirm data is flowing
            ffmpegProcess.stdout?.on('data', () => {
                if (!hasStarted) {
                    console.log('[DiscordBot] FFmpeg audio stream started');
                    hasStarted = true;
                }
            });

            // Create Audio Resource from stdout
            const resource = createAudioResource(ffmpegProcess.stdout, {
                inputType: StreamType.Raw,
                metadata: {
                    title: filePath
                },
                inlineVolume: true
            });
            this.currentResource = resource;
            // Default volume 100%
            resource.volume?.setVolume(1.0);

            console.log('[DiscordBot] Audio resource created, starting playback');
            this.player.play(resource);

            // Log playback events
            const playingHandler = () => {
                console.log('[DiscordBot] ✓ Audio player is now playing');
            };
            const idleHandler = () => {
                console.log('[DiscordBot] Audio player became idle');
            };
            const errorHandler = (error: Error) => {
                console.error('[DiscordBot] Audio player error:', error);
            };

            // Clean up old listeners to avoid memory leaks
            this.player.removeAllListeners(AudioPlayerStatus.Playing);
            this.player.removeAllListeners(AudioPlayerStatus.Idle);
            this.player.removeAllListeners('error');

            this.player.once(AudioPlayerStatus.Playing, playingHandler);
            this.player.once(AudioPlayerStatus.Idle, idleHandler);
            this.player.once('error', errorHandler);

        } catch (e) {
            console.error("[DiscordBot] Play File Error:", e);
            throw e; // Re-throw so caller knows it failed
        }
    }

    // Play Stream (from ytdl for example)
    // Note: If resource is a Readable stream
    async playStream(stream: Readable) {
        try {
            console.log(`[DiscordBot] Playing stream`);
            // Enable inline volume for streams too
            const resource = createAudioResource(stream, {
                inlineVolume: true
            });
            this.currentResource = resource;
            // Set initial volume if needed, e.g. 1.0
            resource.volume?.setVolume(1.0);

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

    setVolume(volume: number) {
        // volume is 0-100
        const normalized = Math.max(0, Math.min(100, volume)) / 100;
        console.log(`[DiscordBot] Setting volume to ${normalized}`);

        if (this.currentResource && this.currentResource.volume) {
            this.currentResource.volume.setVolume(normalized);
            return true;
        }
        return false;
    }

    // --- Streaming from Renderer ---

    async playReceiverStream(ffmpegPath?: string) {
        if (!this.currentConnection) throw new Error("Not connected");

        console.log('[DiscordBot] Starting Receiver Stream...');
        this.streamInput = new PassThrough();

        // 1. If FFmpeg path provided, use manual spawning (Robust for Electron/Asar)
        if (ffmpegPath) {
            console.log(`[DiscordBot] Using manual FFmpeg spawn: ${ffmpegPath}`);
            const { spawn } = await import('node:child_process');

            const args = [
                '-i', 'pipe:0',      // Input from stdin (PassThrough)
                '-analyzeduration', '0',
                '-loglevel', '0',
                '-f', 's16le',       // Output PCM s16le
                '-ar', '48000',
                '-ac', '2',
                'pipe:1'             // Output to stdout
            ];

            const ffmpegProcess = spawn(ffmpegPath, args);

            // Pipe our input stream (chunks) into FFmpeg stdin
            this.streamInput.pipe(ffmpegProcess.stdin);

            ffmpegProcess.on('error', (err) => {
                console.error('[DiscordBot] Stream FFmpeg Error:', err);
            });

            // Use FFmpeg stdout as raw PCM audio source
            const resource = createAudioResource(ffmpegProcess.stdout, {
                inputType: StreamType.Raw,
                inlineVolume: true
            });

            this.currentResource = resource;
            resource.volume?.setVolume(1.0);
            this.player.play(resource);

        } else {
            // 2. Fallback: Trust prism-media to find ffmpeg (likely fails in packaged app)
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
            this.streamInput.write(buffer);
        }
    }
}
