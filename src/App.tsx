import { Globe } from './components/Globe'
import { TimelineControls } from './components/TimelineControls'
import { useAnimation } from './hooks/useAnimation'
import { usePlateData } from './hooks/usePlateData'

function App() {
  const { isPlaying, currentAge, play, pause, seek } = useAnimation()
  const { data } = usePlateData(currentAge)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Globe data={data} />
      <TimelineControls
        isPlaying={isPlaying}
        currentAge={currentAge}
        onPlay={play}
        onPause={pause}
        onSeek={seek}
      />
    </div>
  )
}

export default App
