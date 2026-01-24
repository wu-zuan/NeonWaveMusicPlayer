
import { useState, useEffect } from 'react'
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

function App() {
  const {
    playlists, favorites, allTracks,
    addFolder, removeFolder, renameFolder, toggleFavorite, refreshLibrary
  } = useLibrary()

  const [view, setView] = useState('all_songs')
  const [showLyrics, setShowLyrics] = useState(false)

  const {
    isPlaying, currentTrack, currentTime, duration, volume, is8D,
    isShuffle, repeatMode,
    playTrack, togglePlay, setVolume, setIs8D, seek,
    toggleShuffle, toggleRepeat, handleNext, handlePrev,
    setDistance, setSpaceMode, setPosition, setFocusMode, setNormalization,
    setIsMuted
  } = useAudioPlayer()

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
  useEffect(() => {
    const syncDiscord = async () => {
      if (currentTrack && isPlaying) {
        if (currentTrack.path) {
          try {
            // Check connection first to avoid unnecessary errors
            const status = await window.ipcRenderer.invoke('discord:status')
            if (status.isConnected && status.currentChannelId) {
              console.log('[App] Discord bot connected, attempting to sync playback...')

              // Try to play on Discord
              await window.ipcRenderer.invoke('discord:play', currentTrack.path)

              // Only mute local player if Discord playback succeeded
              console.log('[App] ✓ Discord playback started, muting local player')
              setIsMuted(true)
            } else {
              // Bot not connected to voice channel, ensure local is not muted
              console.log('[App] Discord bot not connected to voice channel')
              setIsMuted(false)
            }
          } catch (e) {
            console.error('[App] Discord sync error:', e)
            // If Discord playback failed, unmute local player so user hears music
            console.log('[App] Discord playback failed, unmuting local player')
            setIsMuted(false)
          }
        }
      } else if (!isPlaying) {
        if (currentTrack) {
          window.ipcRenderer.invoke('discord:pause').catch(console.error)
        }
      }
    }
    syncDiscord()
  }, [currentTrack, isPlaying])

  useEffect(() => {
    // Sync Volume to Discord Bot
    window.ipcRenderer.invoke('discord:setVolume', volume * 100).catch(console.error)
  }, [volume])

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
      </main>
    </div>
  )
}

export default App
