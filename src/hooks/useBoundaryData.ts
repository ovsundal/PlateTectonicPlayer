import { useState, useEffect, useRef } from 'react'
import type { BoundaryCollection } from '../types/plates'

const cache = new Map<number, BoundaryCollection>()

/** Ages for which boundary files are known NOT to exist (404). */
const missing = new Set<number>()

interface UseBoundaryDataResult {
  data: BoundaryCollection | null
  loading: boolean
  error: string | null
}

export function snapToStep(age: number, step = 5): number {
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

    if (missing.has(snappedTime)) {
      setData(null)
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
        const ct = res.headers.get('content-type') ?? ''
        if (!res.ok || !ct.includes('application/json')) {
          missing.add(snappedTime)
          setData(null)
          setLoading(false)
          return
        }
        return res.json() as Promise<BoundaryCollection>
      })
      .then((json) => {
        if (!json) return
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
