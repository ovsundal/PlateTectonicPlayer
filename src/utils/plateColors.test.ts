import { describe, it, expect } from 'vitest'
import { getPlateColor } from './plateColors'

describe('getPlateColor', () => {
  it('returns an RGBA tuple with 4 elements', () => {
    const color = getPlateColor(0)
    expect(color).toHaveLength(4)
    expect(color[3]).toBe(255)
  })

  it('returns deterministic colors for the same plate ID', () => {
    expect(getPlateColor(5)).toEqual(getPlateColor(5))
  })

  it('returns different colors for different plate IDs', () => {
    expect(getPlateColor(0)).not.toEqual(getPlateColor(1))
  })

  it('handles negative plate IDs via Math.abs', () => {
    expect(getPlateColor(-3)).toEqual(getPlateColor(3))
  })

  it('wraps around for plate IDs >= 24', () => {
    expect(getPlateColor(24)).toEqual(getPlateColor(0))
    expect(getPlateColor(25)).toEqual(getPlateColor(1))
  })

  it('returns valid RGB values (0-255)', () => {
    for (let id = 0; id < 24; id++) {
      const [r, g, b, a] = getPlateColor(id)
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThanOrEqual(255)
      expect(g).toBeGreaterThanOrEqual(0)
      expect(g).toBeLessThanOrEqual(255)
      expect(b).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThanOrEqual(255)
      expect(a).toBe(255)
    }
  })

  it('produces known color for hue=0 (red-ish)', () => {
    const [r, g, b] = getPlateColor(0)
    expect(r).toBeGreaterThan(g)
    expect(r).toBeGreaterThan(b)
  })
})
