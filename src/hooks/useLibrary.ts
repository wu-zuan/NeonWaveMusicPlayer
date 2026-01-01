import { useState, useEffect } from 'react'
import { Track } from './useAudioPlayer'

// Persist folders in localStorage
const STORAGE_KEY_FOLDERS = 'neonwave_folders'
const STORAGE_KEY_FAVORITES = 'neonwave_favorites'

export interface Playlist {
    id: string
    name: string
    type: 'folder' | 'favorites' | 'custom'
    tracks: Track[]
    path?: string // for folder type
}

export function useLibrary() {
    // We will now manage a list of playlists instead of just one list of tracks
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [favorites, setFavorites] = useState<Track[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Load saved folders and favorites on init
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
            const foldersJson = localStorage.getItem(STORAGE_KEY_FOLDERS)
            const folderPaths: string[] = foldersJson ? JSON.parse(foldersJson) : []

            const loadedPlaylists: Playlist[] = []

            for (const path of folderPaths) {
                const tracks = await scanFolder(path)
                loadedPlaylists.push({
                    id: path, // use path as ID for simplicity
                    name: path.split('\\').pop() || '未命名資料夾',
                    type: 'folder',
                    path: path,
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
            return files.map((filePath) => {
                const filename = filePath.replace(/^.*[\\/]/, '')
                return {
                    path: filePath,
                    title: filename,
                    artist: '未知演出者',
                    album: '未知專輯',
                    duration: 0
                }
            })
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

            // Check if already exists
            const savedFolders: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY_FOLDERS) || '[]')
            if (savedFolders.includes(folderPath)) {
                alert('這個資料夾已經在音樂庫中了！')
                setIsLoading(false)
                return
            }

            // Save
            savedFolders.push(folderPath)
            localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(savedFolders))

            // Load and Add to State
            const tracks = await scanFolder(folderPath)
            const newPlaylist: Playlist = {
                id: folderPath,
                name: folderPath.split('\\').pop() || '新資料夾',
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
        const savedFolders: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY_FOLDERS) || '[]')
        const newFolders = savedFolders.filter(p => p !== folderPath)
        localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(newFolders))
        setPlaylists(prev => prev.filter(p => p.path !== folderPath))
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

    // Flatten all tracks for "All Songs" view if needed
    const allTracks = playlists.flatMap(p => p.tracks)

    return {
        playlists,
        favorites,
        allTracks,
        addFolder,
        removeFolder,
        toggleFavorite,
        isLoading,
        refreshLibrary: loadSavedData
    }
}
