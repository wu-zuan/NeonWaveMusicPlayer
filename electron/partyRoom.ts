import { app } from 'electron'
import http, { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import crypto from 'node:crypto'
import { spawn, type ChildProcess } from 'node:child_process'
import { Readable } from 'node:stream'

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
  track: {
    title: string
    artist: string
    album?: string
    artwork?: string
    currentTime: number
    duration: number
    isPlaying: boolean
    streamable: boolean
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
  private roomId: string | null = null
  private roomToken: string | null = null
  private tunnelProcess: ChildProcess | null = null
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

  constructor(onCommand: (command: PartyCommand) => void) {
    this.onCommand = onCommand
  }

  isActive() {
    return !!this.server
  }

  updatePlayback(snapshot: Partial<PlaybackSnapshot>) {
    this.playback = {
      ...this.playback,
      ...snapshot,
      updatedAt: Date.now()
    }
    this.broadcastState()
  }

  async start(options: PartySessionOptions = {}) {
    await this.ensureServer()
    if (options.autoTunnel) {
      await this.startTunnel().catch((err) => {
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
    this.broadcastState()
  }

  getStatus(): PartyStatus {
    const liveCurrentTime = this.getLiveCurrentTime()
    const streamable = !!this.playback.path && !this.playback.path.startsWith('shared:')
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
      track: this.roomId
        ? {
            title: this.playback.title || '',
            artist: this.playback.artist || '',
            album: this.playback.album,
            artwork: this.playback.artwork,
            currentTime: liveCurrentTime,
            duration: this.playback.duration || 0,
            isPlaying: this.playback.isPlaying,
            streamable
          }
        : null
    }
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

  private async ensureServer() {
    if (this.server) return

    this.roomId = randomId(8)
    this.roomToken = randomId(24)

    this.server = http.createServer((req, res) => {
      void this.handleRequest(req, res)
    })

    await new Promise<void>((resolve, reject) => {
      const onError = (err: Error) => {
        this.server?.off('error', onError)
        reject(err)
      }
      this.server?.once('error', onError)
      this.server?.listen(0, '127.0.0.1', () => {
        this.server?.off('error', onError)
        const addr = this.server?.address()
        if (addr && typeof addr === 'object') {
          this.serverPort = addr.port
        }
        resolve()
      })
    })

    this.keepAliveTimer = setInterval(() => {
      this.flushKeepAlive()
    }, 25000)

    this.broadcastState()
  }

  private stopServer() {
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
      } catch {}
      this.server = null
    }
  }

  private stopTunnel() {
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

  private async startTunnel() {
    if (!this.serverPort) throw new Error('本機房間尚未啟動')
    if (this.tunnelProcess) return

    const cloudflared = await this.ensureCloudflared()
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

    const handleOutput = (chunk: Buffer) => {
      const text = chunk.toString('utf8')
      const match = text.match(/https:\/\/[a-zA-Z0-9.-]+\.trycloudflare\.com/i)
      if (match) {
        this.tunnelUrl = match[0]
        this.tunnelStatus = 'connected'
        this.tunnelMessage = 'Cloudflare Tunnel 已連線'
        this.broadcastState()
      }
    }

    child.stdout.on('data', handleOutput)
    child.stderr.on('data', handleOutput)

    child.on('exit', (code, signal) => {
      this.tunnelProcess = null
      if (this.tunnelStatus !== 'idle') {
        this.tunnelStatus = 'error'
        this.tunnelMessage = `Cloudflare Tunnel 已停止 (${signal || code || 'unknown'})`
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

    const localPath = path.join(app.getPath('userData'), 'cloudflared', process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared')
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

  private async downloadCloudflared(): Promise<string> {
    if (process.platform !== 'win32') {
      throw new Error('目前僅支援 Windows 自動安裝 cloudflared')
    }

    const releaseUrl = 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe'
    const installDir = path.join(app.getPath('userData'), 'cloudflared')
    const targetPath = path.join(installDir, 'cloudflared.exe')
    const tempPath = `${targetPath}.download`

    await fsPromises.mkdir(installDir, { recursive: true })
    this.cloudflaredMessage = '正在背景下載 cloudflared...'
    this.broadcastState()

    const response = await fetch(releaseUrl, { redirect: 'follow' })
    if (!response.ok || !response.body) {
      throw new Error(`下載 cloudflared 失敗：${response.status} ${response.statusText}`)
    }

    const total = Number(response.headers.get('content-length') || 0)
    let received = 0
    const file = fs.createWriteStream(tempPath)
    const reader = Readable.fromWeb(response.body as any)

    try {
      for await (const chunk of reader) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        received += buffer.length
        if (!file.write(buffer)) {
          await new Promise<void>((resolve, reject) => {
            file.once('drain', resolve)
            file.once('error', reject)
          })
        }
        if (total > 0) {
          this.cloudflaredProgress = Math.min(1, received / total)
          this.broadcastState()
        }
      }
    } catch (err) {
      file.destroy()
      throw err
    } finally {
      file.end()
    }

    await new Promise<void>((resolve, reject) => {
      file.once('finish', resolve)
      file.once('error', reject)
    })

    await fsPromises.rename(tempPath, targetPath)
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
    return this.getPublicUrl() || this.getLocalUrl()
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
      this.sendJson(res, 200, this.getStatus())
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
      res.write(`event: state\ndata: ${JSON.stringify(this.getStatus())}\n\n`)
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
      if (!body?.action) {
        this.sendJson(res, 400, { error: 'missing_action' })
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
        const match = /bytes=(\d+)-(\d*)/.exec(range)
        if (!match) {
          this.sendJson(res, 416, { error: 'invalid_range' })
          return
        }

        const start = Number(match[1])
        const end = match[2] ? Number(match[2]) : fileSize - 1
        if (start >= fileSize || end >= fileSize || start > end) {
          this.sendJson(res, 416, { error: 'range_not_satisfiable' })
          return
        }

        res.statusCode = 206
        res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`)
        res.setHeader('Content-Length', end - start + 1)
        fs.createReadStream(filePath, { start, end }).pipe(res)
        return
      }

      res.statusCode = 200
      res.setHeader('Content-Length', fileSize)
      fs.createReadStream(filePath).pipe(res)
    } catch (err) {
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
    const payload = `event: state\ndata: ${JSON.stringify(this.getStatus())}\n\n`
    for (const client of this.sseClients) {
      try {
        client.write(payload)
      } catch {}
    }
  }

  private renderGuestPage(roomId: string, token: string) {
    const baseState = this.getStatus()
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
      background: rgba(255,255,255,.05);
      border-right: 1px solid var(--line);
      display: grid;
      place-items: center;
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
  </style>
</head>
<body>
  <div class="wrap">
    <div class="art">
      ${artwork ? `<img id="artwork" src="${artwork}" alt="artwork" />` : `<div class="fallback">NeonWave</div>`}
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
      <div>
        <div class="bar"><div id="progress"></div></div>
        <div class="status">
          <span id="time">0:00 / 0:00</span>
          <span id="source">${escapeHtml(inviteUrl || '')}</span>
        </div>
      </div>
      <div class="controls">
        <button id="prevBtn" class="secondary">上一首</button>
        <button id="toggleBtn" class="primary">${isPlaying === 'true' ? '暫停' : '播放'}</button>
        <button id="nextBtn" class="secondary">下一首</button>
        <button id="copyBtn" class="secondary">複製邀請連結</button>
      </div>
      <div class="row">
        <input id="seek" type="range" min="0" max="${duration}" step="0.1" value="${currentTime}" ${streamable === 'true' ? '' : 'disabled'} />
        <button id="syncBtn" class="secondary">同步</button>
      </div>
      <div class="error" id="error"></div>
      <audio id="audio" preload="metadata" ${streamable === 'true' ? '' : 'hidden'}></audio>
    </div>
  </div>
  <script>
    const roomId = ${JSON.stringify(roomId)};
    const token = ${JSON.stringify(token)};
    const apiBase = '';
    const audio = document.getElementById('audio');
    const titleEl = document.getElementById('title');
    const artistEl = document.getElementById('artist');
    const albumEl = document.getElementById('album');
    const connEl = document.getElementById('conn');
    const roomEl = document.getElementById('room');
    const progressEl = document.getElementById('progress');
    const timeEl = document.getElementById('time');
    const errorEl = document.getElementById('error');
    const seekEl = document.getElementById('seek');
    const toggleBtn = document.getElementById('toggleBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const copyBtn = document.getElementById('copyBtn');
    const syncBtn = document.getElementById('syncBtn');
    const sourceEl = document.getElementById('source');
    let state = ${JSON.stringify(baseState)};
    let manualSeek = false;
    let currentStreamPath = '';

    function fmt(t) {
      if (!isFinite(t) || t < 0) return '0:00';
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      return m + ':' + String(s).padStart(2, '0');
    }

    function setError(msg) {
      errorEl.textContent = msg || '';
    }

    function setAudioSrc() {
      if (!state.track || !state.track.streamable) {
        audio.removeAttribute('src');
        audio.load();
        currentStreamPath = '';
        return;
      }
      const next = '/api/room/' + roomId + '/stream?token=' + encodeURIComponent(token);
      if (currentStreamPath !== next) {
        currentStreamPath = next;
        audio.src = next;
        audio.load();
      }
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
      state = next;
      if (titleEl) titleEl.textContent = next.track?.title || '等待主機開始播放';
      if (artistEl) artistEl.textContent = next.track?.artist || '目前尚未同步歌曲';
      if (albumEl) {
        albumEl.textContent = next.track?.album || '';
        albumEl.style.display = next.track?.album ? '' : 'none';
      }
      if (connEl) {
        connEl.textContent = next.active ? (next.publicUrl ? 'Cloudflare Tunnel 已連線' : '本機房間已啟動') : '尚未開啟房間';
      }
      if (roomEl) roomEl.textContent = 'Room ' + (next.roomId || '-');

      const duration = next.track?.duration || 0;
      const currentTime = next.track?.currentTime || 0;
      const pct = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;
      progressEl.style.width = pct + '%';
      seekEl.max = String(duration || 0);
      if (!manualSeek) seekEl.value = String(currentTime || 0);
      timeEl.textContent = fmt(currentTime) + ' / ' + fmt(duration);
      toggleBtn.textContent = next.track?.isPlaying ? '暫停' : '播放';
      sourceEl.textContent = next.publicUrl || next.localUrl || '';

      setAudioSrc();
      if (!next.track?.streamable) {
        setError('目前播放的歌曲無法從主機直接串流。若是串流來源，請先改播本機檔案。');
      } else {
        setError('');
      }
      if (next.track?.isPlaying && !audio.paused) {
        // keep playing
      } else if (next.track?.isPlaying) {
        audio.play().catch(() => {});
      } else if (!next.track?.isPlaying && !audio.paused) {
        audio.pause();
      }
    }

    prevBtn.addEventListener('click', () => sendCommand('prev').catch(err => setError(err.message)));
    nextBtn.addEventListener('click', () => sendCommand('next').catch(err => setError(err.message)));
    toggleBtn.addEventListener('click', () => sendCommand('toggle-play').catch(err => setError(err.message)));
    syncBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(apiBase + '/api/room/' + roomId + '?token=' + encodeURIComponent(token));
        if (res.ok) render(await res.json());
      } catch (err) {
        setError(err.message || '同步失敗');
      }
    });
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(state.publicUrl || state.localUrl || '');
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
      if (!state.track?.isPlaying) return;
      if (Math.abs(audio.currentTime - (state.track?.currentTime || 0)) > 2) {
        // host state will resync shortly
      }
    });
    audio.addEventListener('error', () => {
      if (audio.error) setError('串流載入失敗，請確認主機仍在播放可串流的本機檔案。');
    });

    const es = new EventSource(apiBase + '/api/room/' + roomId + '/events?token=' + encodeURIComponent(token));
    es.addEventListener('state', (evt) => {
      try {
        const next = JSON.parse(evt.data);
        render(next);
      } catch {}
    });
    es.onerror = () => {
      connEl.textContent = '連線中斷，正在重試...';
    };

    render(state);
  </script>
</body>
</html>`
  }
}
