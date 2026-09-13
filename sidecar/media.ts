import { createServer, type ServerResponse, type IncomingMessage } from 'node:http'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { rpc, onShutdown } from './transport'

const mediaTypes: Record<string, string> = {
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.flac': 'audio/flac',
  '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.oga': 'audio/ogg', '.wma': 'audio/x-ms-wma',
  '.mp4': 'video/mp4', '.mkv': 'video/x-matroska', '.webm': 'video/webm',
  '.mov': 'video/quicktime', '.wmv': 'video/x-ms-wmv', '.avi': 'video/x-msvideo'
}
export function assertMediaPath(file: unknown): asserts file is string {
  if (typeof file !== 'string' || !path.isAbsolute(file) || !mediaTypes[path.extname(file).toLowerCase()] || file.includes('\0')) {
    throw new Error('Only absolute audio/video file paths are permitted')
  }
}

export function parseRange(range: string | undefined, size: number) {
  let start = 0, end = Math.max(0, size - 1)
  if (!range) return { start, end, status: 200 }
  const match = /^bytes=(\d*)-(\d*)$/i.exec(range.trim())
  if (!match || (!match[1] && !match[2])) return null
  if (!match[1]) start = Math.max(0, size - Number(match[2]))
  else start = Number(match[1])
  if (match[1] && match[2]) end = Math.min(Number(match[2]), size - 1)
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || end < start) return null
  return { start, end, status: 206 }
}

async function serveLocal(request: IncomingMessage, response: ServerResponse, url: URL) {
  const file = url.searchParams.get('path')
  assertMediaPath(file)
  const resolved = await fsp.realpath(file)
  assertMediaPath(resolved)
  const stat = await fsp.stat(resolved)
  if (!stat.isFile()) throw new Error('Not a file')
  response.setHeader('Content-Type', mediaTypes[path.extname(file).toLowerCase()])
  response.setHeader('Accept-Ranges', 'bytes')
  const byteLimit = Number(url.searchParams.get('maxBytes'))
  if (url.searchParams.has('maxBytes') && (byteLimit < 0 || !Number.isFinite(byteLimit) || stat.size > byteLimit)) {
    response.writeHead(413).end('Audio file is too large for in-memory calibration')
    return
  }
  const range = parseRange(request.headers.range, stat.size)
  if (!range) { response.setHeader('Content-Range', `bytes */${stat.size}`); response.writeHead(416).end(); return }
  if (range.status === 206) response.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${stat.size}`)
  response.setHeader('Content-Length', stat.size === 0 ? 0 : range.end - range.start + 1)
  response.writeHead(range.status)
  if (request.method === 'HEAD' || stat.size === 0) { response.end(); return }
  await pipeline(fs.createReadStream(resolved, { start: range.start, end: range.end }), response)
}

async function serveRemote(request: IncomingMessage, response: ServerResponse, url: URL) {
  let target = new URL(url.searchParams.get('u') || '')
  // Only the YouTube stream provider used by the existing preview feature.
  if (target.protocol !== 'https:' || !/(^|\.)googlevideo\.com$/i.test(target.hostname)) {
    response.writeHead(403).end('Stream host is not permitted'); return
  }
  const abort = new AbortController()
  response.on('close', () => abort.abort())
  let upstream: Response | undefined
  for (let hop = 0; hop < 6; hop++) {
    if (target.protocol !== 'https:' || !/(^|\.)googlevideo\.com$/i.test(target.hostname)) throw new Error('Redirect host is not permitted')
    upstream = await fetch(target, { method: request.method, redirect: 'manual', signal: abort.signal,
      headers: request.headers.range ? { Range: request.headers.range } : {} })
    if (![301, 302, 303, 307, 308].includes(upstream.status)) break
    const next = upstream.headers.get('location')
    await upstream.body?.cancel()
    if (!next || hop === 5) throw new Error('Invalid stream redirect')
    target = new URL(next, target)
  }
  if (!upstream) throw new Error('Stream unavailable')
  for (const name of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control']) {
    const value = upstream.headers.get(name)
    if (value) response.setHeader(name, value)
  }
  response.writeHead(upstream.status)
  if (!upstream.body || request.method === 'HEAD') { response.end(); return }
  await pipeline(Readable.fromWeb(upstream.body as never), response)
}

export async function startMediaServer() {
  const token = randomBytes(32).toString('hex')
  const origins = new Set(['http://tauri.localhost', 'https://tauri.localhost', 'tauri://localhost'])
  if (process.env.NW_DEVELOPMENT === '1') {
    origins.add('http://127.0.0.1:5173'); origins.add('http://localhost:5173')
  }
  const server = createServer((request, response) => {
    void (async () => {
      try {
        const url = new URL(request.url || '/', 'http://127.0.0.1')
        const parts = url.pathname.split('/')
        const given = Buffer.from(parts[1] || '')
        if (given.length !== token.length || !timingSafeEqual(given, Buffer.from(token))) {
          response.writeHead(403).end(); return
        }
        const origin = request.headers.origin
        if (origin && !origins.has(origin)) { response.writeHead(403).end(); return }
        if (origin) response.setHeader('Access-Control-Allow-Origin', origin)
        response.setHeader('Vary', 'Origin')
        response.setHeader('Referrer-Policy', 'no-referrer')
        response.setHeader('X-Content-Type-Options', 'nosniff')
        response.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length')
        if (request.method === 'OPTIONS') {
          response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST')
          response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range')
          response.writeHead(204).end(); return
        }
        if (parts[2] === 'audio' && request.method === 'POST') {
          let size = 0
          const chunks: Buffer[] = []
          for await (const chunk of request) {
            size += chunk.length
            if (size > 8 * 1024 * 1024) { response.writeHead(413).end(); return }
            chunks.push(chunk)
          }
          await rpc.dispatch('discord:audio-chunk', [Buffer.concat(chunks)])
          response.writeHead(204).end(); return
        }
        if (!['GET', 'HEAD'].includes(request.method || '')) { response.writeHead(405).end(); return }
        if (parts[2] === 'local') await serveLocal(request, response, url)
        else if (parts[2] === 'remote') await serveRemote(request, response, url)
        else response.writeHead(404).end()
      } catch (error: any) {
        if (response.destroyed) return
        if (response.headersSent) response.destroy()
        else response.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Media request failed')
      }
    })()
  })
  await new Promise<void>((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject))
  const port = (server.address() as {port: number}).port
  onShutdown(() => new Promise<void>(resolve => { server.closeAllConnections(); server.close(() => resolve()) }))
  return `http://127.0.0.1:${port}/${token}`
}
