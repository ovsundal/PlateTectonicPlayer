import { describe, it, expect } from 'vitest'
import { getAnchoredColor, getRegionColorFromCentroid, buildReference, REGION_LEGEND, computeCentroid } from './plateColors'

function makeFeature(coords: number[][]): GeoJSON.Feature {
  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [coords] },
    properties: {},
  }
}

describe('getRegionColorFromCentroid', () => {
  it('returns Europe color for European coordinates', () => {
    const europeColor = REGION_LEGEND.find(r => r.name === 'Europe')!.color
    expect(getRegionColorFromCentroid(15, 50)).toEqual(europeColor)
  })

  it('returns Africa color for African coordinates', () => {
    const africaColor = REGION_LEGEND.find(r => r.name === 'Africa')!.color
    expect(getRegionColorFromCentroid(25, 5)).toEqual(africaColor)
  })
})

describe('computeCentroid', () => {
  it('computes centroid of a simple polygon', () => {
    const [lon, lat] = computeCentroid({
      type: 'Polygon',
      coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]],
    })
    expect(lon).toBeCloseTo(4) // average of 0,10,10,0,0
    expect(lat).toBeCloseTo(4)
  })
})

describe('getAnchoredColor', () => {
  it('returns a color without reference (fallback)', () => {
    const feature = makeFeature([[10, 50], [20, 50], [20, 55], [10, 55], [10, 50]])
    const color = getAnchoredColor(feature)
    expect(color).toHaveLength(4)
    expect(color[3]).toBe(255)
  })

  it('uses reference colors after buildReference', () => {
    const refFeatures = [
      makeFeature([[10, 50], [20, 50], [20, 55], [10, 55], [10, 50]]), // Europe
      makeFeature([[25, 0], [35, 0], [35, 10], [25, 10], [25, 0]]),   // Africa
    ]
    buildReference(refFeatures)

    // A polygon near the Europe reference should get Europe's color
    const europeFeature = makeFeature([[12, 51], [18, 51], [18, 54], [12, 54], [12, 51]])
    const color = getAnchoredColor(europeFeature)
    const europeColor = REGION_LEGEND.find(r => r.name === 'Europe')!.color
    expect(color).toEqual(europeColor)
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
