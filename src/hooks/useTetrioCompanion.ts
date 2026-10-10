import { useCallback, useEffect, useRef, useState } from 'react'

export const TETRIO_COMPANION_KEY = 'neonwave_tetrio_companion'
export type TetrioStatus = 'disabled' | 'checking' | 'waiting' | 'running' | 'no-track' | 'blocked' | 'unsupported' | 'error'

export function useTetrioCompanion(resume: () => Promise<boolean>) {
    const [enabled, setEnabled] = useState(() => localStorage.getItem(TETRIO_COMPANION_KEY) === 'true')
    const [status, setStatus] = useState<TetrioStatus>('disabled')
    const resumeRef = useRef(resume)
    resumeRef.current = resume
    const changeEnabled = useCallback((value: boolean) => {
        localStorage.setItem(TETRIO_COMPANION_KEY, String(value))
        setEnabled(value)
    }, [])

    useEffect(() => {
        if (!enabled) { setStatus('disabled'); return }
        let cancelled = false
        let wasRunning = false
        let launchStatus: TetrioStatus = 'running'
        let timer: ReturnType<typeof setTimeout>
        setStatus('checking')
        const poll = async () => {
            let supported = true
            try {
                const result = await window.ipcRenderer.invoke('app:tetrio-status') as { supported: boolean; running: boolean }
                if (cancelled) return
                supported = result.supported
                if (!supported) { setStatus('unsupported'); return }
                if (!result.running) {
                    wasRunning = false
                    setStatus('waiting')
                } else if (!wasRunning) {
                    // Consume the launch edge before playback: manual pauses and failures
                    // must never cause a poll loop to repeatedly start music.
                    wasRunning = true
                    try {
                        const resumed = await resumeRef.current()
                        launchStatus = resumed ? 'running' : 'no-track'
                    } catch {
                        launchStatus = 'blocked'
                    }
                    if (!cancelled) setStatus(launchStatus)
                } else {
                    // Recover the indicator after a transient query failure without replaying.
                    setStatus(launchStatus)
                }
            } catch {
                if (!cancelled) setStatus('error')
            } finally {
                if (!cancelled && supported) timer = setTimeout(poll, 2500)
            }
        }
        void poll()
        return () => { cancelled = true; clearTimeout(timer) }
    }, [enabled])

    return { enabled, status, changeEnabled }
}
