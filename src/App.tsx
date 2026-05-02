
import { useState, useEffect, useRef } from 'react'
import { Sidebar } from './components/Layout/Sidebar'
import { TrackList } from './components/Playlist/TrackList'
import { PlayerBar } from './components/Player/PlayerBar'
import { SettingsView } from './components/Layout/SettingsView'
import { SearchView } from './components/Search/SearchView'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useLibrary } from './hooks/useLibrary'
import { useAppDetection } from './hooks/useAppDetection'
import './index.css'

import { LyricsOverlay } from './components/Lyrics/LyricsOverlay'
import { DiscordControlPanel } from './components/DiscordBot/DiscordControlPanel'
import { ImportChoiceModal } from './components/UI/ImportChoiceModal'
import { DownloadProgressModal } from './components/UI/DownloadProgressModal'
import { MiniPlayer } from './components/Player/MiniPlayer'

function App() {
  const isMini = new URLSearchParams(window.location.search).get('mini') === 'true'

  useEffect(() => {
    if (isMini) {
      document.body.classList.add('mini-mode')
    } else {
      document.body.classList.remove('mini-mode')
    }
  }, [isMini])

  if (isMini) {
    return <MiniPlayer />
  }

  const {
    playlists, favorites, allTracks,
    addFolder, removeFolder, renameFolder, toggleFavorite, refreshLibrary,
    exportPlaylist, readImportFile, processStreamImport, processDownloadImport,
    downloadProgress, pauseDownload, resumeDownload, cancelDownload
  } = useLibrary()

  const [view, setView] = useState('all_songs')
  const [showLyrics, setShowLyrics] = useState(false)
  const [importModalData, setImportModalData] = useState<any | null>(null)

  const handleImportClick = async () => {
    const data = await readImportFile()
    if (data) {
      setImportModalData(data)
    }
  }

  const handleSelectStream = () => {
    if (importModalData) processStreamImport(importModalData)
    setImportModalData(null)
  }

  const handleSelectDownload = () => {
    if (importModalData) processDownloadImport(importModalData)
    setImportModalData(null)
  }

  const {
    isPlaying, currentTrack, currentTime, duration, volume, is8D,
    isShuffle, repeatMode,
    playTrack, togglePlay, setVolume, setIs8D, seek,
    toggleShuffle, toggleRepeat, handleNext, handlePrev,
    setDistance, setSpaceMode, setPosition, setFocusMode, setNormalization,
    getAudioStream, setLocalMute
  } = useAudioPlayer()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  // Auto-Detect Context
  const { contextMode } = useAppDetection()

  useEffect(() => {
    if (contextMode === 'work') {
      setFocusMode(true)
    } else if (contextMode === 'normal') {
      setFocusMode(false)
    }
    // 'game' mode currently does nothing specific, maybe future: lower volume
  }, [contextMode])

  // --- Discord Sync ---
  // --- Discord Sync (Streaming Mode) ---
  useEffect(() => {
    let active = true
    const handleSync = async () => {
      // 1. Check Status
      const status = await window.ipcRenderer.invoke('discord:status')

      if (!active) return

      if (status.isConnected && status.currentChannelId) {
        // Connected
        if (isPlaying) {
          // If we are playing, ensure we are streaming
          if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
            console.log('[App] Starting Discord Stream...')

            // A. Tell backend to expect stream
            await window.ipcRenderer.invoke('discord:startStreamMode')

            // B. Start Recorder
            const stream = getAudioStream()
            if (stream) {
              // Optimization: 96kbps is Discord's standard high quality. 
              // Reducing from 128k saves CPU encoding time and bandwidth without noticeable quality loss.
              const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 96000 })

              recorder.ondataavailable = async (e) => {
                if (e.data.size > 0) {
                  const buffer = await e.data.arrayBuffer()
                  // Use send for performance (fire and forget)
                  window.ipcRenderer.send('discord:audio-chunk', buffer)
                }
              }

              recorder.start(100) // 100ms chunks
              mediaRecorderRef.current = recorder
            }

            // C. Mute Local (Speakers), Keep Stream
            setLocalMute(true)

            // D. Ensure Discord Volume is Max (since we control volume in the stream)
            window.ipcRenderer.invoke('discord:setVolume', 100).catch(console.error)
          } else {
            // Already recording, maybe ensure Resume
            if (mediaRecorderRef.current.state === 'paused') mediaRecorderRef.current.resume()
            window.ipcRenderer.invoke('discord:resume').catch(console.error)
          }
        } else {
          // Paused / Stopped
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause() // Pause recorder? Or stop?
            // If we stop, we need to restart logic. Pause is better for "Pause" button.
            // backend pause
            window.ipcRenderer.invoke('discord:pause').catch(console.error)
          }
        }
      } else {
        // Not connected
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop()
          mediaRecorderRef.current = null
        }
        setLocalMute(false) // Unmute local
      }
    }

    handleSync()

    return () => { active = false }
  }, [isPlaying, currentTrack, getAudioStream, setLocalMute]) // Removed 'volume' dependency to avoid re-trigger

  // Volume Sync: Logic changed. Since stream includes volume, we DON'T send volume to discord separately 
  // IF we are streaming. But if we are playing valid local file (fallback), we might?
  // Our new model is ALWAYS stream if connected. So we disable separate volume sync.
  /*
  useEffect(() => {
    // Sync Volume to Discord Bot
    window.ipcRenderer.invoke('discord:setVolume', volume * 100).catch(console.error)
  }, [volume]) 
  */

  // Note: seek sync is harder, skipping for now unless requested

  // Determine which tracks to show based on view
  let displayedTracks = allTracks
  let viewTitle = '所有歌曲'

  if (view === 'all_songs') {
    displayedTracks = allTracks
    viewTitle = '所有歌曲'
  } else if (view === 'favorites') {
    displayedTracks = favorites
    viewTitle = '我的最愛'
  } else {
    // Find playlist by ID/Path
    const pl = playlists.find(p => p.id === view)
    if (pl) {
      displayedTracks = pl.tracks
      viewTitle = pl.name
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        playlists={playlists}
        onOpenFolder={addFolder}
        onRemoveFolder={removeFolder}
        onRenameFolder={renameFolder}
        onRefreshLibrary={refreshLibrary}
        onExportPlaylist={exportPlaylist}
        onImportPlaylist={handleImportClick}
        currentView={view}
        onChangeView={setView}
      />

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}>
        {/* Draggable Title Bar Area */}
        <div style={{
          height: '32px',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 90,
          WebkitAppRegion: 'drag'
        } as any} />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '100px' }}>
          {(view === 'all_songs' || view === 'favorites' || playlists.some(p => p.id === view)) && (
            <TrackList
              title={viewTitle}
              tracks={displayedTracks}
              currentTrack={currentTrack}
              onPlay={(track) => playTrack(track, displayedTracks)}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          )}

          {view === 'search' && (
            <SearchView />
          )}

          {view === 'settings' && (
            <SettingsView />
          )}

          {view === 'discord' && (
            <DiscordControlPanel />
          )}
        </div>

        <LyricsOverlay
          visible={showLyrics}
          onClose={() => setShowLyrics(false)}
          trackTitle={currentTrack?.title || ''}
          trackArtist={currentTrack?.artist || ''}
          trackPath={currentTrack?.path}
          trackArtwork={currentTrack?.artwork || undefined}
          trackDuration={duration}
          currentTime={currentTime}
        />

        <PlayerBar
          isPlaying={isPlaying}
          currentTrack={currentTrack}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          is8D={is8D}
          isShuffle={isShuffle}
          repeatMode={repeatMode}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onVolumeChange={setVolume}
          onToggle8D={() => setIs8D(!is8D)}
          onToggleShuffle={toggleShuffle}
          onToggleRepeat={toggleRepeat}
          onNext={handleNext}
          onPrev={handlePrev}
          onSetDistance={setDistance}
          onSetSpace={setSpaceMode}
          onSetPosition={setPosition}
          onSetFocusMode={setFocusMode}
          onSetNormalization={setNormalization}
          onToggleLyrics={() => setShowLyrics(!showLyrics)}
        />

        <ImportChoiceModal
          isOpen={!!importModalData}
          playlistName={importModalData?.name || ''}
          onSelectStream={handleSelectStream}
          onSelectDownload={handleSelectDownload}
          onCancel={() => setImportModalData(null)}
        />

        <DownloadProgressModal 
          progress={downloadProgress} 
          onPause={pauseDownload}
          onResume={resumeDownload}
          onCancel={cancelDownload}
        />
      </main>
    </div>
  )
}

export default App
