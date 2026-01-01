
import { useState } from 'react'
import { Sidebar } from './components/Layout/Sidebar'
import { TrackList } from './components/Playlist/TrackList'
import { PlayerBar } from './components/Player/PlayerBar'
import { SettingsView } from './components/Layout/SettingsView'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useLibrary } from './hooks/useLibrary'
import './index.css'

function App() {
  const { tracks, openLibrary } = useLibrary()
  const [view, setView] = useState('library')

  const {
    isPlaying, currentTrack, currentTime, duration, volume, is8D,
    isShuffle, repeatMode,
    playTrack, togglePlay, setVolume, setIs8D, seek,
    toggleShuffle, toggleRepeat, handleNext, handlePrev
  } = useAudioPlayer()

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        onOpenFolder={openLibrary}
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
          {view === 'library' && (
            <TrackList
              tracks={tracks}
              currentTrack={currentTrack}
              onPlay={(track) => playTrack(track, tracks)}
            />
          )}

          {view === 'search' && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '100%', color: 'var(--text-muted)'
            }}>
              <h2>線上搜尋與下載 (敬請期待)</h2>
            </div>
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
        />
      </main>
    </div>
  )
}

export default App
