/**
 * Region-based plate coloring: compute polygon centroid, assign color
 * based on which geographic region it falls into.
 */

interface Region {
  name: string
  color: [number, number, number, number]
  lonMin: number
  lonMax: number
  latMin: number
  latMax: number
}

const REGIONS: Region[] = [
  { name: 'North America',  color: [180, 140, 100, 255], lonMin: -170, lonMax: -50,  latMin: 15,  latMax: 85 },
  { name: 'South America',  color: [120, 170, 90, 255],  lonMin: -90,  lonMax: -30,  latMin: -60, latMax: 15 },
  { name: 'Europe',         color: [130, 130, 180, 255], lonMin: -15,  lonMax: 45,   latMin: 35,  latMax: 75 },
  { name: 'Africa',         color: [210, 150, 100, 255], lonMin: -20,  lonMax: 55,   latMin: -40, latMax: 35 },
  { name: 'Central Asia',   color: [170, 130, 80, 255],  lonMin: 45,   lonMax: 100,  latMin: 25,  latMax: 75 },
  { name: 'East Asia',      color: [190, 110, 110, 255], lonMin: 100,  lonMax: 150,  latMin: 10,  latMax: 75 },
  { name: 'South Asia',     color: [200, 170, 110, 255], lonMin: 60,   lonMax: 100,  latMin: -10, latMax: 35 },
  { name: 'Southeast Asia', color: [160, 180, 120, 255], lonMin: 95,   lonMax: 155,  latMin: -15, latMax: 25 },
  { name: 'Australia',      color: [190, 120, 70, 255],  lonMin: 110,  lonMax: 180,  latMin: -50, latMax: -10 },
  { name: 'Antarctica',     color: [200, 220, 240, 255], lonMin: -180, lonMax: 180,  latMin: -90, latMax: -60 },
  { name: 'Arctic',         color: [180, 210, 230, 255], lonMin: -180, lonMax: 180,  latMin: 70,  latMax: 90 },
  { name: 'Pacific Islands',color: [100, 160, 160, 255], lonMin: 150,  lonMax: 180,  latMin: -50, latMax: 30 },
]

export const REGION_LEGEND = REGIONS.map(r => ({ name: r.name, color: r.color }))

const DEFAULT_COLOR: [number, number, number, number] = [150, 130, 110, 255]

function computeCentroid(geometry: GeoJSON.Geometry): [number, number] {
  let coords: number[][] = []

  if (geometry.type === 'Polygon') {
    coords = (geometry as GeoJSON.Polygon).coordinates[0]
  } else if (geometry.type === 'MultiPolygon') {
    // Use the first (usually largest) ring
    coords = (geometry as GeoJSON.MultiPolygon).coordinates[0][0]
  } else {
    return [0, 0]
  }

  let lonSum = 0
  let latSum = 0
  for (const c of coords) {
    lonSum += c[0]
    latSum += c[1]
  }
  return [lonSum / coords.length, latSum / coords.length]
}

function findRegion(lon: number, lat: number): Region | undefined {
  // Check more specific regions first (smaller boxes), then broader ones
  for (const r of REGIONS) {
    if (lat >= r.latMin && lat <= r.latMax && lon >= r.lonMin && lon <= r.lonMax) {
      return r
    }
  }
  return undefined
}

export function getRegionColor(feature: GeoJSON.Feature): [number, number, number, number] {
  const [lon, lat] = computeCentroid(feature.geometry)
  const region = findRegion(lon, lat)
  return region?.color ?? DEFAULT_COLOR
}
