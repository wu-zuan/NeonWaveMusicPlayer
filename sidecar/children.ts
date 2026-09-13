import { createRequire, syncBuiltinESMExports } from 'node:module'
import type { ChildProcess } from 'node:child_process'
import { onShutdown } from './transport'

// Central lifecycle ownership also covers children spawned by mature libraries
// (yt-dlp-wrap and Discord). Keep command construction in those implementations.
export function trackChildren() {
  const processModule = createRequire(import.meta.url)('node:child_process')
  const original = processModule.spawn
  const children = new Set<ChildProcess>()
  processModule.spawn = (executable: string, args: any, options: any = {}) => {
    const child = original(executable, args, { ...options, windowsHide: true, ...(process.platform === 'win32' ? {} : { detached: true }) })
    children.add(child)
    child.once('close', () => children.delete(child))
    return child
  }
  syncBuiltinESMExports()
  onShutdown(() => {
    for (const child of children) {
      try {
        if (process.platform !== 'win32' && child.pid) process.kill(-child.pid, 'SIGTERM')
        else child.kill()
      } catch { /* Already reaped by the service or host job object. */ }
    }
  })
}
