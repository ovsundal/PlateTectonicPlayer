import { useState, useEffect, useRef } from 'react'
import type { PlatePolygonCollection } from '../types/plates'

const cache = new Map<number, PlatePolygonCollection>()

const GPLATES_API = 'https://gws.gplates.org/reconstruct/coastlines'
const MODEL = 'MULLER2022'

function plateUrl(ma: number): string {
  return `${GPLATES_API}?time=${ma}&model=${MODEL}`
}

interface UsePlateDataResult {
  data: PlatePolygonCollection | null
  loading: boolean
  error: string | null
}

function snapToStep(age: number, step = 5): number {
  return Math.round(age / step) * step
}

export function usePlateData(timeMa: number): UsePlateDataResult {
  const snappedTime = snapToStep(timeMa)
  const [data, setData] = useState<PlatePolygonCollection | null>(() => cache.get(snappedTime) ?? null)
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

    const url = plateUrl(snappedTime)

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`GPlates API error: ${res.status}`)
        return res.json() as Promise<PlatePolygonCollection>
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
