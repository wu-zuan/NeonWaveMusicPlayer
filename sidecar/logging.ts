import fs from 'node:fs'
import path from 'node:path'
import { format } from 'node:util'
import { userData } from './paths'
import { onShutdown } from './transport'

export function setupLogging() {
  fs.mkdirSync(userData, { recursive: true })
  const stream = fs.createWriteStream(path.join(userData, 'debug.log'), { flags: 'w' })
  const write = (level: string, args: any[]) => {
    const line = `[${new Date().toISOString()}] [${level}] ${format(...args)}\n`
    stream.write(line)
    process.stderr.write(line)
  }
  for (const level of ['log', 'info', 'debug', 'warn', 'error'] as const) {
    console[level] = (...args) => write(level.toUpperCase(), args)
  }
  process.on('uncaughtException', error => write('CRITICAL', [error]))
  process.on('unhandledRejection', error => write('CRITICAL', [error]))
  stream.on('error', error => process.stderr.write(`Log write failed: ${error.message}\n`))
  onShutdown(() => new Promise<void>(resolve => stream.end(resolve)), true)
  console.log('NeonWave Tauri sidecar started')
}
