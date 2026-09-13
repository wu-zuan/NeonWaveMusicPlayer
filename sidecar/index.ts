import { setupLogging } from './logging'
import { listen, rpc, onShutdown } from './transport'
import { loadPreferences, preferences, setPreference, flushPreferences } from './storage'
import { startMediaServer, assertMediaPath } from './media'
import { trackChildren } from './children'

setupLogging()
trackChildren()
// Listening before service initialization allows native replies during startup.
const startup = (async () => {
  await loadPreferences()
  const { startServices } = await import('./services')
  await startServices()
  const mediaBase = await startMediaServer()
  return { mediaBase }
})()
rpc.handle('desktop:bootstrap', async () => ({ ...await startup, preferences: preferences(), platform: process.platform }))
rpc.handle('storage:set', async (_, key: string, value: string | null) => { await startup; await setPreference(key, value) })
rpc.handle('renderer:log', (_, level: string, message: string) => { console.log(`[RENDERER-${level}] ${String(message).slice(0, 16000)}`) })
onShutdown(flushPreferences)

const dispatch = rpc.dispatch.bind(rpc)
rpc.dispatch = async (channel, args, window) => {
  if (!['desktop:bootstrap', 'storage:set', 'renderer:log'].includes(channel)) await startup
  if (['files:readBuffer', 'files:readBufferPartial', 'files:getArtwork', 'files:getMetadata', 'discord:play', 'lyrics:gpuCalibrate'].includes(channel)) assertMediaPath(args[0])
  if (channel === 'files:getMetadataBatch') {
    if (!Array.isArray(args[0]) || args[0].length > 100000) throw new Error('Invalid metadata batch')
    args[0].forEach(assertMediaPath)
  }
  return dispatch(channel, args, window)
}
listen()
