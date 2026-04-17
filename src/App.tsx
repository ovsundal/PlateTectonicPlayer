import { useState, useEffect, useCallback } from 'react'
import Globe from './components/Globe'
import AgeLabel from './components/AgeLabel'
import TimelineControls from './components/TimelineControls'
import NowPanel from './components/NowPanel'
import PlateLegend from './components/PlateLegend'
import { useAnimation } from './hooks/useAnimation'

const STEP_MA = 5
const MAX_AGE = 750
const MIN_AGE = 0

function App() {
  const { currentAge, isPlaying, playbackSpeed, direction, play, pause, setAge, setSpeed, setDirection } = useAnimation()
  const [showCountries, setShowCountries] = useState(true)
  const [showGraticule, setShowGraticule] = useState(true)
  const [colorByPlate, setColorByPlate] = useState(false)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === '+' || e.key === '=') {
      setAge(Math.min(currentAge + STEP_MA, MAX_AGE))
    } else if (e.key === '-' || e.key === '_') {
      setAge(Math.max(currentAge - STEP_MA, MIN_AGE))
    }
  }, [currentAge, setAge])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, background: '#000000', overflow: 'hidden' }}>
      <Globe currentAge={currentAge} showCountries={showCountries} showGraticule={showGraticule} colorByPlate={colorByPlate} />
      <PlateLegend visible={colorByPlate} />
      <AgeLabel age={currentAge} />
      <NowPanel currentAge={currentAge} />
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
        showGraticule={showGraticule}
        onToggleGraticule={() => setShowGraticule((v) => !v)}
        onToggleCountries={() => setShowCountries((v) => !v)}
        colorByPlate={colorByPlate}
        onToggleColorByPlate={() => setColorByPlate((v) => !v)}
      />
    </div>
  )
}

export default App
