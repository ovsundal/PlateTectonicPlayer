import { describe, it, expect } from 'vitest'
import { buildGraticule } from '../utils/buildGraticule'

describe('buildGraticule', () => {
  const graticule = buildGraticule()

  it('returns a valid FeatureCollection', () => {
    expect(graticule.type).toBe('FeatureCollection')
    expect(Array.isArray(graticule.features)).toBe(true)
  })

  it('generates latitude lines every 30 degrees from -90 to 90', () => {
    const latLines = graticule.features.filter((f) => {
      const coords = f.geometry.type === 'LineString'
        ? (f.geometry as { coordinates: number[][] }).coordinates
        : []
      return coords.length > 0 && coords.every((c) => c[1] === coords[0][1])
    })
    // -90, -60, -30, 0, 30, 60, 90 = 7 lines
    expect(latLines).toHaveLength(7)
  })

  it('generates longitude lines every 30 degrees from -180 to 180', () => {
    const lonLines = graticule.features.filter((f) => {
      const coords = f.geometry.type === 'LineString'
        ? (f.geometry as { coordinates: number[][] }).coordinates
        : []
      return coords.length > 0 && coords.every((c) => c[0] === coords[0][0])
    })
    // -180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180 = 13 lines
    expect(lonLines).toHaveLength(13)
  })

  it('all features are LineStrings', () => {
    for (const f of graticule.features) {
      expect(f.geometry.type).toBe('LineString')
    }
  })

  it('total feature count is 20 (7 lat + 13 lon)', () => {
    expect(graticule.features).toHaveLength(20)
  })
})
