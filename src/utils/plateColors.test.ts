import { describe, it, expect } from 'vitest'
import { getRegionColor, REGION_LEGEND } from './plateColors'

describe('getRegionColor', () => {
  it('returns an RGBA tuple with 4 elements', () => {
    const feature = makeFeature([[10, 50], [11, 50], [11, 51], [10, 51], [10, 50]])
    const color = getRegionColor(feature)
    expect(color).toHaveLength(4)
    expect(color[3]).toBe(255)
  })

  it('returns Europe color for polygon centered in Europe', () => {
    const feature = makeFeature([[10, 50], [20, 50], [20, 55], [10, 55], [10, 50]])
    const color = getRegionColor(feature)
    const europeColor = REGION_LEGEND.find(r => r.name === 'Europe')!.color
    expect(color).toEqual(europeColor)
  })

  it('returns Africa color for polygon centered in Africa', () => {
    const feature = makeFeature([[20, 0], [30, 0], [30, 10], [20, 10], [20, 0]])
    const color = getRegionColor(feature)
    const africaColor = REGION_LEGEND.find(r => r.name === 'Africa')!.color
    expect(color).toEqual(africaColor)
  })

  it('returns a default color for polygons outside defined regions', () => {
    // Middle of Pacific
    const feature = makeFeature([[-160, 0], [-150, 0], [-150, 5], [-160, 5], [-160, 0]])
    const color = getRegionColor(feature)
    expect(color).toHaveLength(4)
    expect(color[3]).toBe(255)
  })
})

describe('REGION_LEGEND', () => {
  it('has entries with name and color', () => {
    expect(REGION_LEGEND.length).toBeGreaterThan(0)
    for (const entry of REGION_LEGEND) {
      expect(entry.name).toBeTruthy()
      expect(entry.color).toHaveLength(4)
    }
  })
})

function makeFeature(coords: number[][]): GeoJSON.Feature {
  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [coords] },
    properties: {},
  }
}
