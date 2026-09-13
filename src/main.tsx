import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeTheme } from './theme.ts'
import { initializeDesktop, desktopReady } from './desktop.ts'
import './desktop.css'

initializeDesktop().then(() => {
  initializeTheme()
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode><App /></React.StrictMode>,
  )
  requestAnimationFrame(() => { void desktopReady() })
}).catch(error => {
  console.error('NeonWave initialization failed', error)
  const root = document.getElementById('root')!
  root.style.cssText = 'padding:40px;white-space:pre-wrap;user-select:text'
  root.textContent = `NeonWave 無法啟動背景服務。\n${String(error)}\n請重新啟動應用程式。`
  void desktopReady()
})
