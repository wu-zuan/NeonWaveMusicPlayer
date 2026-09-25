import { userData } from './paths'
import http, { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import crypto from 'node:crypto'
import { spawn, type ChildProcess } from 'node:child_process'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

type PlaybackSnapshot = {
  path?: string
  title?: string
  artist?: string
  album?: string
  artwork?: string
  currentTime: number
  duration: number
  isPlaying: boolean
  updatedAt: number
  lyrics?: { time: number; text: string }[]
  lyricsVisible?: boolean
  lyricsStyle?: string
  soundMode?: string
}

export type PartyCommand =
  | { action: 'toggle-play' }
  | { action: 'next' }
  | { action: 'prev' }
  | { action: 'seek'; value: number }
  | { action: 'volume'; value: number }

export type PartyStatus = {
  active: boolean
  roomId: string | null
  inviteUrl: string | null
  localUrl: string | null
  publicUrl: string | null
  tunnelStatus: 'idle' | 'starting' | 'connected' | 'error'
  tunnelMessage?: string
  cloudflaredAvailable: boolean
  cloudflaredState: 'idle' | 'downloading' | 'ready' | 'error'
  cloudflaredMessage?: string
  cloudflaredProgress?: number
  permissions: { next: boolean; seek: boolean }
  lyrics: { visible: boolean; style: string; lines: { time: number; text: string }[] }
  soundMode: string
  track: {
    path?: string
    title: string
    artist: string
    album?: string
    artwork?: string
    currentTime: number
    duration: number
    isPlaying: boolean
    streamable: boolean
    isVideo?: boolean
  } | null
}

type PartySessionOptions = {
  autoTunnel?: boolean
}

const MIME_MAP: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.flac': 'audio/flac',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.webm': 'audio/webm',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.wmv': 'video/x-ms-wmv',
  '.avi': 'video/x-msvideo'
}

function randomId(length = 10) {
  return crypto.randomBytes(length).toString('hex').slice(0, length)
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function normalizePathname(input: string) {
  return input.replace(/\/+/g, '/')
}

export class PartyRoomService {
  private server: http.Server | null = null
  private serverPort: number | null = null
  private serverStartPromise: Promise<void> | null = null
  private roomId: string | null = null
  private roomToken: string | null = null
  private tunnelProcess: ChildProcess | null = null
  private tunnelStartPromise: Promise<void> | null = null
  private tunnelGeneration = 0
  private tunnelTimer: NodeJS.Timeout | null = null
  private artworkVersion = 0
  private tunnelUrl: string | null = null
  private tunnelStatus: PartyStatus['tunnelStatus'] = 'idle'
  private tunnelMessage: string | undefined
  private cloudflaredAvailable = false
  private cloudflaredState: PartyStatus['cloudflaredState'] = 'idle'
  private cloudflaredMessage: string | undefined
  private cloudflaredProgress: number | undefined
  private cloudflaredPath: string | null = null
  private cloudflaredInstallPromise: Promise<string> | null = null
  private playback: PlaybackSnapshot = {
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    updatedAt: Date.now()
  }
  private sseClients = new Set<ServerResponse>()
  private keepAliveTimer: NodeJS.Timeout | null = null
  private readonly onCommand: (command: PartyCommand) => void
  private permissions = { next: false, seek: false }

  constructor(onCommand: (command: PartyCommand) => void) {
    this.onCommand = onCommand
  }

  isActive() {
    return !!this.server
  }

  setPermissions(next: Partial<{ next: boolean; seek: boolean }>) {
    this.permissions = { next: !!next.next, seek: !!next.seek }
    this.broadcastState()
    return this.getStatus()
  }

  updatePresentation(snapshot: Partial<Pick<PlaybackSnapshot, 'lyrics' | 'lyricsVisible' | 'lyricsStyle' | 'soundMode'>>) {
    this.playback = {
      ...this.playback,
      ...snapshot,
      ...(snapshot.lyrics ? { lyrics: snapshot.lyrics.filter(line => Number.isFinite(line.time) && typeof line.text === 'string').slice(0, 2000) } : {})
    }
    this.broadcastState()
  }

  updatePlayback(snapshot: Partial<PlaybackSnapshot>) {
    const trackChanged = snapshot.path !== undefined && snapshot.path !== this.playback.path
    const cleanSnapshot = { ...snapshot }
    if (cleanSnapshot.artwork === undefined) {
      delete cleanSnapshot.artwork
    }
    if (trackChanged || (snapshot.artwork !== undefined && snapshot.artwork !== this.playback.artwork)) {
      this.artworkVersion++
      if (trackChanged) {
        this.playback.artwork = undefined
        this.playback.lyrics = []
      }
    }
    this.playback = {
      ...this.playback,
      ...cleanSnapshot,
      updatedAt: Date.now()
    }
    this.broadcastState()
  }

  async start(options: PartySessionOptions = {}) {
    const generation = this.tunnelGeneration
    await this.ensureServer()
    if (generation !== this.tunnelGeneration) return this.getStatus()
    if (options.autoTunnel) {
      await this.startTunnel().catch((err) => {
        if (generation !== this.tunnelGeneration) return
        this.tunnelStatus = 'error'
        this.tunnelMessage = err instanceof Error ? err.message : String(err)
        this.broadcastState()
      })
    }
    return this.getStatus()
  }

  async stop() {
    this.stopTunnel()
    this.stopServer()
    this.roomId = null
    this.roomToken = null
    this.serverPort = null
    this.playback = {
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      updatedAt: Date.now()
    }
    this.cloudflaredState = 'idle'
    this.cloudflaredMessage = undefined
    this.cloudflaredProgress = undefined
    this.permissions = { next: false, seek: false }
    this.broadcastState()
  }

  getStatus(): PartyStatus {
    const liveCurrentTime = this.getLiveCurrentTime()
    const streamable = !!this.playback.path && !this.playback.path.startsWith('shared:')
    const isVideo = !!this.playback.path && /\.(mp4|mov|wmv|avi|webm)$/i.test(this.playback.path)
    return {
      active: !!this.server && !!this.roomId && !!this.roomToken,
      roomId: this.roomId,
      inviteUrl: this.getInviteUrl(),
      localUrl: this.getLocalUrl(),
      publicUrl: this.getPublicUrl(),
      tunnelStatus: this.tunnelStatus,
      tunnelMessage: this.tunnelMessage,
      cloudflaredAvailable: this.cloudflaredAvailable,
      cloudflaredState: this.cloudflaredState,
      cloudflaredMessage: this.cloudflaredMessage,
      cloudflaredProgress: this.cloudflaredProgress,
      permissions: { ...this.permissions },
      lyrics: {
        visible: !!this.playback.lyricsVisible,
        style: this.playback.lyricsStyle || 'danmaku',
        lines: this.playback.lyrics || []
      },
      soundMode: this.playback.soundMode || 'none',
      track: this.roomId
        ? {
            path: this.playback.path,
            title: this.playback.title || '',
            artist: this.playback.artist || '',
            album: this.playback.album,
            artwork: this.playback.artwork,
            currentTime: liveCurrentTime,
            duration: this.playback.duration || 0,
            isPlaying: this.playback.isPlaying,
            streamable,
            isVideo
          }
        : null
    }
  }

  private getGuestStatus(): PartyStatus {
    const status = this.getStatus()
    if (status.track) {
      status.track.path = this.playback.path
        ? crypto.createHash('sha256').update(this.playback.path).digest('hex').slice(0, 24)
        : undefined
      status.track.artwork = this.playback.artwork
        ? '/api/room/' + this.roomId + '/artwork?token=' + encodeURIComponent(this.roomToken!) + '&v=' + this.artworkVersion
        : undefined
    }
    return status
  }

  private getLiveCurrentTime() {
    const base = this.playback.currentTime || 0
    if (!this.playback.isPlaying) return base
    const elapsed = (Date.now() - this.playback.updatedAt) / 1000
    const next = base + elapsed
    if (this.playback.duration > 0) {
      return Math.min(this.playback.duration, Math.max(0, next))
    }
    return Math.max(0, next)
  }

  private ensureServer(): Promise<void> {
    if (this.serverStartPromise) return this.serverStartPromise
    const pending = this.listenServer().finally(() => {
      if (this.serverStartPromise === pending) this.serverStartPromise = null
    })
    this.serverStartPromise = pending
    return pending
  }

  private async listenServer() {
    if (this.server) return

    this.roomId = randomId(8)
    this.roomToken = randomId(24)

    this.server = http.createServer((req, res) => {
      void this.handleRequest(req, res).catch(() => {
        if (!res.headersSent) this.sendJson(res, 500, { error: 'request_failed' })
        else res.destroy()
      })
    })
    const server = this.server

    await new Promise<void>((resolve, reject) => {
      const onError = (err: Error) => {
        server.off('error', onError)
        if (this.server === server) this.server = null
        reject(err)
      }
      server.once('error', onError)
      server.listen(0, '127.0.0.1', () => {
        server.off('error', onError)
        if (this.server !== server) {
          server.close()
          resolve()
          return
        }
        const addr = server.address()
        if (addr && typeof addr === 'object') {
          this.serverPort = addr.port
        }
        resolve()
      })
    })
    if (this.server !== server) return

    this.keepAliveTimer = setInterval(() => {
      this.flushKeepAlive()
    }, 25000)

    this.broadcastState()
  }

  private stopServer() {
    this.serverStartPromise = null
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer)
      this.keepAliveTimer = null
    }

    for (const client of this.sseClients) {
      try {
        client.end()
      } catch {}
    }
    this.sseClients.clear()

    if (this.server) {
      try {
        this.server.close()
        this.server.closeAllConnections()
      } catch {}
      this.server = null
    }
  }

  private stopTunnel() {
    this.tunnelGeneration++
    this.tunnelStartPromise = null
    if (this.tunnelTimer) clearTimeout(this.tunnelTimer)
    this.tunnelTimer = null
    if (this.tunnelProcess) {
      try {
        this.tunnelProcess.kill('SIGTERM')
      } catch {}
      this.tunnelProcess = null
    }
    this.tunnelUrl = null
    this.tunnelStatus = 'idle'
    this.tunnelMessage = undefined
  }

  private startTunnel(): Promise<void> {
    if (this.tunnelStartPromise) return this.tunnelStartPromise
    const pending = this.launchTunnel(this.tunnelGeneration).finally(() => {
      if (this.tunnelStartPromise === pending) this.tunnelStartPromise = null
    })
    this.tunnelStartPromise = pending
    return pending
  }

  private async launchTunnel(generation: number) {
    if (!this.serverPort) throw new Error('本機房間尚未啟動')
    if (this.tunnelProcess) return

    const cloudflared = await this.ensureCloudflared()
    if (generation !== this.tunnelGeneration || !this.serverPort) return
    if (!cloudflared) {
      this.cloudflaredAvailable = false
      throw new Error('cloudflared 安裝失敗，請稍後再試。')
    }

    this.cloudflaredAvailable = true
    this.cloudflaredState = 'ready'
    this.cloudflaredMessage = 'cloudflared 已就緒'
    this.cloudflaredProgress = 1
    this.tunnelStatus = 'starting'
    this.tunnelMessage = '啟動 Cloudflare Tunnel 中...'
    this.broadcastState()

    const args = [
      'tunnel',
      '--url',
      `http://127.0.0.1:${this.serverPort}`,
      '--no-autoupdate'
    ]

    const child = spawn(cloudflared, args, {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    })

    this.tunnelProcess = child

    let output = ''
    let registered = false
    let candidateUrl: string | null = null
    const fail = (message: string) => {
      if (this.tunnelProcess !== child) return
      if (this.tunnelTimer) clearTimeout(this.tunnelTimer)
      this.tunnelTimer = null
      this.tunnelProcess = null
      this.tunnelUrl = null
      this.tunnelStatus = 'error'
      this.tunnelMessage = message
      child.kill()
      this.broadcastState()
    }
    this.tunnelTimer = setTimeout(() => fail('Cloudflare Tunnel 連線逾時，請重試並確認網路連線。'), 60000)
    const handleOutput = (chunk: Buffer) => {
      if (this.tunnelProcess !== child) return
      output = (output + chunk.toString('utf8')).slice(-16384)
      const text = output
      const match = text.match(/https:\/\/[a-zA-Z0-9.-]+\.trycloudflare\.com/i)
      if (match) candidateUrl = match[0]
      if (/Registered tunnel connection/i.test(text)) registered = true
      if (candidateUrl && registered && this.tunnelStatus !== 'connected') {
        if (this.tunnelTimer) clearTimeout(this.tunnelTimer)
        this.tunnelTimer = null
        this.tunnelUrl = candidateUrl
        this.tunnelStatus = 'connected'
        this.tunnelMessage = 'Cloudflare Tunnel 已連線'
        this.broadcastState()
      }
    }

    child.stdout.on('data', handleOutput)
    child.stderr.on('data', handleOutput)
    child.on('error', (err) => fail(`Cloudflare Tunnel 啟動失敗：${err.message}`))

    child.on('exit', (code, signal) => {
      if (this.tunnelProcess !== child) return
      if (this.tunnelTimer) clearTimeout(this.tunnelTimer)
      this.tunnelTimer = null
      this.tunnelProcess = null
      if (this.tunnelStatus !== 'idle') {
        this.tunnelStatus = 'error'
        this.tunnelMessage = `Cloudflare Tunnel 已停止 (${signal ?? code ?? 'unknown'})。請重試。`
        this.tunnelUrl = null
        this.broadcastState()
      }
    })
  }

  private async ensureCloudflared(): Promise<string | null> {
    const existing = await this.findCloudflared()
    if (existing) return existing

    if (this.cloudflaredInstallPromise) {
      return this.cloudflaredInstallPromise
    }

    this.cloudflaredState = 'downloading'
    this.cloudflaredMessage = '首次使用需下載 Cloudflare Tunnel 依賴 cloudflared'
    this.cloudflaredProgress = 0
    this.broadcastState()

    this.cloudflaredInstallPromise = this.downloadCloudflared().finally(() => {
      this.cloudflaredInstallPromise = null
    })

    try {
      const installed = await this.cloudflaredInstallPromise
      this.cloudflaredState = 'ready'
      this.cloudflaredMessage = 'cloudflared 已下載完成'
      this.cloudflaredProgress = 1
      this.broadcastState()
      return installed
    } catch (err) {
      this.cloudflaredState = 'error'
      this.cloudflaredMessage = err instanceof Error ? err.message : String(err)
      this.broadcastState()
      throw err
    }
  }

  private async findCloudflared(): Promise<string | null> {
    if (process.env.CLOUDFLARED_PATH && fs.existsSync(process.env.CLOUDFLARED_PATH)) {
      return process.env.CLOUDFLARED_PATH
    }

    if (this.cloudflaredPath && fs.existsSync(this.cloudflaredPath)) {
      return this.cloudflaredPath
    }

    const localPath = path.join(userData, 'cloudflared', process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared')
    if (fs.existsSync(localPath)) {
      this.cloudflaredPath = localPath
      return localPath
    }

    const candidates = process.platform === 'win32'
      ? ['cloudflared.exe', 'cloudflared']
      : ['cloudflared']

    for (const candidate of candidates) {
      try {
        await new Promise<void>((resolve, reject) => {
          const child = spawn(candidate, ['--version'], {
            windowsHide: true,
            stdio: 'ignore'
          })
          child.on('error', reject)
          child.on('exit', (code) => {
            if (code === 0) resolve()
            else reject(new Error(`exit ${code ?? 'unknown'}`))
          })
        })
        return candidate
      } catch {}
    }

    return null
  }

  private cloudflaredAsset(): { url: string; archive: 'none' | 'tgz' } | null {
    const base = 'https://github.com/cloudflare/cloudflared/releases/latest/download'
    const arch = process.arch === 'arm64' ? 'arm64' : 'amd64'
    switch (process.platform) {
      case 'win32':
        return { url: `${base}/cloudflared-windows-amd64.exe`, archive: 'none' }
      case 'linux':
        return { url: `${base}/cloudflared-linux-${arch}`, archive: 'none' }
      case 'darwin':
        // macOS releases ship as a tarball containing the `cloudflared` binary
        return { url: `${base}/cloudflared-darwin-${arch}.tgz`, archive: 'tgz' }
      default:
        return null
    }
  }

  private async downloadCloudflared(): Promise<string> {
    const asset = this.cloudflaredAsset()
    if (!asset) {
      throw new Error(`此平台 (${process.platform}) 不支援自動安裝 cloudflared`)
    }

    const releaseUrl = asset.url
    const installDir = path.join(userData, 'cloudflared')
    const targetPath = path.join(installDir, process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared')
    const tempPath = `${targetPath}.download`

    await fsPromises.mkdir(installDir, { recursive: true })
    this.cloudflaredMessage = '正在背景下載 cloudflared...'
    this.broadcastState()

    const response = await fetch(releaseUrl, { redirect: 'follow', signal: AbortSignal.timeout(180000) })
    if (!response.ok || !response.body) {
      throw new Error(`下載 cloudflared 失敗：${response.status} ${response.statusText}`)
    }

    const total = Number(response.headers.get('content-length') || 0)
    let received = 0
    const file = fs.createWriteStream(tempPath)
    const reader = Readable.fromWeb(response.body as any)

    let lastProgressAt = 0
    reader.on('data', (chunk: Buffer) => {
      received += chunk.length
      const now = Date.now()
      if (total > 0 && now - lastProgressAt >= 250) {
        this.cloudflaredProgress = Math.min(1, received / total)
        lastProgressAt = now
        this.broadcastState()
      }
    })
    try {
      await pipeline(reader, file)
    } catch (err) {
      await fsPromises.rm(tempPath, { force: true }).catch(() => {})
      throw err
    }

    if (asset.archive === 'tgz') {
      await new Promise<void>((resolve, reject) => {
        const tar = spawn('tar', ['-xzf', tempPath, '-C', installDir], { stdio: 'ignore' })
        tar.on('error', reject)
        tar.on('exit', (code) => {
          if (code === 0) resolve()
          else reject(new Error(`解壓 cloudflared 失敗 (tar exit ${code ?? 'unknown'})`))
        })
      })
      await fsPromises.rm(tempPath, { force: true })
    } else {
      await fsPromises.rename(tempPath, targetPath)
    }

    if (process.platform !== 'win32') {
      await fsPromises.chmod(targetPath, 0o755)
    }

    this.cloudflaredPath = targetPath
    return targetPath
  }

  private getBaseUrl() {
    if (!this.serverPort) return null
    return `http://127.0.0.1:${this.serverPort}`
  }

  private getLocalUrl() {
    const base = this.getBaseUrl()
    if (!base || !this.roomId || !this.roomToken) return null
    return `${base}/party/${this.roomId}?token=${encodeURIComponent(this.roomToken)}`
  }

  private getPublicUrl() {
    if (!this.tunnelUrl || !this.roomId || !this.roomToken) return null
    return `${this.tunnelUrl.replace(/\/$/, '')}/party/${this.roomId}?token=${encodeURIComponent(this.roomToken)}`
  }

  private getInviteUrl() {
    return this.getPublicUrl()
  }

  private validateContext(roomId: string | undefined, token: string | undefined) {
    if (!roomId || !token) return false
    return roomId === this.roomId && token === this.roomToken
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1')
    const pathname = normalizePathname(requestUrl.pathname)

    if (req.method === 'GET' && pathname === `/party/${this.roomId}`) {
      if (!this.validateContext(this.roomId || undefined, requestUrl.searchParams.get('token') || undefined)) {
        this.sendText(res, 403, 'Forbidden')
        return
      }
      this.sendHtml(res, this.renderGuestPage(this.roomId!, this.roomToken!))
      return
    }

    if (req.method === 'GET' && pathname === `/api/room/${this.roomId}`) {
      if (!this.validateContext(this.roomId || undefined, requestUrl.searchParams.get('token') || undefined)) {
        this.sendJson(res, 403, { error: 'forbidden' })
        return
      }
      this.sendJson(res, 200, this.getGuestStatus())
      return
    }

    if (req.method === 'GET' && pathname === `/api/room/${this.roomId}/artwork`) {
      if (!this.validateContext(this.roomId || undefined, requestUrl.searchParams.get('token') || undefined)) {
        this.sendText(res, 403, 'Forbidden')
        return
      }
      const artwork = this.playback.artwork || ''
      const data = /^data:(image\/[\w.+-]+);base64,(.+)$/s.exec(artwork)
      if (data) {
        res.writeHead(200, { 'Content-Type': data[1], 'Cache-Control': 'private, max-age=3600' })
        res.end(Buffer.from(data[2], 'base64'))
      } else if (/^https?:\/\//i.test(artwork)) {
        res.writeHead(302, { Location: artwork, 'Cache-Control': 'no-store' })
        res.end()
      } else {
        this.sendText(res, 404, 'No artwork')
      }
      return
    }

    if (req.method === 'GET' && pathname === `/api/room/${this.roomId}/events`) {
      if (!this.validateContext(this.roomId || undefined, requestUrl.searchParams.get('token') || undefined)) {
        this.sendText(res, 403, 'Forbidden')
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      })
      res.write(`event: state\ndata: ${JSON.stringify(this.getGuestStatus())}\n\n`)
      this.sseClients.add(res)
      req.on('close', () => {
        this.sseClients.delete(res)
      })
      return
    }

    if (req.method === 'POST' && pathname === `/api/room/${this.roomId}/command`) {
      if (!this.validateContext(this.roomId || undefined, requestUrl.searchParams.get('token') || undefined)) {
        this.sendJson(res, 403, { error: 'forbidden' })
        return
      }
      const body = await this.readJsonBody(req)
      if (!body || !['next', 'seek'].includes(body.action)) {
        this.sendJson(res, 400, { error: 'invalid_action' })
        return
      }
      if (!this.permissions[body.action as 'next' | 'seek']) {
        this.sendJson(res, 403, { error: 'control_disabled' })
        return
      }
      if (body.action === 'seek' && (!Number.isFinite(body.value) || body.value < 0 || body.value > this.playback.duration)) {
        this.sendJson(res, 400, { error: 'invalid_seek' })
        return
      }
      this.onCommand(body as PartyCommand)
      this.sendJson(res, 200, { ok: true })
      return
    }

    if (req.method === 'GET' && pathname === `/api/room/${this.roomId}/stream`) {
      if (!this.validateContext(this.roomId || undefined, requestUrl.searchParams.get('token') || undefined)) {
        this.sendText(res, 403, 'Forbidden')
        return
      }
      await this.streamCurrentTrack(req, res)
      return
    }

    this.sendText(res, 404, 'Not found')
  }

  private async streamCurrentTrack(req: IncomingMessage, res: ServerResponse) {
    const filePath = this.playback.path
    if (!filePath || filePath.startsWith('shared:')) {
      this.sendJson(res, 409, {
        error: 'unavailable',
        message: 'Current track cannot be streamed from the host machine.'
      })
      return
    }

    try {
      const stat = await fsPromises.stat(filePath)
      const fileSize = stat.size
      const ext = path.extname(filePath).toLowerCase()
      const contentType = MIME_MAP[ext] || 'application/octet-stream'
      const range = req.headers.range

      res.setHeader('Accept-Ranges', 'bytes')
      res.setHeader('Content-Type', contentType)
      res.setHeader('Cache-Control', 'no-store')

      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range)
        if (!match || (!match[1] && !match[2])) {
          res.setHeader('Content-Range', `bytes */${fileSize}`)
          this.sendJson(res, 416, { error: 'invalid_range' })
          return
        }

        const start = match[1] ? Number(match[1]) : Math.max(0, fileSize - Number(match[2]))
        const end = match[1] && match[2] ? Math.min(Number(match[2]), fileSize - 1) : fileSize - 1
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= fileSize || start > end) {
          res.setHeader('Content-Range', `bytes */${fileSize}`)
          this.sendJson(res, 416, { error: 'range_not_satisfiable' })
          return
        }

        res.statusCode = 206
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`)
        res.setHeader('Content-Length', end - start + 1)
        await pipeline(fs.createReadStream(filePath, { start, end }), res)
        return
      }

      res.statusCode = 200
      res.setHeader('Content-Length', fileSize)
      await pipeline(fs.createReadStream(filePath), res)
    } catch (err) {
      if (res.headersSent || res.destroyed) return
      this.sendJson(res, 500, {
        error: 'stream_failed',
        message: err instanceof Error ? err.message : String(err)
      })
    }
  }

  private sendText(res: ServerResponse, statusCode: number, text: string) {
    res.writeHead(statusCode, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store'
    })
    res.end(text)
  }

  private sendHtml(res: ServerResponse, html: string) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    })
    res.end(html)
  }

  private sendJson(res: ServerResponse, statusCode: number, data: any) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    })
    res.end(JSON.stringify(data))
  }

  private async readJsonBody(req: IncomingMessage) {
    const chunks: Buffer[] = []
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    if (chunks.length === 0) return null
    try {
      return JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch {
      return null
    }
  }

  private flushKeepAlive() {
    for (const client of this.sseClients) {
      try {
        client.write(`: keepalive\n\n`)
      } catch {}
    }
  }

  private broadcastState() {
    if (this.sseClients.size === 0) return
    const payload = `event: state\ndata: ${JSON.stringify(this.getGuestStatus())}\n\n`
    for (const client of this.sseClients) {
      try {
        if (!client.write(payload)) {
          this.sseClients.delete(client)
          client.destroy()
        }
      } catch { this.sseClients.delete(client) }
    }
  }

  private renderGuestPage(roomId: string, token: string) {
    const baseState = this.getGuestStatus()
    const inviteUrl = escapeHtml(this.getInviteUrl() || '')
    const title = escapeHtml(baseState.track?.title || 'Listening Party')
    const artist = escapeHtml(baseState.track?.artist || '等待主機播放中')
    const album = escapeHtml(baseState.track?.album || '')
    const artwork = escapeHtml(baseState.track?.artwork || '')
    const streamable = baseState.track?.streamable ? 'true' : 'false'
    const isPlaying = baseState.track?.isPlaying ? 'true' : 'false'
    const duration = String(baseState.track?.duration || 0)
    const currentTime = String(baseState.track?.currentTime || 0)

    return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="referrer" content="no-referrer" />
  <title>NeonWave Listening Party</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #050816;
      --card: rgba(10, 16, 36, 0.84);
      --line: rgba(255,255,255,.1);
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: #00fff2;
      --accent2: #ff00ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: radial-gradient(circle at top, rgba(0,255,242,.16), transparent 35%), linear-gradient(160deg, #020617, #0f172a 45%, #111827 100%);
      color: var(--text);
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: grid;
      place-items: center;
      padding: 24px;
    }
    .wrap {
      width: min(920px, 100%);
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 24px;
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 28px;
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 80px rgba(0,0,0,.45);
      overflow: hidden;
    }
    .art {
      aspect-ratio: 1;
      background: #000;
      border-right: 1px solid var(--line);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .art img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .fallback {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      color: rgba(255,255,255,.7);
      font-size: 14px;
      letter-spacing: .08em;
      text-transform: uppercase;
      background: linear-gradient(135deg, rgba(0,255,242,.15), rgba(255,0,255,.1));
    }
    .main {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .eyebrow {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: .18em;
      color: var(--muted);
    }
    h1 {
      margin: 0;
      font-size: clamp(28px, 4vw, 44px);
      line-height: 1.05;
    }
    .artist {
      color: var(--muted);
      font-size: 18px;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      color: var(--muted);
      font-size: 13px;
    }
    .pill {
      padding: 6px 10px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(255,255,255,.03);
    }
    .bar {
      width: 100%;
      height: 8px;
      border-radius: 999px;
      background: rgba(255,255,255,.08);
      overflow: hidden;
    }
    .bar > div {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      transition: width .2s linear;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }
    button {
      border: 0;
      color: #fff;
      cursor: pointer;
      border-radius: 14px;
      padding: 12px 16px;
      font-weight: 700;
      background: rgba(255,255,255,.08);
      transition: transform .16s ease, background-color .16s ease, box-shadow .16s ease;
    }
    button:hover { transform: translateY(-1px); }
    .primary {
      background: var(--accent);
      color: #03111f;
      box-shadow: 0 12px 30px rgba(0,255,242,.22);
    }
    .secondary { border: 1px solid var(--line); }
    .row {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }
    input[type="range"] {
      flex: 1;
      min-width: 220px;
      accent-color: var(--accent);
    }
    .status {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      padding-top: 6px;
      color: var(--muted);
      font-size: 13px;
    }
    .status strong { color: var(--text); }
    .status.waiting {
      justify-content: flex-start;
      gap: 10px;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 0 rgba(0, 255, 242, 0.45);
      animation: pulse 1.4s ease-in-out infinite;
      flex: 0 0 auto;
    }
    .status-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .status-title {
      color: var(--text);
      font-weight: 700;
    }
    .status-subtitle {
      color: var(--muted);
      font-size: 12px;
    }
    .loading-bar {
      width: 100%;
      height: 10px;
      border-radius: 999px;
      overflow: hidden;
      background: rgba(255,255,255,.08);
      position: relative;
    }
    .loading-bar::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(0,255,242,.8), transparent);
      transform: translateX(-100%);
      animation: sweep 1.2s linear infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(0, 255, 242, 0.45); }
      50% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 255, 242, 0); }
    }
    @keyframes sweep {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .wrap.has-video {
      grid-template-columns: 1fr;
    }
    .wrap.has-video .art {
      aspect-ratio: 16 / 9;
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }
    .error {
      color: #fda4af;
      font-size: 13px;
      min-height: 1.2em;
    }
    @media (max-width: 760px) {
      .wrap { grid-template-columns: 1fr; }
      .art { max-height: 320px; border-right: 0; border-bottom: 1px solid var(--line); }
      .main { padding: 22px; }
    }
    body { display:block; padding: clamp(16px, 4vw, 48px); background: radial-gradient(circle at 16% 10%, rgba(0,218,206,.16), transparent 35%), radial-gradient(circle at 85% 85%, rgba(143,76,245,.14), transparent 34%), #080b13; }
    body::before { content:'NEONWAVE  /  LISTENING PARTY'; display:block; max-width: 1180px; margin: 0 auto 24px; color: #c9fff8; font-size: 12px; font-weight: 800; letter-spacing:.23em; }
    .wrap { width: min(1180px, 100%); min-height: min(680px, calc(100vh - 130px)); margin:auto; grid-template-columns: minmax(320px, .9fr) minmax(0, 1.1fr); gap:0; background:rgba(13,19,33,.88); border:1px solid rgba(185,221,232,.14); border-radius:32px; box-shadow:0 30px 100px rgba(0,0,0,.5); }
    .wrap.has-video { grid-template-columns:minmax(0,1.2fr) minmax(350px,.8fr); }
    .art { aspect-ratio:auto; min-height:480px; border-right:1px solid rgba(255,255,255,.08); background:radial-gradient(circle at center, #1b4150, #0c1625 60%); }
    .wrap.has-video .art { aspect-ratio:auto; min-height:480px; border-right:1px solid rgba(255,255,255,.08); border-bottom:0; }
    .art img { width: min(74%, 400px); height:auto; aspect-ratio:1; object-fit:cover; border-radius:22px; box-shadow:0 25px 65px rgba(0,0,0,.45); }
    .fallback { width:min(74%,400px); height:auto; aspect-ratio:1; border-radius:22px; font-size:clamp(22px,4vw,38px); font-weight:800; background:linear-gradient(145deg,#114750,#402453); }
    .main { padding:clamp(25px,4vw,55px); gap:22px; justify-content:center; min-width:0; }
    .eyebrow { color:var(--accent); font-weight:800; margin-bottom:16px; }
    h1 { font-size:clamp(34px,4vw,62px); line-height:1.08; letter-spacing:-.045em; overflow-wrap:anywhere; }
    .artist { margin-top:12px; font-size:clamp(17px,2vw,24px); }
    .meta { gap:8px; }
    .pill { background:rgba(255,255,255,.055); padding:8px 12px; }
    .bar { height:6px; }
    .controls { gap:9px; }
    button { min-height:46px; }
    button:disabled { opacity:.4; cursor:not-allowed; transform:none; }
    .primary { padding:13px 24px; }
    .status { min-width:0; }
    #source { max-width:55%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .party-lyrics { min-height:135px; border-radius:22px; padding:19px 22px; background:linear-gradient(135deg,rgba(0,255,242,.075),rgba(174,77,240,.07)); border:1px solid rgba(255,255,255,.09); overflow:hidden; }
    .party-lyrics[hidden] { display:none; }
    .lyrics-label { display:flex; justify-content:space-between; color:#75dcd6; text-transform:uppercase; letter-spacing:.17em; font-size:11px; font-weight:800; }
    .lyrics-line { margin-top:17px; font-size:clamp(21px,2.4vw,34px); line-height:1.35; font-weight:800; overflow-wrap:anywhere; }
    .lyrics-next { margin-top:8px; color:#9daabe; font-size:15px; overflow-wrap:anywhere; }
    .lyrics-line.enter { animation:lyric-in .38s ease-out; }
    .party-lyrics[data-style='kinetic'] .lyrics-line { color:#84fff4; text-transform:uppercase; letter-spacing:.04em; }
    .party-lyrics[data-style='rhythm-cut'] .lyrics-line { color:#ffacd9; font-style:italic; }
    .party-lyrics[data-style='manga'] { background:linear-gradient(135deg,#29213d,#101721); }
    .party-lyrics[data-style='manga'] .lyrics-line { text-shadow:3px 3px 0 #6c368d; }
    .party-lyrics[data-style='handwritten'] .lyrics-line { font-family:cursive; font-weight:500; color:#ffe8b6; }
    .party-lyrics[data-style='subtitle'] .lyrics-line { text-align:center; font-size:24px; }
    .party-lyrics[data-style='focus'] .lyrics-line { font-size:clamp(28px,3.3vw,44px); }
    @keyframes lyric-in { from { opacity:0; transform:translateY(9px); } to { opacity:1; transform:none; } }
    @media (max-width: 760px) { body { padding:18px; } body::before { margin-bottom:16px; } .wrap,.wrap.has-video { display:flex; flex-direction:column; min-height:0; } .art,.wrap.has-video .art { min-height:0; height:min(75vw,360px); border-right:0; border-bottom:1px solid rgba(255,255,255,.08); } .main { padding:24px; } .row input[type='range'] { min-width:100px; } #source { display:none; } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="art">
      <img id="artwork" src="${artwork || ''}" style="${artwork ? '' : 'display:none;'} max-width: 100%; max-height: 100%; object-fit: cover;" alt="artwork" />
      <div id="fallback" class="fallback" style="${artwork ? 'display:none;' : ''}">NeonWave</div>
      <video id="player" preload="metadata" playsinline webkit-playsinline style="width: 100%; height: 100%; object-fit: contain; display: none; position: absolute; inset: 0; z-index: 5;"></video>
    </div>
    <div class="main">
      <div>
        <div class="eyebrow">Listening Party</div>
        <h1 id="title">${title || '等待主機開始播放'}</h1>
        <div class="artist" id="artist">${artist || '目前尚未同步歌曲'}</div>
      </div>
      <div class="meta">
        ${album ? `<span class="pill" id="album">${album}</span>` : ''}
        <span class="pill" id="conn">連線中</span>
        <span class="pill" id="room">Room ${escapeHtml(roomId)}</span>
      </div>
      <div class="party-lyrics" id="lyricsPanel" hidden>
        <div class="lyrics-label"><span>同步歌詞</span><span id="soundMode">原音</span></div>
        <div class="lyrics-line" id="lyricCurrent">♪</div>
        <div class="lyrics-next" id="lyricNext"></div>
      </div>
      <div id="linkStatus" class="status waiting">
        <span class="status-dot"></span>
        <div class="status-text">
          <div class="status-title">正在等待 Cloudflare 公開網址</div>
          <div class="status-subtitle">連線成功後才會顯示分享連結，避免曝光本機位址。</div>
        </div>
      </div>
      <div>
        <div class="bar"><div id="progress"></div></div>
        <div class="status">
          <span id="time">0:00 / 0:00</span>
          <span id="source">${inviteUrl ? escapeHtml(inviteUrl) : '等待 Cloudflare 產生公開連結'}</span>
        </div>
      </div>
      <div class="controls">
        <button id="toggleBtn" class="primary">${isPlaying === 'true' ? '暫停聆聽' : '開始聆聽'}</button>
        <button id="nextBtn" class="secondary">下一首</button>
        <button id="copyBtn" class="secondary" ${inviteUrl ? '' : 'disabled'}>複製邀請連結</button>
      </div>
      <div class="row">
        <span style="font-size: 13px; color: var(--muted); min-width: 36px;">進度</span>
        <input id="seek" type="range" min="0" max="${duration}" step="0.1" value="${currentTime}" ${streamable === 'true' ? '' : 'disabled'} />
        <button id="syncBtn" class="secondary">重新同步</button>
      </div>
      <div class="row" style="margin-top: 10px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 13px; color: var(--muted); min-width: 36px;">音量</span>
        <input id="volume" type="range" min="0" max="1" step="0.01" value="1" style="max-width: 150px; flex: initial;" />
        <span id="volumeVal" style="font-size: 12px; color: var(--muted); min-width: 36px; text-align: left;">100%</span>
      </div>
      <div class="error" id="error"></div>
    </div>
  </div>
  <script>
    const roomId = ${JSON.stringify(roomId)};
    const token = ${JSON.stringify(token)};
    const apiBase = '';
    const wrapEl = document.querySelector('.wrap');
    const audio = document.getElementById('player');
    const artworkEl = document.getElementById('artwork');
    const fallbackEl = document.getElementById('fallback');
    const titleEl = document.getElementById('title');
    const artistEl = document.getElementById('artist');
    const albumEl = document.getElementById('album');
    const connEl = document.getElementById('conn');
    const roomEl = document.getElementById('room');
    const progressEl = document.getElementById('progress');
    const timeEl = document.getElementById('time');
    const errorEl = document.getElementById('error');
    const linkStatusEl = document.getElementById('linkStatus');
    const seekEl = document.getElementById('seek');
    const toggleBtn = document.getElementById('toggleBtn');
    const nextBtn = document.getElementById('nextBtn');
    const copyBtn = document.getElementById('copyBtn');
    const syncBtn = document.getElementById('syncBtn');
    const sourceEl = document.getElementById('source');
    const volumeEl = document.getElementById('volume');
    const volumeValEl = document.getElementById('volumeVal');
    const lyricsPanel = document.getElementById('lyricsPanel');
    const lyricCurrent = document.getElementById('lyricCurrent');
    const lyricNext = document.getElementById('lyricNext');
    const soundModeEl = document.getElementById('soundMode');
    let state = ${JSON.stringify(baseState).replace(/</g, '\\u003c')};
    let manualSeek = false;
    let currentStreamPath = '';
    let pendingAudioTarget = null;
    let lastHostTime = 0;
    let lastHostTimeReceivedAt = 0;
    let joinedAudio = false;
    let locallyPaused = false;
    let lastLyricIndex = -2;
    let audioContext;
    let wetGain;
    let delayNode;

    function syncSoundMode() {
      if (!audioContext) return;
      const mode = state.soundMode || 'none';
      const effects = { none:[0,0], room:[.08,.09], hall:[.16,.16], concert:[.25,.22], racing:[.04,.05], fps:[.025,.035] };
      const params = effects[mode] || effects.none;
      delayNode.delayTime.setTargetAtTime(params[0], audioContext.currentTime, .05);
      wetGain.gain.setTargetAtTime(params[1], audioContext.currentTime, .05);
    }

    function ensureAudioEffects() {
      if (audioContext) { audioContext.resume(); return; }
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return;
      audioContext = new Context();
      const source = audioContext.createMediaElementSource(audio);
      delayNode = audioContext.createDelay(.5);
      wetGain = audioContext.createGain();
      source.connect(audioContext.destination);
      source.connect(delayNode);
      delayNode.connect(wetGain);
      wetGain.connect(audioContext.destination);
      syncSoundMode();
    }

    function renderLyrics(time) {
      const info = state.lyrics || {};
      const lines = Array.isArray(info.lines) ? info.lines : [];
      lyricsPanel.hidden = !info.visible;
      if (!info.visible) return;
      lyricsPanel.dataset.style = info.style || 'danmaku';
      const names = { none: '原音', room: '房間', hall: '空間', concert: '演唱會', racing: '賽車遊戲', fps: 'FPS' };
      soundModeEl.textContent = names[state.soundMode] || '原音';
      let index = -1;
      for (let i = 0; i < lines.length; i++) if (lines[i].time <= time) index = i;
      if (index === lastLyricIndex) return;
      lastLyricIndex = index;
      lyricCurrent.textContent = lines[index]?.text || (lines.length ? '♫' : '等待主機載入歌詞');
      lyricNext.textContent = lines[index + 1]?.text || '';
      lyricCurrent.classList.remove('enter');
      void lyricCurrent.offsetWidth;
      lyricCurrent.classList.add('enter');
    }

    // Initial volume load
    const savedVolume = localStorage.getItem('party_volume');
    if (savedVolume !== null) {
      const val = Number(savedVolume);
      audio.volume = val;
      if (volumeEl) volumeEl.value = String(val);
      if (volumeValEl) volumeValEl.textContent = Math.round(val * 100) + '%';
    }

    if (volumeEl) {
      volumeEl.addEventListener('input', () => {
        const val = Number(volumeEl.value);
        audio.volume = val;
        if (volumeValEl) volumeValEl.textContent = Math.round(val * 100) + '%';
        localStorage.setItem('party_volume', String(val));
      });
    }

    function fmt(t) {
      if (!isFinite(t) || t < 0) return '0:00';
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return m + ':' + String(s).padStart(2, '0');
    }

    function setError(msg) {
      errorEl.textContent = msg || '';
    }

    function setAudioSrc(forceReload = false) {
      if (!state.track || !state.track.streamable) {
        audio.removeAttribute('src');
        audio.load();
        currentStreamPath = '';
        audio.style.display = 'none';
        audio.hidden = true;
        if (artworkEl) artworkEl.style.display = state.track?.artwork ? '' : 'none';
        if (fallbackEl) fallbackEl.style.display = state.track?.artwork ? 'none' : '';
        return;
      }
      const buster = state.track.path ? encodeURIComponent(state.track.path) : Date.now();
      const next = '/api/room/' + roomId + '/stream?token=' + encodeURIComponent(token) + '&_cb=' + buster;
      if (currentStreamPath !== next || forceReload) {
        currentStreamPath = next;
        audio.src = next;
        audio.load();
        pendingAudioTarget = state.track.currentTime || 0;
      }
      if (state.track.isVideo) {
        audio.hidden = false;
        audio.style.display = 'block';
        if (artworkEl) artworkEl.style.display = 'none';
        if (fallbackEl) fallbackEl.style.display = 'none';
      } else {
        audio.hidden = true;
        audio.style.display = 'none';
        if (artworkEl) artworkEl.style.display = state.track.artwork ? '' : 'none';
        if (fallbackEl) fallbackEl.style.display = state.track.artwork ? 'none' : '';
      }
    }

    function syncAudioPosition(force = false) {
      if (!state.track?.streamable || !Number.isFinite(state.track.currentTime)) return;
      const elapsed = state.track.isPlaying && lastHostTimeReceivedAt ? (Date.now() - lastHostTimeReceivedAt) / 1000 : 0;
      const target = Math.min(state.track.duration || Infinity, Math.max(0, (state.track.currentTime || 0) + elapsed));
      const actual = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
      if (force || Math.abs(actual - target) > 3.0) {
        try {
          audio.currentTime = target;
        } catch {}
      }
      pendingAudioTarget = target;
    }

    async function sendCommand(action, value) {
      setError('');
      const res = await fetch(apiBase + '/api/room/' + roomId + '/command?token=' + encodeURIComponent(token), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, value })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'command failed');
      }
    }

    function render(next) {
      const oldTrackPath = (state && state.track) ? state.track.path || '' : '';
      const newTrackPath = (next && next.track) ? next.track.path || '' : '';
      const trackChanged = oldTrackPath !== newTrackPath;

      const hostTime = (next && next.track) ? next.track.currentTime || 0 : 0;
      const hostIsPlaying = !!(next && next.track && next.track.isPlaying);
      const now = Date.now();
      
      let hostDidSeek = false;
      if (lastHostTimeReceivedAt > 0 && !trackChanged) {
        const elapsed = (now - lastHostTimeReceivedAt) / 1000;
        const expectedHostTime = lastHostTime + (hostIsPlaying ? elapsed : 0);
        if (Math.abs(hostTime - expectedHostTime) > 2.5) {
          hostDidSeek = true;
        }
      }
      
      lastHostTime = hostTime;
      lastHostTimeReceivedAt = now;

      state = next;
      if (trackChanged) locallyPaused = false;
      syncSoundMode();
      if (trackChanged) lastLyricIndex = -2;
      seekEl.disabled = !next.track?.streamable || !next.permissions?.seek;
      nextBtn.disabled = !next.permissions?.next;
      nextBtn.title = next.permissions?.next ? '' : '主機未開放切歌';
      seekEl.title = next.permissions?.seek ? '' : '主機未開放調整進度';
      copyBtn.disabled = !next.publicUrl;
      if (wrapEl) {
        if (next.track?.isVideo) {
          wrapEl.classList.add('has-video');
        } else {
          wrapEl.classList.remove('has-video');
        }
      }
      if (titleEl) titleEl.textContent = next.track?.title || '等待主機開始播放';
      if (artistEl) artistEl.textContent = next.track?.artist || '目前尚未同步歌曲';
      if (albumEl) {
        albumEl.textContent = next.track?.album || '';
        albumEl.style.display = next.track?.album ? '' : 'none';
      }
      if (connEl) {
        connEl.textContent = next.active ? (next.publicUrl ? 'Cloudflare Tunnel 已連線' : '本機房間已啟動') : '尚未開啟房間';
      }
      if (linkStatusEl) {
        if (next.publicUrl) {
          linkStatusEl.className = 'status';
          linkStatusEl.innerHTML = '<span class="status-dot"></span><div class="status-text"><div class="status-title">分享連結已就緒</div><div class="status-subtitle">現在可以把公開網址分享給朋友。</div></div>';
        } else if (next.tunnelStatus === 'starting' || next.cloudflaredState === 'downloading') {
          linkStatusEl.className = 'status waiting';
          linkStatusEl.innerHTML = '<span class="status-dot"></span><div class="status-text"><div class="status-title">正在建立 Cloudflare Tunnel</div><div class="status-subtitle">請稍候，正在背景準備公開連結。</div></div>';
        } else if (next.active) {
          linkStatusEl.className = 'status waiting';
          linkStatusEl.innerHTML = '<span class="status-dot"></span><div class="status-text"><div class="status-title">等待 Cloudflare 產生公開連結</div><div class="status-subtitle">房間已啟動，但還沒拿到可對外分享的網址。</div></div>';
        } else {
          linkStatusEl.className = 'status waiting';
          linkStatusEl.innerHTML = '<span class="status-dot"></span><div class="status-text"><div class="status-title">尚未建立分享房間</div><div class="status-subtitle">按下建立房間後，會自動下載依賴並開啟 Tunnel。</div></div>';
        }
      }
      if (roomEl) roomEl.textContent = 'Room ' + (next.roomId || '-');

      const duration = next.track?.duration || 0;
      const currentTime = next.track?.currentTime || 0;
      const pct = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;
      
      const isLocallyPlaying = audio && !audio.paused && !audio.ended;
      if (!isLocallyPlaying) {
        progressEl.style.width = pct + '%';
        seekEl.max = String(duration || 0);
        if (!manualSeek) seekEl.value = String(currentTime || 0);
        timeEl.textContent = fmt(currentTime) + ' / ' + fmt(duration);
      }

      if (artworkEl) {
        if (next.track?.artwork) {
          if (artworkEl.getAttribute('src') !== next.track.artwork) artworkEl.src = next.track.artwork;
          artworkEl.style.display = next.track.isVideo ? 'none' : '';
          if (fallbackEl) fallbackEl.style.display = 'none';
        } else {
          artworkEl.src = '';
          artworkEl.style.display = 'none';
          if (fallbackEl) fallbackEl.style.display = next.track?.isVideo ? 'none' : '';
        }
      }
      toggleBtn.textContent = audio.paused ? '開始聆聽' : joinedAudio ? '暫停聆聽' : '開啟聲音';
      sourceEl.textContent = next.publicUrl || '等待 Cloudflare 產生公開連結';
      renderLyrics(audio.paused ? currentTime : audio.currentTime);

      setAudioSrc(trackChanged);
      if (!next.track?.streamable) {
        setError('目前播放的歌曲無法從主機直接串流。若是串流來源，請先改播本機檔案。');
      } else {
        setError('');
      }
      if (next.track?.isPlaying && !audio.paused) {
        if (hostDidSeek || trackChanged) {
          syncAudioPosition(true);
        }
      } else if (next.track?.isPlaying && joinedAudio) {
        syncAudioPosition(true);
        audio.play().catch(() => setError('請按播放按鈕，允許瀏覽器開始聆聽。'));
      } else if (next.track?.isPlaying && next.track.isVideo && !locallyPaused) {
        audio.muted = true;
        syncAudioPosition(true);
        audio.play().then(() => { toggleBtn.textContent = '開啟聲音'; }).catch(() => {
          setError('請按「開始聆聽」以播放影片。');
        });
      } else if (!next.track?.isPlaying && !audio.paused) {
        audio.pause();
        syncAudioPosition(true);
      } else if (hostDidSeek || trackChanged) {
        syncAudioPosition(true);
      }
    }

    nextBtn.addEventListener('click', () => sendCommand('next').catch(err => setError(err.message)));
    toggleBtn.addEventListener('click', () => {
      if (audio.paused || !joinedAudio) {
        joinedAudio = true;
        locallyPaused = false;
        audio.muted = false;
        ensureAudioEffects();
        syncAudioPosition(true);
        audio.play().then(() => toggleBtn.textContent = '暫停聆聽').catch(err => setError(err.message));
      } else { joinedAudio = false; locallyPaused = true; audio.pause(); toggleBtn.textContent = '開始聆聽'; }
    });
    syncBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(apiBase + '/api/room/' + roomId + '?token=' + encodeURIComponent(token));
        if (res.ok) {
          const nextState = await res.json();
          render(nextState);
          syncAudioPosition(true);
        }
      } catch (err) {
        setError(err.message || '同步失敗');
      }
    });
    copyBtn.addEventListener('click', async () => {
      try {
        if (!state.publicUrl) {
          setError('請等 Cloudflare 公開網址建立完成後再複製。');
          return;
        }
        await navigator.clipboard.writeText(state.publicUrl);
        copyBtn.textContent = '已複製';
        setTimeout(() => copyBtn.textContent = '複製邀請連結', 1200);
      } catch (err) {
        setError('複製失敗');
      }
    });

    seekEl.addEventListener('input', () => {
      manualSeek = true;
      const value = Number(seekEl.value);
      progressEl.style.width = state.track?.duration ? ((value / state.track.duration) * 100) + '%' : '0%';
      timeEl.textContent = fmt(value) + ' / ' + fmt(state.track?.duration || 0);
    });
    seekEl.addEventListener('change', () => {
      const value = Number(seekEl.value);
      sendCommand('seek', value).catch(err => setError(err.message));
      manualSeek = false;
    });

    audio.addEventListener('timeupdate', () => {
      if (manualSeek) return;
      const duration = audio.duration || state.track?.duration || 0;
      const currentTime = audio.currentTime || 0;
      const pct = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;
      progressEl.style.width = pct + '%';
      seekEl.max = String(duration || 0);
      seekEl.value = String(currentTime || 0);
      timeEl.textContent = fmt(currentTime) + ' / ' + fmt(duration);
      renderLyrics(currentTime);
    });
    audio.addEventListener('loadedmetadata', () => {
      syncAudioPosition(true);
    });
    audio.addEventListener('error', () => {
      if (audio.error) setError('串流載入失敗，請確認主機仍在播放可串流的本機檔案。');
    });

    // Quick Tunnels do not support SSE. Keep at most one bounded request in flight.
    let pollTimer;
    let pollStopped = false;
    let pollDelay = 1000;
    async function pollState() {
      try {
        const res = await fetch('/api/room/' + roomId + '?token=' + encodeURIComponent(token), {
          cache: 'no-store', signal: AbortSignal.timeout(8000)
        });
        if (!res.ok) {
          if (res.status === 403 || res.status === 404) {
            pollStopped = true;
            audio.pause();
            setError('房間已關閉，請向主機取得新的邀請連結。');
          }
          throw new Error('HTTP ' + res.status);
        }
        render(await res.json());
        pollDelay = 1000;
      } catch {
        connEl.textContent = pollStopped ? '房間已關閉' : '連線中斷，正在重試...';
        pollDelay = Math.min(pollDelay * 2, 10000);
      } finally {
        if (!pollStopped) pollTimer = setTimeout(pollState, pollDelay);
      }
    }
    window.addEventListener('pagehide', () => { pollStopped = true; clearTimeout(pollTimer); });
    window.addEventListener('pageshow', (evt) => {
      if (evt.persisted) { pollStopped = false; pollState(); }
    });
    pollState();

    render(state);
  </script>
</body>
</html>`
  }
}
