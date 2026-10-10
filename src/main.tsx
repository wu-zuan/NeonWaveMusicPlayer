import { initializeTheme } from './theme'
import { initializeDesktop, desktopReady } from './desktop'
import './startup.css'
import './desktop.css'

const mini = new URLSearchParams(location.search).get('mini') === 'true'
const startup = document.getElementById('startup')!
const message = document.getElementById('startup-message')!
const retry = document.getElementById('startup-retry')!
retry.addEventListener('click', () => location.reload())
if (mini) {
    startup.remove()
    document.documentElement.classList.add('mini-mode')
    document.body.classList.add('mini-mode')
}
performance.mark('neonwave:start')

async function start() {
    // Show the lightweight shell before loading React and optional views.
    if (!mini) await desktopReady()
    const renderer = import('./renderApp')
    void renderer.catch(() => {})
    await initializeDesktop()
    initializeTheme()
    message.textContent = '正在開啟播放器…'
    await (await renderer).renderApp()
    performance.mark('neonwave:ready')
    performance.measure('neonwave:startup', 'neonwave:start', 'neonwave:ready')
    startup.dataset.state = 'ready'
    setTimeout(() => startup.remove(), 180)
    if (mini) await desktopReady()
}

const timeout = setTimeout(() => {
    message.textContent = '啟動需要較長時間，你可以繼續等待或重新載入。'
    retry.hidden = false
}, 15000)

void start().catch(error => {
    console.error('NeonWave initialization failed', error)
    startup.dataset.state = 'error'
    message.textContent = `暫時無法開啟播放器。${String(error)}`
    retry.hidden = false
    if (mini) {
        document.getElementById('root')!.textContent = '迷你播放器載入失敗，請關閉後重開。'
        void desktopReady()
    }
}).finally(() => clearTimeout(timeout))
