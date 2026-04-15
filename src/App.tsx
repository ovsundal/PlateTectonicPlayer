import Globe from './components/Globe'
import AgeLabel from './components/AgeLabel'
import TimelineControls from './components/TimelineControls'
import { useAnimation } from './hooks/useAnimation'

function App() {
  const { currentAge, isPlaying, playbackSpeed, play, pause, setAge, setSpeed } = useAnimation()

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, background: '#000000', overflow: 'hidden' }}>
      <Globe currentAge={currentAge} />
      <AgeLabel age={currentAge} />
      <TimelineControls
        currentAge={currentAge}
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        onPlay={play}
        onPause={pause}
        onSetAge={setAge}
        onSetSpeed={setSpeed}
      />
    </div>
  )
}

export default App
