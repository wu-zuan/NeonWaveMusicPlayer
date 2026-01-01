import { useState } from 'react'
import { Track } from './useAudioPlayer'

export function useLibrary() {
    const [tracks, setTracks] = useState<Track[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const openLibrary = async () => {
        setIsLoading(true)
        try {
            const folderPath = await window.ipcRenderer.openDirectory()
            if (!folderPath) {
                setIsLoading(false)
                return
            }

            const files = await window.ipcRenderer.listMusicFiles(folderPath)

            // Basic mapping using filenames
            const newTracks: Track[] = files.map((filePath) => {
                // Extract filename from path (Windows/Linux separator agnostic)
                const filename = filePath.replace(/^.*[\\/]/, '')
                return {
                    path: filePath,
                    title: filename,
                    artist: '未知演出者',
                    album: '未知專輯',
                    duration: 0
                }
            })

            setTracks(newTracks)
        } catch (error) {
            console.error("Failed to load library:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return { tracks, openLibrary, isLoading }
}
