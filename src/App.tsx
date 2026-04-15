import { useState } from 'react'
import Globe from './components/Globe'
import AgeLabel from './components/AgeLabel'
import TimelineControls from './components/TimelineControls'
import { useAnimation } from './hooks/useAnimation'

function App() {
  const { currentAge, isPlaying, playbackSpeed, direction, play, pause, setAge, setSpeed, setDirection } = useAnimation()
  const [showCountries, setShowCountries] = useState(true)

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, background: '#000000', overflow: 'hidden' }}>
      <Globe currentAge={currentAge} showCountries={showCountries} />
      <AgeLabel age={currentAge} />
      <TimelineControls
        currentAge={currentAge}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        direction={direction}
        showCountries={showCountries}
        onPlay={play}
        onPause={pause}
        onSetAge={setAge}
        onSetSpeed={setSpeed}
        onSetDirection={setDirection}
        onToggleCountries={() => setShowCountries((v) => !v)}
      />
    </div>
  )
}

export default App
