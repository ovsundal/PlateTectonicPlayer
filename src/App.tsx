import { Globe } from './components/Globe'
import { TimelineControls } from './components/TimelineControls'
import { AgeLabel } from './components/AgeLabel'
import { useAnimation } from './hooks/useAnimation'
import { usePlateData } from './hooks/usePlateData'

function App() {
  const { isPlaying, currentAge, speed, play, pause, seek, setSpeed } = useAnimation()
  const { data } = usePlateData(currentAge)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Globe data={data} />
      <AgeLabel currentAge={currentAge} />
      <TimelineControls
        isPlaying={isPlaying}
        currentAge={currentAge}
        speed={speed}
        onPlay={play}
        onPause={pause}
        onSeek={seek}
        onSetSpeed={setSpeed}
      />
    </div>
  )
}

export default App
