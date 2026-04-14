import { useState, useEffect } from 'react'
import type { PlateFeatureCollection } from '../types/plates'
import { AGE_STEP, AGE_MAX } from '../types/plates'

const cache = new Map<number, PlateFeatureCollection>()

function snapToStep(age: number): number {
  return Math.round(age / AGE_STEP) * AGE_STEP
}

async function fetchAge(age: number): Promise<void> {
  if (age < 0 || age > AGE_MAX || cache.has(age)) return
  try {
    const res = await fetch(`/data/muller/plates_${age}Ma.geojson`)
    if (!res.ok) return
    const data = (await res.json()) as PlateFeatureCollection
    cache.set(age, data)
  } catch {
    // silently ignore — hook returns null on error
  }
}

export function usePlateData(currentAge: number): {
  data: PlateFeatureCollection | null
  isLoading: boolean
} {
  const age = snapToStep(currentAge)
  const [data, setData] = useState<PlateFeatureCollection | null>(cache.get(age) ?? null)
  const [isLoading, setIsLoading] = useState(!cache.has(age))

  useEffect(() => {
    const cached = cache.get(age)
    if (cached) {
      setData(cached)
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    fetch(`/data/muller/plates_${age}Ma.geojson`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<PlateFeatureCollection>
      })
      .then((json) => {
        cache.set(age, json)
        if (!cancelled) {
          setData(json)
          setIsLoading(false)
          // Prefetch next 2 timesteps (fire-and-forget)
          fetchAge(age + AGE_STEP)
          fetchAge(age + AGE_STEP * 2)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(null)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [age])

  return { data, isLoading }
}
