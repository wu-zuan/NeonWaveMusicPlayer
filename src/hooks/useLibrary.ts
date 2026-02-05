import { useState, useEffect } from 'react'
import { Track } from './useAudioPlayer'

// Persist folders in localStorage
const STORAGE_KEY_FOLDERS_V2 = 'neonwave_folders_v2' // Upgrade storage key for new format
const STORAGE_KEY_FAVORITES = 'neonwave_favorites'

interface FolderData {
    path: string
    name: string
}

export interface Playlist {
    id: string
    name: string
    type: 'folder' | 'favorites' | 'custom'
    tracks: Track[]
    path?: string // for folder type
}

export function useLibrary() {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [favorites, setFavorites] = useState<Track[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadSavedData()
    }, [])

    const loadSavedData = async () => {
        setIsLoading(true)
        try {
            // 1. Load Favorites
            const favJson = localStorage.getItem(STORAGE_KEY_FAVORITES)
            if (favJson) setFavorites(JSON.parse(favJson))

            // 2. Load Saved Folders
            // Try load V2 first
            let folderData: FolderData[] = []
            const v2Json = localStorage.getItem(STORAGE_KEY_FOLDERS_V2)

            if (v2Json) {
                folderData = JSON.parse(v2Json)
            } else {
                // Backward compatibility: load V1 (array of strings) and migrate
                const v1Json = localStorage.getItem('neonwave_folders')
                if (v1Json) {
                    const paths: string[] = JSON.parse(v1Json)
                    folderData = paths.map(p => ({
                        path: p,
                        name: p.split(/[\\/]/).pop() || '未命名資料夾'
                    }))
                    // Save to new format immediately
                    localStorage.setItem(STORAGE_KEY_FOLDERS_V2, JSON.stringify(folderData))
                }
            }

            const loadedPlaylists: Playlist[] = []

            for (const item of folderData) {
                const tracks = await scanFolder(item.path)
                loadedPlaylists.push({
                    id: item.path,
                    name: item.name,
                    type: 'folder',
                    path: item.path,
                    tracks: tracks
                })
            }

            setPlaylists(loadedPlaylists)

        } catch (e) {
            console.error("Error loading library data", e)
        } finally {
            setIsLoading(false)
        }
    }

    const scanFolder = async (folderPath: string): Promise<Track[]> => {
        try {
            const files = await window.ipcRenderer.listMusicFiles(folderPath)

            // Batch Processing to avoid IPC overload
            const chunk = <T>(arr: T[], size: number) =>
                Array.from({ length: Math.ceil(arr.length / size) }, (_: any, i: number) =>
                    arr.slice(i * size, i * size + size));

            const chunks = chunk(files, 50); // Process 50 files at a time
            const allTracks: Track[] = []

            for (const batch of chunks) {
                const batchResults = await Promise.all(batch.map(async (filePath) => {
                    const filename = filePath.replace(/^.*[\\/]/, '')
                    try {
                        // Optimization: Do NOT load artwork during scan. Load it on play.
                        const meta = await window.ipcRenderer.getAudioMetadata(filePath, { loadArtwork: false })
                        return {
                            path: filePath,
                            title: meta?.title || filename,
                            artist: meta?.artist || '未知演出者',
                            album: meta?.album || '未知專輯',
                            artwork: undefined, // Will be loaded lazily on play
                            duration: meta?.duration || 0,
                            codec: meta?.codec,
                            bitrate: meta?.bitrate,
                            sampleRate: meta?.sampleRate
                        }
                    } catch {
                        return {
                            path: filePath,
                            title: filename,
                            artist: '未知演出者',
                            album: '未知專輯',
                            duration: 0
                        }
                    }
                }))
                allTracks.push(...batchResults)
                // Small delay to let UI breathe if needed, but await Promise.all yields anyway
            }

            return allTracks
        } catch (e) {
            console.error("Failed to scan folder", folderPath, e)
            return []
        }
    }

    const addFolder = async () => {
        setIsLoading(true)
        try {
            const folderPath = await window.ipcRenderer.openDirectory()
            if (!folderPath) {
                setIsLoading(false)
                return
            }

            const currentData: FolderData[] = JSON.parse(localStorage.getItem(STORAGE_KEY_FOLDERS_V2) || '[]')

            // Check dupes
            if (currentData.some(f => f.path === folderPath)) {
                alert('這個資料夾已經在音樂庫中了！')
                setIsLoading(false)
                return
            }

            // Default name = folder name
            const defaultName = folderPath.split(/[\\/]/).pop() || '新資料夾'

            const newItem: FolderData = { path: folderPath, name: defaultName }
            const newData = [...currentData, newItem]

            localStorage.setItem(STORAGE_KEY_FOLDERS_V2, JSON.stringify(newData))

            // Load tracks
            const tracks = await scanFolder(folderPath)
            const newPlaylist: Playlist = {
                id: folderPath,
                name: defaultName,
                type: 'folder',
                path: folderPath,
                tracks: tracks
            }

            setPlaylists(prev => [...prev, newPlaylist])

        } catch (error) {
            console.error("Failed to add folder:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const removeFolder = (folderPath: string) => {
        const currentData: FolderData[] = JSON.parse(localStorage.getItem(STORAGE_KEY_FOLDERS_V2) || '[]')
        const newData = currentData.filter(p => p.path !== folderPath)
        localStorage.setItem(STORAGE_KEY_FOLDERS_V2, JSON.stringify(newData))
        setPlaylists(prev => prev.filter(p => p.path !== folderPath))
    }

    const renameFolder = (folderPath: string, newName: string) => {
        // Update persistent storage
        const currentData: FolderData[] = JSON.parse(localStorage.getItem(STORAGE_KEY_FOLDERS_V2) || '[]')
        const newData = currentData.map(item => {
            if (item.path === folderPath) {
                return { ...item, name: newName }
            }
            return item
        })
        localStorage.setItem(STORAGE_KEY_FOLDERS_V2, JSON.stringify(newData))

        // Update state
        setPlaylists(prev => prev.map(pl => {
            if (pl.path === folderPath) {
                return { ...pl, name: newName }
            }
            return pl
        }))
    }

    const toggleFavorite = (track: Track) => {
        setFavorites(prev => {
            const exists = prev.some(t => t.path === track.path)
            let newFavs
            if (exists) {
                newFavs = prev.filter(t => t.path !== track.path)
            } else {
                newFavs = [...prev, track]
            }
            localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavs))
            return newFavs
        })
    }

    // Flatten all tracks for "All Songs" view
    const allTracks = playlists.flatMap(p => p.tracks)

    return {
        playlists,
        favorites,
        allTracks,
        addFolder,
        removeFolder,
        renameFolder,
        toggleFavorite,
        isLoading,
        refreshLibrary: loadSavedData
    }
}
