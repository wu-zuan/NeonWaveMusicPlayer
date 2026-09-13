import { createInterface } from 'node:readline'
import { AsyncLocalStorage } from 'node:async_hooks'

type Handler = (event: { sender: { send(channel: string, ...args: any[]): void; isDestroyed(): boolean } }, ...args: any[]) => any
const handlers = new Map<string, Handler>()
const context = new AsyncLocalStorage<string>()
const shutdownHandlers: Array<{ handler: () => any; last: boolean }> = []
const pending = new Map<number, { resolve(value: any): void; reject(error: Error): void }>()
let nextId = 0
let shuttingDown = false

export function encode(value: any): any {
  if (value === undefined) return { $undefined: true }
  if (value instanceof ArrayBuffer) return { $bytes: Buffer.from(value).toString('base64'), arrayBuffer: true }
  if (ArrayBuffer.isView(value)) return { $bytes: Buffer.from(value.buffer, value.byteOffset, value.byteLength).toString('base64') }
  if (Array.isArray(value)) return value.map(encode)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, encode(item)]))
  return value ?? null
}
export function decode(value: any): any {
  // The HTTP audio endpoint dispatches a Buffer directly. It must keep its
  // binary type; recursively enumerating its indices would discard the length.
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return value
  if (value?.$undefined === true) return undefined
  if (typeof value?.$bytes === 'string') return Buffer.from(value.$bytes, 'base64')
  if (Array.isArray(value)) return value.map(decode)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, decode(item)]))
  return value
}
function write(message: any) { process.stdout.write(JSON.stringify(encode(message)) + '\n') }
export function emit(window: string, channel: string, ...args: any[]) { write({ kind: 'event', window, channel, args }) }
export function native(command: string, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, { resolve, reject })
    write({ kind: 'native', id, command, args, window: context.getStore() || 'main' })
  })
}
export function onShutdown(handler: () => any, last = false) { shutdownHandlers.push({handler, last}) }
export async function shutdown() {
  if (shuttingDown) return
  shuttingDown = true
  const deadline = setTimeout(() => process.exit(1), 5000)
  await Promise.allSettled(shutdownHandlers.filter(item => !item.last).map(item => Promise.resolve().then(item.handler)))
  await Promise.allSettled(shutdownHandlers.filter(item => item.last).map(item => Promise.resolve().then(item.handler)))
  clearTimeout(deadline)
  write({kind: 'stopped'})
  process.exit(0)
}
export const rpc = {
  handle(channel: string, handler: Handler) {
    if (handlers.has(channel)) throw new Error(`Duplicate command: ${channel}`)
    handlers.set(channel, handler)
  },
  on(channel: string, handler: Handler) { this.handle(channel, handler) },
  async dispatch(channel: string, args: any[], window = 'main') {
    const handler = handlers.get(channel)
    if (!handler) throw new Error(`Unknown command: ${channel}`)
    return context.run(window, () => handler({ sender: {
      send: (name: string, ...payload: any[]) => emit(window, name, ...payload),
      isDestroyed: () => shuttingDown
    } }, ...args.map(decode)))
  },
  channels: () => [...handlers.keys()]
}

export function listen() {
  const input = createInterface({ input: process.stdin, crlfDelay: Infinity })
  input.on('line', line => {
    void (async () => {
      let message: any
      try {
        message = JSON.parse(line)
        if (message.kind === 'native-result') {
          const request = pending.get(message.id)
          pending.delete(message.id)
          if (message.error) request?.reject(new Error(message.error))
          else request?.resolve(message.result)
          return
        }
        if (message.kind === 'shutdown') { await shutdown(); return }
        const result = await rpc.dispatch(message.channel, message.args || [], message.window)
        write({ kind: 'result', id: message.id, result })
      } catch (error) {
        write({ kind: 'result', id: message?.id, error: error instanceof Error ? error.message : String(error) })
      }
    })()
  })
  input.on('close', () => { void shutdown() })
  process.on('SIGTERM', () => { void shutdown() })
  process.on('SIGINT', () => { void shutdown() })
  write({ kind: 'ready' })
}
