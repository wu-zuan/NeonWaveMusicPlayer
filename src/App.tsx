
import { useState } from 'react'
import { Sidebar } from './components/Layout/Sidebar'
import { TrackList } from './components/Playlist/TrackList'
import { PlayerBar } from './components/Player/PlayerBar'
import { SettingsView } from './components/Layout/SettingsView'
import { SearchView } from './components/Search/SearchView'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useLibrary } from './hooks/useLibrary'
import './index.css'

function App() {
  const {
    playlists, favorites, allTracks,
    addFolder, removeFolder, renameFolder, toggleFavorite
  } = useLibrary()

  const [view, setView] = useState('all_songs')

  const {
    isPlaying, currentTrack, currentTime, duration, volume, is8D,
    isShuffle, repeatMode,
    playTrack, togglePlay, setVolume, setIs8D, seek,
    toggleShuffle, toggleRepeat, handleNext, handlePrev,
    setDistance, setSpaceMode, setPosition
  } = useAudioPlayer()

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
        </div>

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
        />
      </main>
    </div>
  )
}

export default App
