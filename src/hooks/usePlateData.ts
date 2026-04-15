import { useState, useEffect, useRef } from 'react'
import type { PlatePolygonCollection } from '../types/plates'

const GWS_BASE = 'https://gws.gplates.org/topology/plate_polygons'

const cache = new Map<number, PlatePolygonCollection>()

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

    const url = `${GWS_BASE}?time=${snappedTime}&model=MULLER2022`

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`GWS responded ${res.status}`)
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
