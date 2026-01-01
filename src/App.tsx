import { useState } from 'react'
import { Sidebar } from './components/Layout/Sidebar'
import { TrackList } from './components/Playlist/TrackList'
import { PlayerBar } from './components/Player/PlayerBar'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useLibrary } from './hooks/useLibrary'
import './index.css'

function App() {
  const {
    isPlaying, currentTrack, currentTime, duration, volume, is8D,
    playTrack, togglePlay, setVolume, setIs8D, seek
  } = useAudioPlayer()

  const { tracks, openLibrary } = useLibrary()
  const [view, setView] = useState('library')

  // Simple next/prev logic
  const handleNext = () => {
    if (!currentTrack || tracks.length === 0) return
    const idx = tracks.findIndex(t => t.path === currentTrack.path)
    const nextIdx = (idx + 1) % tracks.length
    playTrack(tracks[nextIdx])
  }

  const handlePrev = () => {
    if (!currentTrack || tracks.length === 0) return
    const idx = tracks.findIndex(t => t.path === currentTrack.path)
    const prevIdx = (idx - 1 + tracks.length) % tracks.length
    playTrack(tracks[prevIdx])
  }

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
              onPlay={playTrack}
            />
          )}

          {view === 'search' && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '100%', color: 'var(--text-muted)'
            }}>
              <h2>Online Search & Download (Coming Soon)</h2>
            </div>
          )}

          {view === 'settings' && (
            <div style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Settings</h2>
              <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
                <p>Audio Engine: Web Audio API (Spatial)</p>
                <p>Version: 1.0.0 Alpha</p>
              </div>
            </div>
          )}
        </div>

        <PlayerBar
          isPlaying={isPlaying}
          currentTrack={currentTrack}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          is8D={is8D}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onVolumeChange={setVolume}
          onToggle8D={() => setIs8D(!is8D)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </main>
    </div>
  )
}

export default App
