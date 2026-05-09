import { useState, useEffect } from 'react'

const IDE_APPS = ['code', 'visual studio', 'intellij', 'webstorm', 'atom', 'sublime_text']
const WORK_APPS = ['word', 'excel', 'powerpoint', 'notion', 'slack', 'teams']
const GAME_APPS = ['league of legends', 'valorant', 'minecraft', 'csgo', 'apex', 'overwatch', 'genshinimpact']

export function useAppDetection() {
    const [currentApp, setCurrentApp] = useState<string>('')
    const [contextMode, setContextMode] = useState<'normal' | 'work' | 'game'>('normal')

    useEffect(() => {
        const checkApp = async () => {
            try {
                
                const appName = await window.ipcRenderer.invoke('app:active-window')
                const lowerName = appName.toLowerCase()

                
                if (lowerName !== currentApp) {
                    setCurrentApp(lowerName)

                    if (IDE_APPS.some(a => lowerName.includes(a)) || WORK_APPS.some(a => lowerName.includes(a))) {
                        setContextMode('work')
                    } else if (GAME_APPS.some(a => lowerName.includes(a))) {
                        setContextMode('game')
                    } else {
                        setContextMode('normal')
                    }
                }
            } catch (e) {
                console.warn(e)
            }
        }

        const interval = setInterval(checkApp, 2000) 

        return () => clearInterval(interval)
    }, [currentApp])

    return {
        currentApp,
        contextMode
    }
}
