import { useState, useRef, useCallback, useEffect } from 'react'

const STEP_MA = 5
const MAX_AGE = 750
const MIN_AGE = 0

function snapToStep(age: number): number {
  return Math.round(age / STEP_MA) * STEP_MA
}

interface UseAnimationResult {
  currentAge: number
  isPlaying: boolean
  playbackSpeed: number
  play: () => void
  pause: () => void
  setAge: (age: number) => void
  setSpeed: (speed: number) => void
}

export function useAnimation(): UseAnimationResult {
  const [currentAge, setCurrentAge] = useState<number>(MAX_AGE)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)

  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const ageRef = useRef<number>(MAX_AGE)
  const speedRef = useRef<number>(1)
  const playingRef = useRef<boolean>(false)

  // Keep refs in sync with state
  useEffect(() => { ageRef.current = currentAge }, [currentAge])
  useEffect(() => { speedRef.current = playbackSpeed }, [playbackSpeed])

  const tick = useCallback((timestamp: number) => {
    if (!playingRef.current) return

    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp
    }

    const elapsed = (timestamp - lastTimeRef.current) / 1000 // seconds
    lastTimeRef.current = timestamp

    // At 1x speed, advance 5 Ma per second
    const maDelta = elapsed * STEP_MA * speedRef.current
    let newAge = ageRef.current - maDelta

    if (newAge <= MIN_AGE) {
      newAge = MAX_AGE
    }

    const snapped = snapToStep(newAge)
    ageRef.current = newAge
    setCurrentAge(snapped)

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const play = useCallback(() => {
    if (playingRef.current) return
    playingRef.current = true
    setIsPlaying(true)
    lastTimeRef.current = null
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const pause = useCallback(() => {
    playingRef.current = false
    setIsPlaying(false)
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    lastTimeRef.current = null
  }, [])

  const setAge = useCallback((age: number) => {
    const snapped = snapToStep(Math.max(MIN_AGE, Math.min(MAX_AGE, age)))
    ageRef.current = snapped
    setCurrentAge(snapped)
  }, [])

  const setSpeed = useCallback((speed: number) => {
    speedRef.current = speed
    setPlaybackSpeed(speed)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { currentAge, isPlaying, playbackSpeed, play, pause, setAge, setSpeed }
}
