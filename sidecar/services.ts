import { createRequire } from 'node:module'
import { Readable } from 'node:stream'
import path from 'node:path'
import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import os from 'node:os'
import { spawn } from 'node:child_process'
import extract from 'extract-zip'
import * as mm from 'music-metadata'
import type YtDlpWrapType from 'yt-dlp-wrap'
import type { Progress as YtDlpProgress } from 'yt-dlp-wrap'
import { DiscordBotManager } from './discordBot'
import { DiscordRPCManager } from './discordRPC'
import { searchArtistImage } from './utils/artistSearch'
import { searchTrackArtwork } from './utils/artworkSearch'
import { PartyRoomService, type PartyCommand } from './partyRoom'
import { searchLyrics } from './lyrics'
import { getGpuCalibrationStatus, runGpuLyricsCalibration, type GpuCalibrationMode } from './lyrics/gpuCalibration'
import { mapConcurrent } from '../shared/boundedCache'
import { MediaMetadataService } from './utils/mediaMetadata'

import { rpc, emit, native, onShutdown } from './transport'
import { userData } from './paths'
import { startActiveWindowMonitor, gpuInfo as queryGpuInfo } from './platform/windows'

const require = createRequire(import.meta.url)
const ffmpegPath = require('ffmpeg-static')

export async function startServices() {
  const dialog = {
    showOpenDialog: (...args: any[]) => native('dialog:open', args[args.length - 1]),
    showSaveDialog: (...args: any[]) => native('dialog:save', args[args.length - 1])
  }
  const activeWindowName = startActiveWindowMonitor()
  const startDiscordPowerSaveBlocker = () => { void native('power:set', true) }
  const stopDiscordPowerSaveBlocker = () => { void native('power:set', false) }
  const partyRoomService = new PartyRoomService((command: PartyCommand) => emit('main', 'party:command', command))
  const discordBot = new DiscordBotManager()
  onShutdown(async () => {
    await partyRoomService.stop()
    discordBot.stop()
    await discordBot.disconnect()
    stopDiscordPowerSaveBlocker()
  })
  const discordRPC = new DiscordRPCManager()

  
  // LRU image cache — limit to 200 entries to prevent unbounded memory growth
  const IMAGE_CACHE_MAX = 200;
  const imageCache = new Map<string, string>();

  function getFromImageCache(key: string): string | undefined {
    const val = imageCache.get(key);
    if (val) {
      // Move to end (most recently used)
      imageCache.delete(key);
      imageCache.set(key, val);
    }
    return val;
  }

  function setImageCache(key: string, value: string) {
    if (imageCache.has(key)) {
      imageCache.delete(key);
    } else if (imageCache.size >= IMAGE_CACHE_MAX) {
      // Evict oldest entry
      const oldest = imageCache.keys().next().value!;
      imageCache.delete(oldest);
    }
    imageCache.set(key, value);
  }

  rpc.handle('discord:updatePresence', async (_, data) => {
    const cacheKey = `${data.title}-${data.artist}`;
    let artworkUrl = 'logo';


    const cached = getFromImageCache(cacheKey);
    if (cached) {
        artworkUrl = cached;
    } else if (data.artworkUrl && data.artworkUrl.startsWith('http') && !data.artworkUrl.includes('localhost')) {
        artworkUrl = data.artworkUrl;
    }


    discordRPC.setActivity({ ...data, artworkUrl }).catch(() => {});

    // No usable artwork URL yet — look the track up on iTunes/Deezer in the
    // background and refresh the presence once found.
    if (artworkUrl === 'logo' && (data.title || data.artist)) {
        (async () => {
             try {
                const foundUrl = await searchTrackArtwork(data.title, data.artist);
                if (foundUrl) {
                    setImageCache(cacheKey, foundUrl);

                    discordRPC.setActivity({ ...data, artworkUrl: foundUrl }).catch(() => {});
                }
             } catch (e) {
                 console.error('[DiscordRPC] Background artwork lookup failed:', e);
             }
        })();
    }

    return true;
  })

  rpc.handle('discord:clearCache', () => {
    imageCache.clear();
    return true;
  })

  rpc.handle('discord:scanAndUpload', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
    });

    if (result.canceled || result.filePaths.length === 0) return { status: 'canceled' };

    const folderPath = result.filePaths[0];
    
    const walk = async (dir: string): Promise<string[]> => {
      let files: string[] = [];
      const list = await fs.readdir(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) files = files.concat(await walk(fullPath));
        else if (/\.(mp3|m4a|flac|wav|ogg)$/i.test(file)) files.push(fullPath);
      }
      return files;
    };

    const files = await walk(folderPath);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const metadata = await mm.parseFile(file, { skipCovers: true });
        const title = metadata.common.title;
        const artist = metadata.common.artist;

        if (title && artist) {
          const cacheKey = `${title}-${artist}`;
          if (!getFromImageCache(cacheKey)) {
            const foundUrl = await searchTrackArtwork(title, artist);
            if (foundUrl) {
              setImageCache(cacheKey, foundUrl);
              successCount++;
            }
          }
        }
      } catch (e) {
        console.error(`[ArtworkPreload] Error handling ${file}:`, e);
      }


      emit('main', 'discord:scanProgress', {
        current: i + 1,
        total: files.length,
        success: successCount
      });
    }

    return { status: 'completed', total: files.length, success: successCount };
  });

  rpc.handle('discord:clearPresence', () => {
    return discordRPC.clearActivity()
  })

  


  rpc.handle('discord:login', async (_, token) => {
    return await discordBot.login(token)
  })

  rpc.handle('discord:getGuilds', () => {
    return discordBot.getGuilds()
  })

  rpc.handle('discord:getChannels', (_, guildId) => {
    return discordBot.getChannels(guildId)
  })

  rpc.handle('discord:join', async (_, guildId, channelId) => {
    const joined = await discordBot.joinChannel(guildId, channelId)
    if (joined) startDiscordPowerSaveBlocker()
    return joined
  })

  rpc.handle('discord:leave', async () => {
    const left = await discordBot.leaveChannel()
    stopDiscordPowerSaveBlocker()
    return left
  })

  rpc.handle('discord:disconnect', async () => {
    const result = await discordBot.disconnect()
    stopDiscordPowerSaveBlocker()
    return result
  })

  rpc.handle('discord:play', async (_, filePath, startTime = 0) => {
    
    
    return await discordBot.playFile(filePath, ffmpegPath, startTime)
  })

  rpc.handle('discord:stop', () => {
    return discordBot.stop()
  })

  rpc.handle('discord:pause', () => {
    return discordBot.pause()
  })

  rpc.handle('discord:resume', () => {
    return discordBot.resume()
  })

  rpc.handle('discord:setVolume', (_, volume) => {
    return discordBot.setVolume(volume)
  })

  rpc.handle('discord:status', () => {
    return discordBot.getStatus()
  })

  
  rpc.handle('discord:startStreamMode', async () => {
    return await discordBot.playReceiverStream(ffmpegPath)
  })

  
  
  
  
  rpc.on('discord:audio-chunk', (_, buffer) => {
    discordBot.writeAudioChunk(new Uint8Array(buffer))
  })

  
    rpc.handle('party:status', () => {
        return partyRoomService?.getStatus() ?? {
            active: false,
            roomId: null,
            inviteUrl: null,
            localUrl: null,
            publicUrl: null,
            tunnelStatus: 'idle',
            tunnelMessage: undefined,
            cloudflaredAvailable: false,
            cloudflaredState: 'idle',
            cloudflaredMessage: undefined,
            cloudflaredProgress: undefined,
            track: null
        }
    })

    rpc.handle('party:start', async (_event, options?: { autoTunnel?: boolean }) => {
        if (!partyRoomService) throw new Error('Party service unavailable')
        return await partyRoomService.start(options)
    })

    rpc.handle('party:stop', async () => {
        if (!partyRoomService) return false
        await partyRoomService.stop()
        return true
    })

    rpc.handle('party:permissions', (_event, permissions: { next: boolean; seek: boolean }) => {
        if (!partyRoomService) throw new Error('Party service unavailable')
        return partyRoomService.setPermissions(permissions)
    })

    rpc.on('party:presentation', (_event, presentation) => {
        partyRoomService?.updatePresentation(presentation || {})
    })

    
    let latestPlayerSnapshot: Record<string, any> | null = null
    rpc.handle('player:getSnapshot', () => latestPlayerSnapshot)
    rpc.on('player:sync', (_, data) => {
        const artwork = data?.artwork !== undefined
            ? data.artwork
            : data?.path && data.path === latestPlayerSnapshot?.path ? latestPlayerSnapshot?.artwork : null
        latestPlayerSnapshot = { ...data, artwork }
        emit('mini', 'player:sync', data)
        void native('mini:passthrough', !!data?.isGameModeActive)
        if (partyRoomService) {
            partyRoomService.updatePlayback({
                path: data?.path,
                title: data?.title,
                artist: data?.artist,
                artwork: data?.artwork,
                currentTime: Number(data?.currentTime || 0),
                duration: Number(data?.duration || 0),
                isPlaying: !!data?.isPlaying
            })
        }
        // Mirror the current track onto the bot's "Listening to ..." presence
        if (discordBot && discordBot.isConnected && discordBot.currentChannelId) {
            try {
                discordBot.updateNowPlaying(data?.title || '', data?.artist || '', !!data?.isPlaying)
            } catch (e) {
                // Presence updates must never break player sync.
            }
        }
    })

  rpc.handle('files:listMusic', async (_, folderPath) => {
    if (!folderPath) return []
    try {
      const files = await fs.readdir(folderPath)
      const supportedExtensions = ['.mp3', '.wav', '.wma', '.m4a', '.flac', '.ogg', '.mp4', '.mov', '.wmv', '.avi']

      const fileStats = await mapConcurrent(files, 16, async file => {
        const fullPath = path.join(folderPath, file)
        const ext = path.extname(file).toLowerCase()
        if (!supportedExtensions.includes(ext)) return null

        try {
          const stats = await fs.stat(fullPath)
          if (!stats.isFile()) return null
          return {
            fullPath,
            mtime: stats.mtime.getTime()
          }
        } catch (e) {
          return null
        }
      })

      return fileStats
        .filter((f): f is { fullPath: string, mtime: number } => f !== null)
        .sort((a, b) => b.mtime - a.mtime)
        .map(f => f.fullPath)
    } catch (error) {
      console.error('Error reading directory:', error)
      return []
    }
  })

  const metadataService = new MediaMetadataService(path.join(userData, 'metadata-cache.json'))
  onShutdown(() => metadataService.close())

  // Batch metadata read for a folder scan. Returns lightweight metadata for
  // every path, hitting the disk parser only for new/changed files.
  rpc.handle('files:getMetadataBatch', async (_, filePaths: string[]) => {
    const results = await mapConcurrent(filePaths || [], 4, async (filePath) => {
      try {
        const { artwork: _artwork, ...metadata } = await metadataService.get(filePath, false)
        return { path: filePath, ...metadata }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
        return { path: filePath, title: null, artist: null, album: null, duration: 0 }
      }
    })
    return results.filter(Boolean)
  })

  rpc.handle('files:readBufferPartial', async (_, filePath, maxBytes) => {
    try {
      const fd = await fs.open(filePath, 'r')
      try {
        const byteLimit = Math.min(Math.max(0, Number(maxBytes) || 0), 128 * 1024 * 1024)
        const buffer = Buffer.alloc(Math.min(Math.floor(byteLimit), (await fd.stat()).size))
        const { bytesRead } = await fd.read(buffer, 0, buffer.length, 0)
        return buffer.subarray(0, bytesRead)
      } finally {
        await fd.close()
      }
    } catch (error) {
      console.error('Error reading partial file:', error)
      return null
    }
  })

  rpc.handle('files:readBuffer', async (_, filePath, maxBytes = 128 * 1024 * 1024) => {
    try {
      const stat = await fs.stat(filePath)
      if (stat.size > maxBytes) {
        throw new Error(`Audio file is too large for in-memory calibration (${stat.size} bytes)`)
      }
      const buffer = await fs.readFile(filePath)
      // The transport preserves the exact byte range of a Node Buffer
      // arrives in the renderer as an ArrayBuffer. Return an exact standalone
      // ArrayBuffer so decodeAudioData always receives the browser-native type.
      return buffer.byteOffset === 0 && buffer.byteLength === buffer.buffer.byteLength
        ? buffer.buffer
        : buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
    } catch (error) {
      console.error('Error reading audio file for calibration:', error)
      return null
    }
  })

  rpc.handle('files:getArtwork', async (_, filePath) => {
    try {
      return (await metadataService.get(filePath, true)).artwork
    } catch (e) {
      return null
    }
  })

  rpc.handle('files:getMetadata', async (_, filePath, options = { loadArtwork: true }) => {
    try {
      return await metadataService.get(filePath, !!options.loadArtwork)
    } catch (e) {
      
      return null
    }
  })

  rpc.handle('app:active-window', () => activeWindowName())

  const YtDlpWrap = createRequire(import.meta.url)('yt-dlp-wrap').default

  let youtubeRuntimePromise: Promise<string[]> | null = null

  const getDenoReleaseAsset = () => {
    const arch = process.arch === 'arm64' ? 'aarch64' : process.arch === 'x64' ? 'x86_64' : null
    if (!arch) return null

    if (process.platform === 'win32') return `deno-${arch}-pc-windows-msvc.zip`
    if (process.platform === 'darwin') return `deno-${arch}-apple-darwin.zip`
    if (process.platform === 'linux') return `deno-${arch}-unknown-linux-gnu.zip`
    return null
  }

  const downloadManagedDeno = async () => {
    const asset = getDenoReleaseAsset()
    if (!asset) throw new Error(`Unsupported Deno platform: ${process.platform}/${process.arch}`)

    const installDir = path.join(userData, 'deno-runtime')
    const executablePath = path.join(installDir, process.platform === 'win32' ? 'deno.exe' : 'deno')
    try {
      await fs.access(executablePath)
      return executablePath
    } catch {
      // Install below. The cached binary keeps subsequent launches offline.
    }

    const archivePath = path.join(installDir, `${asset}.download`)
    const stagingDir = path.join(installDir, 'extracting')
    const releaseUrl = `https://github.com/denoland/deno/releases/latest/download/${asset}`
    await fs.mkdir(installDir, { recursive: true })
    await fs.rm(stagingDir, { recursive: true, force: true })

    const response = await fetch(releaseUrl, { redirect: 'follow' })
    if (!response.ok || !response.body) {
      throw new Error(`Deno download failed: HTTP ${response.status}`)
    }

    const file = fsSync.createWriteStream(archivePath)
    const stream = Readable.fromWeb(response.body as never)
    try {
      await new Promise<void>((resolve, reject) => {
        stream.on('error', reject)
        file.on('error', reject)
        file.on('finish', resolve)
        stream.pipe(file)
      })
      await fs.mkdir(stagingDir, { recursive: true })
      await extract(archivePath, { dir: stagingDir })
      const extractedPath = path.join(stagingDir, process.platform === 'win32' ? 'deno.exe' : 'deno')
      await fs.rename(extractedPath, executablePath)
      if (process.platform !== 'win32') await fs.chmod(executablePath, 0o755)
      return executablePath
    } finally {
      await fs.rm(archivePath, { force: true }).catch(() => undefined)
      await fs.rm(stagingDir, { recursive: true, force: true }).catch(() => undefined)
    }
  }

  const getYoutubeRuntimeArgs = () => {
    if (!youtubeRuntimePromise) {
      youtubeRuntimePromise = downloadManagedDeno()
        .then((denoPath) => ['--js-runtimes', `deno:${denoPath}`])
        .catch((error) => {
          // Node is not enabled by default in yt-dlp. It is a useful fallback on
          // developer machines or systems where GitHub cannot be reached.
          console.warn('[Main] Failed to prepare managed Deno; falling back to Node:', error)
          return ['--js-runtimes', `node:${process.execPath}`]
        })
    }
    return youtubeRuntimePromise
  }

  
  const updateYtDlpInBackground = async () => {
    const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
    const binaryPath = path.join(userData, binaryName)
    try {
      const wrapper = new YtDlpWrap(binaryPath)
      console.log("[Main] Checking for yt-dlp updates in background...")
      await wrapper.execPromise(["-U"])
      console.log("[Main] yt-dlp updated successfully.")
    } catch (e: any) {
      console.warn("[Main] Failed to update yt-dlp (background):", e.message)
    }
  }

  
  
  const getYtDlp = async () => {
    const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp'
    const binaryPath = path.join(userData, binaryName)

    
    try {
      await fs.access(binaryPath)
    } catch {
      
      console.log('Downloading yt-dlp binary...')
      await YtDlpWrap.downloadFromGithub(binaryPath)
      console.log('Downloaded yt-dlp to', binaryPath)
    }

    return new YtDlpWrap(binaryPath)
  }

  const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error)

  const isYoutubeMediaForbidden = (error: unknown) =>
    /(?:HTTP (?:Error )?403|403 Forbidden)/i.test(getErrorMessage(error))

  const runYtDlp = (
    yt: Pick<YtDlpWrapType, 'exec'>,
    args: string[],
    onProgress?: (progress: YtDlpProgress) => void,
    onEvent?: (eventType: string, eventData: string) => void
  ) => new Promise<void>((resolve, reject) => {
    const eventEmitter = yt.exec(args)
    if (onProgress) eventEmitter.on('progress', onProgress)
    if (onEvent) eventEmitter.on('ytDlpEvent', onEvent)
    eventEmitter.once('error', reject)
    eventEmitter.once('close', () => resolve())
  })

  const runYoutubeDownload = async (
    yt: Pick<YtDlpWrapType, 'exec'>,
    primaryArgs: string[],
    embeddedClientArgs: string[],
    hlsFallbackArgs: string[],
    onProgress?: (progress: YtDlpProgress) => void,
    onEvent?: (eventType: string, eventData: string) => void
  ) => {
    try {
      await runYtDlp(yt, primaryArgs, onProgress, onEvent)
    } catch (error) {
      if (!isYoutubeMediaForbidden(error)) throw error

      // YouTube increasingly requires a PO token for direct googlevideo URLs.
      // Try the token-free embedded client first. Videos that disable embedding
      // can still fall back to HLS, which currently remains usable without POT.
      console.warn('[Main] Direct YouTube media URL returned 403; retrying with embedded client')
      try {
        await runYtDlp(yt, embeddedClientArgs, onProgress, onEvent)
      } catch (embeddedError) {
        console.warn('[Main] Embedded YouTube client failed; retrying with HLS:', embeddedError)
        await runYtDlp(yt, hlsFallbackArgs, onProgress, onEvent)
      }
    }
  }

  
  if (process.env.NW_OFFLINE !== '1') updateYtDlpInBackground()

  
  rpc.handle('search:youtube', async (_, query, pagesToLoad = 1) => {
    try {
      const ytSearch = createRequire(import.meta.url)('yt-search')
      const pages = Math.max(1, Math.min(Number(pagesToLoad) || 1, 5))
      const r = await ytSearch({ query, pages })
      if (!r || !r.videos) return []
      
      const results = r.videos.map((v: any) => ({
        id: v.videoId,
        title: v.title,
        artist: v.author?.name || 'Unknown',
        duration: v.seconds,
        thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        url: v.url
      }))

      return results
    } catch (e) {
      console.error("yt-search error:", e)
      return []
    }
  })

  rpc.handle('search:youtubePreview', async (_, url, title?: string, artist?: string) => {
    try {
      const yt = await getYtDlp()
      const runtimeArgs = await getYoutubeRuntimeArgs()
      const stdout = await yt.execPromise([url, ...runtimeArgs, '-J'])
      const dat = JSON.parse(stdout)
      let bestStart = 0
      let hasHeatmap = false

      if (dat.heatmap && dat.heatmap.length > 0) {
        
        const duration = dat.duration || 0
        const validHeatmap = dat.heatmap.filter((h: any) => h.start_time >= 15 && (duration === 0 || h.start_time <= duration - 15))
        const pool = validHeatmap.length > 0 ? validHeatmap : dat.heatmap
        
        const best = [...pool].sort((a: any, b: any) => b.value - a.value)[0]
        bestStart = best.start_time
        hasHeatmap = true
      }

      
      
      
      
      if (!hasHeatmap && title) {
        try {
          const query = artist ? `${title} ${artist}` : title
          const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(query)}`)
          if (res.ok) {
            const data: any[] = await res.json()
            if (data && data.length > 0 && data[0].syncedLyrics) {
              const lyrics = data[0].syncedLyrics
              const lines = lyrics.split('\n')
              const parsed: { time: number, text: string }[] = []
              const regex = /\[(\d{2}):(\d{2}\.\d{2})\]\s*(.*)/

              for (const line of lines) {
                const match = line.match(regex)
                if (match) {
                  const m = parseInt(match[1])
                  const s = parseFloat(match[2])
                  const text = match[3].trim()
                  if (text.length > 2) parsed.push({ time: m * 60 + s, text })
                }
              }

              if (parsed.length > 0) {
                const lineFreq = new Map<string, number>()
                for (const p of parsed) {
                  const t = p.text.toLowerCase()
                  lineFreq.set(t, (lineFreq.get(t) || 0) + 1)
                }

                let maxScore = 0
                let bestIdx = -1
                const WINDOW = 4
                for (let i = 0; i <= parsed.length - WINDOW; i++) {
                  let score = 0
                  for (let j = 0; j < WINDOW; j++) {
                    const t = parsed[i + j].text.toLowerCase()
                    const count = lineFreq.get(t) || 0
                    if (count > 1) score += count
                  }
                  if (score > maxScore) {
                    maxScore = score
                    bestIdx = i
                  }
                }

                
                if (bestIdx !== -1 && maxScore >= 4) {
                  bestStart = parsed[bestIdx].time
                } else {
                  
                  if (dat.duration) bestStart = Math.floor(dat.duration / 3)
                }
              }
            }
          }
        } catch (e) {   }
      }

      
      if (bestStart === 0 && dat.duration) {
        bestStart = Math.floor(dat.duration / 3)
      }

      
      const formats = dat.formats || []
      let audioFormats = formats.filter((f: any) => f.acodec !== 'none' && f.vcodec === 'none')
      let streamUrl = ''

      if (audioFormats.length > 0) {
        
        const m4aFormats = audioFormats.filter((f: any) => f.ext === 'm4a')
        if (m4aFormats.length > 0) audioFormats = m4aFormats

        audioFormats.sort((a: any, b: any) => (b.tbr || 0) - (a.tbr || 0))
        streamUrl = audioFormats[0].url
      } else {
        
        formats.sort((a: any, b: any) => (b.tbr || 0) - (a.tbr || 0))
        if (formats.length > 0) streamUrl = formats[0].url
      }

      return {
        url: streamUrl,
        startTime: bestStart
      }
    } catch (e: any) {
      console.error("Youtube preview error:", e)
      return null
    }
  })

  rpc.handle('download:youtube', async (_, url, inputTitle, inputArtist, format = 'm4a') => {
    try {
      const yt = await getYtDlp()

      
      const ffmpegPath = createRequire(import.meta.url)('ffmpeg-static')

      
      
      let safeTitle = inputTitle.replace(/[\\/:*?"<>|]/g, '_').trim()

      // 2. Pick path
      const defaultExt = format === 'mp4' ? 'mp4' : 'm4a'
      const { filePath } = await dialog.showSaveDialog({
        title: '下載歌曲',
        defaultPath: `${safeTitle}.${defaultExt}`,
        filters: format === 'mp4' ? [
           { name: 'Media (mp4)', extensions: ['mp4'] },
           { name: 'Audio (m4a)', extensions: ['m4a'] }
        ] : [
           { name: 'Audio (m4a)', extensions: ['m4a'] }
        ]
      })

      if (!filePath) return null

      // 3. Download
      const runtimeArgs = await getYoutubeRuntimeArgs()
      // Prepare args
      const fArg = format === 'mp4' ? 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/bestaudio[ext=m4a]/best' : 'bestaudio[ext=m4a]'
      const args = [
          url,
          ...runtimeArgs,
          '--no-playlist',
          '--force-overwrites',
          '-f', fArg,
          '--ffmpeg-location', ffmpegPath,
          '--add-metadata',
          '--embed-thumbnail',
          '-o', filePath
      ]

      const hlsFormat = format === 'mp4'
        ? 'best[protocol=m3u8_native][height<=1080]/best[protocol=m3u8_native]'
        : 'best[protocol=m3u8_native][height<=360]/worst[protocol=m3u8_native]'
      const hlsArgs = [
        url,
        ...runtimeArgs,
        '--no-playlist',
        '--force-overwrites',
        '-f', hlsFormat,
        '--ffmpeg-location', ffmpegPath,
        '--add-metadata',
        '--embed-thumbnail',
        '-o', filePath
      ]
      if (format !== 'mp4') {
        hlsArgs.push('--extract-audio', '--audio-format', 'm4a', '--audio-quality', '0')
      }

      // If we have explicit artist/title, force them into metadata.
      // Note: yt-dlp parse-metadata syntax: "STRING:%(field)s"
      for (const targetArgs of [args, hlsArgs]) {
        if (inputArtist) {
          targetArgs.push('--parse-metadata', `${inputArtist}:%(artist)s`)
          targetArgs.push('--parse-metadata', `${inputArtist}:%(album_artist)s`)
        }
        if (inputTitle) targetArgs.push('--parse-metadata', `${inputTitle}:%(title)s`)
      }
      const embeddedArgs = [...args, '--extractor-args', 'youtube:player_client=web_embedded']

      try {
        await runYoutubeDownload(yt, args, embeddedArgs, hlsArgs)
        return filePath
      } catch (err) {
        console.error('yt-dlp error:', err)
        throw new Error(`下載錯誤: ${getErrorMessage(err)}`)
      }

    } catch (e: any) {
      console.error("Download fatal error:", e)
      throw new Error(e.message) // Propagate pure message
    }
  })

  rpc.handle('download:youtubeToDir', async (_, url, inputTitle, inputArtist, outputDir, limitRate, fileTimestamp, format = 'm4a') => {
    try {
      const yt = await getYtDlp()

      // Get ffmpeg path
      const ffmpegPath = createRequire(import.meta.url)('ffmpeg-static')

      let safeTitle = inputTitle.replace(/[\\/:*?"<>|]/g, '_').trim()
      const basePath = path.join(outputDir, safeTitle)
      const runtimeArgs = await getYoutubeRuntimeArgs()

      const fArg = format === 'mp4' ? 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/bestaudio[ext=m4a]/best' : 'bestaudio[ext=m4a]'
      const args = [
          url,
          ...runtimeArgs,
          '--no-playlist',
          '--force-overwrites',
          '-f', fArg
      ]

      if (limitRate && limitRate !== '0') args.push('--limit-rate', limitRate)

      args.push(
        '--ffmpeg-location', ffmpegPath,
        '--add-metadata',
        '--embed-thumbnail',
        '-o', `${basePath}.%(ext)s`
      )

      const hlsFormat = format === 'mp4'
        ? 'best[protocol=m3u8_native][height<=1080]/best[protocol=m3u8_native]'
        : 'best[protocol=m3u8_native][height<=360]/worst[protocol=m3u8_native]'
      const hlsArgs = [
        url,
        ...runtimeArgs,
        '--no-playlist',
        '--force-overwrites',
        '-f', hlsFormat
      ]
      if (limitRate && limitRate !== '0') hlsArgs.push('--limit-rate', limitRate)
      hlsArgs.push(
        '--ffmpeg-location', ffmpegPath,
        '--add-metadata',
        '--embed-thumbnail',
        '-o', `${basePath}.%(ext)s`
      )
      if (format !== 'mp4') {
        hlsArgs.push('--extract-audio', '--audio-format', 'm4a', '--audio-quality', '0')
      }

      for (const targetArgs of [args, hlsArgs]) {
        if (inputArtist) {
          targetArgs.push('--parse-metadata', `${inputArtist}:%(artist)s`)
          targetArgs.push('--parse-metadata', `${inputArtist}:%(album_artist)s`)
        }
        if (inputTitle) targetArgs.push('--parse-metadata', `${inputTitle}:%(title)s`)
      }
      const embeddedArgs = [...args, '--extractor-args', 'youtube:player_client=web_embedded']

      const onProgress = (progress: YtDlpProgress) => {
          // Send progress updates to renderer
          if (progress && progress.currentSpeed) {
            emit('main', 'download:progress', {
              url: url,
              speed: progress.currentSpeed,
              percent: progress.percent
            })
          }
      }

      // Fallback for manual parsing just in case
      const onEvent = (eventType: string, eventData: string) => {
          if (eventType === 'download' && eventData.includes('at')) {
            const speedMatch = eventData.match(/at\s+([0-9.]+[a-zA-Z]+\/s)/)
            if (speedMatch) {
              emit('main', 'download:progress', { url: url, speed: speedMatch[1] })
            }
          }
      }

      try {
        await runYoutubeDownload(yt, args, embeddedArgs, hlsArgs, onProgress, onEvent)
          let finalPath = path.join(outputDir, `${safeTitle}.mp4`)
          try {
            await fs.access(finalPath)
          } catch {
            finalPath = path.join(outputDir, `${safeTitle}.m4a`)
            try {
              await fs.access(finalPath)
            } catch {
              finalPath = path.join(outputDir, `${safeTitle}.webm`)
              try { await fs.access(finalPath) } catch {
                finalPath = path.join(outputDir, `${safeTitle}.mp3`) // Just in case
              }
            }
          }

          if (fileTimestamp) {
            try {
              const timeDate = new Date(fileTimestamp);
              await fs.utimes(finalPath, timeDate, timeDate);
            } catch (e) {
              console.error("Failed to set file timestamp:", e)
            }
          }
        return finalPath
      } catch (err) {
        console.error('yt-dlp error:', err)
        throw new Error(`下載錯誤: ${getErrorMessage(err)}`)
      }

    } catch (e: any) {
      console.error("Download fatal error:", e)
      throw new Error(e.message) // Propagate pure message
    }
  })

  rpc.handle('search:artistImage', async (_, artistName) => {
    return searchArtistImage(artistName)
  })

  rpc.handle('search:lyrics', async (_, title, artist, filePath, duration, aiConfig) => {
    return searchLyrics({ title, artist, filePath, duration, aiConfig })
  })

  const gpuLyricsRoot = path.join(userData, 'gpu-lyrics')
  rpc.handle('lyrics:gpuStatus', async () => {
    const status = await getGpuCalibrationStatus(gpuLyricsRoot)
    const gpuInfo = await queryGpuInfo()
    const devices = Array.isArray((gpuInfo as any)?.gpuDevice) ? (gpuInfo as any).gpuDevice : []
    return {
      ...status,
      gpuName: devices.map((device: any) => device?.deviceString).filter(Boolean).join(' / ') || 'NVIDIA GPU'
    }
  })

  rpc.handle('lyrics:computeDevices', async () => {
    const gpus = await new Promise<Array<{ index: number; name: string; memoryMb: number }>>(resolve => {
      const child = spawn('nvidia-smi', ['--query-gpu=index,name,memory.total', '--format=csv,noheader,nounits'], { windowsHide: true })
      let output = ''
      child.stdout.on('data', chunk => { output += String(chunk) })
      child.on('error', () => resolve([]))
      child.on('close', code => {
        if (code !== 0) return resolve([])
        resolve(output.trim().split(/\r?\n/).filter(Boolean).map(line => {
          const [index, name, memory] = line.split(',').map(value => value.trim())
          return { index: Number(index), name, memoryMb: Number(memory) }
        }).filter(gpu => Number.isInteger(gpu.index)))
      })
    })
    return {
      gpus,
      cpu: {
        name: os.cpus()[0]?.model || 'CPU',
        logicalThreads: os.cpus().length,
        totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024)
      }
    }
  })

  rpc.handle('lyrics:gpuCalibrate', async (event, audioPath: string, rawLyrics: string | undefined, mode: GpuCalibrationMode, force = false, computeConfig?: any) => {
    return runGpuLyricsCalibration({
      audioPath,
      rawLyrics,
      mode,
      force,
      runtimeRoot: gpuLyricsRoot,
      ffmpegPath,
      computeConfig,
      onProgress: progress => {
        if (!event.sender.isDestroyed()) event.sender.send('lyrics:gpuProgress', progress)
      }
    })
  })
}
