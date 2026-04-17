import { useState, useEffect, useRef } from 'react'
import type { BoundaryCollection } from '../types/plates'

const cache = new Map<number, BoundaryCollection>()

const ALL_AGES: number[] = Array.from({ length: 151 }, (_, i) => i * 5)
;(function prefetchAll() {
  for (const ma of ALL_AGES) {
    if (cache.has(ma)) continue
    fetch(`/data/muller/boundaries_${ma}Ma.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json: BoundaryCollection) => { cache.set(ma, json) })
      .catch(() => { /* silently skip — will retry on demand */ })
  }
})()

interface UseBoundaryDataResult {
  data: BoundaryCollection | null
  loading: boolean
  error: string | null
}

function snapToStep(age: number, step = 5): number {
  return Math.round(age / step) * step
}

export function useBoundaryData(timeMa: number): UseBoundaryDataResult {
  const snappedTime = snapToStep(timeMa)
  const [data, setData] = useState<BoundaryCollection | null>(() => cache.get(snappedTime) ?? null)
  const [loading, setLoading] = useState<boolean>(() => !cache.has(snappedTime))
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (cache.has(snappedTime)) {
      setData(cache.get(snappedTime)!)
      setLoading(false)
      setError(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    const url = `/data/muller/boundaries_${snappedTime}Ma.json`

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
        return res.json() as Promise<BoundaryCollection>
      })
      .then((json) => {
        cache.set(snappedTime, json)
        setData(json)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [snappedTime])

  return { data, loading, error }
}
