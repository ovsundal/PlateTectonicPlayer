import { useState, useRef, useCallback, useEffect } from 'react'
import { AGE_MIN, AGE_MAX } from '../types/plates'

const DEFAULT_SPEED = 30 // Ma per second

export function useAnimation(speed?: number): {
  isPlaying: boolean
  currentAge: number
  play: () => void
  pause: () => void
  seek: (age: number) => void
} {
  const effectiveSpeed = speed ?? DEFAULT_SPEED
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAge, setCurrentAge] = useState(AGE_MIN)

  const rafHandle = useRef<number | null>(null)
  const lastTimestamp = useRef<number>(0)
  const ageRef = useRef<number>(AGE_MIN)
  const speedRef = useRef<number>(effectiveSpeed)

  // Keep speedRef in sync with prop
  useEffect(() => {
    speedRef.current = effectiveSpeed
  }, [effectiveSpeed])

  const tick = useCallback((now: number) => {
    const delta = now - lastTimestamp.current
    lastTimestamp.current = now

    const newAge = Math.min(ageRef.current + speedRef.current * delta / 1000, AGE_MAX)
    ageRef.current = newAge
    setCurrentAge(newAge)

    if (newAge >= AGE_MAX) {
      setIsPlaying(false)
      rafHandle.current = null
      return
    }

    rafHandle.current = requestAnimationFrame(tick)
  }, [])

  const play = useCallback(() => {
    if (ageRef.current >= AGE_MAX) {
      ageRef.current = AGE_MIN
      setCurrentAge(AGE_MIN)
    }
    setIsPlaying(true)
    lastTimestamp.current = performance.now()
    rafHandle.current = requestAnimationFrame(tick)
  }, [tick])

  const pause = useCallback(() => {
    setIsPlaying(false)
    if (rafHandle.current !== null) {
      cancelAnimationFrame(rafHandle.current)
      rafHandle.current = null
    }
  }, [])

  const seek = useCallback((age: number) => {
    const clamped = Math.max(AGE_MIN, Math.min(AGE_MAX, age))
    ageRef.current = clamped
    setCurrentAge(clamped)
  }, [])

  // Cancel rAF on unmount
  useEffect(() => {
    return () => {
      if (rafHandle.current !== null) {
        cancelAnimationFrame(rafHandle.current)
      }
    }
  }, [])

  return { isPlaying, currentAge, play, pause, seek }
}
