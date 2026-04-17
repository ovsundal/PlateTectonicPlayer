/**
 * Region-based plate coloring anchored to present-day (0 Ma) positions.
 *
 * At 0 Ma, each polygon's centroid determines its region color.
 * For other time steps, each polygon is matched to the nearest 0 Ma
 * polygon (by centroid distance) and inherits that polygon's color.
 * This lets you see "where is Africa?" even during Pangaea.
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
  { name: 'North America',  color: [90, 160, 200, 255],  lonMin: -170, lonMax: -50,  latMin: 15,  latMax: 85 },
  { name: 'South America',  color: [120, 180, 80, 255],  lonMin: -90,  lonMax: -30,  latMin: -60, latMax: 15 },
  { name: 'Europe',         color: [140, 120, 190, 255], lonMin: -15,  lonMax: 45,   latMin: 35,  latMax: 75 },
  { name: 'Africa',         color: [220, 170, 60, 255],  lonMin: -20,  lonMax: 55,   latMin: -40, latMax: 35 },
  { name: 'Central Asia',   color: [200, 100, 100, 255], lonMin: 45,   lonMax: 100,  latMin: 25,  latMax: 75 },
  { name: 'East Asia',      color: [190, 110, 160, 255], lonMin: 100,  lonMax: 150,  latMin: 10,  latMax: 75 },
  { name: 'South Asia',     color: [80, 190, 160, 255],  lonMin: 60,   lonMax: 100,  latMin: -10, latMax: 35 },
  { name: 'Southeast Asia', color: [160, 180, 120, 255], lonMin: 95,   lonMax: 155,  latMin: -15, latMax: 25 },
  { name: 'Australia',      color: [210, 140, 70, 255],  lonMin: 110,  lonMax: 180,  latMin: -50, latMax: -10 },
  { name: 'Antarctica',     color: [200, 220, 240, 255], lonMin: -180, lonMax: 180,  latMin: -90, latMax: -60 },
  { name: 'Arctic',         color: [180, 210, 230, 255], lonMin: -180, lonMax: 180,  latMin: 70,  latMax: 90 },
  { name: 'Pacific Islands',color: [100, 160, 160, 255], lonMin: 150,  lonMax: 180,  latMin: -50, latMax: 30 },
]

export const REGION_LEGEND = REGIONS.map(r => ({ name: r.name, color: r.color }))

const DEFAULT_COLOR: [number, number, number, number] = [150, 130, 110, 255]

export function computeCentroid(geometry: GeoJSON.Geometry): [number, number] {
  let coords: number[][] = []

  if (geometry.type === 'Polygon') {
    coords = (geometry as GeoJSON.Polygon).coordinates[0]
  } else if (geometry.type === 'MultiPolygon') {
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
  for (const r of REGIONS) {
    if (lat >= r.latMin && lat <= r.latMax && lon >= r.lonMin && lon <= r.lonMax) {
      return r
    }
  }
  return undefined
}

export function getRegionColorFromCentroid(lon: number, lat: number): [number, number, number, number] {
  return findRegion(lon, lat)?.color ?? DEFAULT_COLOR
}

/**
 * Reference data: 0 Ma centroids with their region colors.
 * Built once when 0 Ma data loads, used to color all other time steps.
 */
interface RefPoint {
  lon: number
  lat: number
  color: [number, number, number, number]
}

let referencePoints: RefPoint[] | null = null

/** Call once when 0 Ma plate data is available. */
export function buildReference(features: GeoJSON.Feature[]): void {
  referencePoints = features.map(f => {
    const [lon, lat] = computeCentroid(f.geometry)
    const color = getRegionColorFromCentroid(lon, lat)
    return { lon, lat, color }
  })
}

export function isReferenceReady(): boolean {
  return referencePoints !== null
}

/** Haversine-like squared distance (fast, no sqrt needed for comparison). */
function distSq(lon1: number, lat1: number, lon2: number, lat2: number): number {
  const dLon = lon1 - lon2
  const dLat = lat1 - lat2
  return dLon * dLon + dLat * dLat
}

/**
 * For a polygon at any time step, find the nearest 0 Ma reference point
 * and return its region color.
 */
export function getAnchoredColor(feature: GeoJSON.Feature): [number, number, number, number] {
  if (!referencePoints || referencePoints.length === 0) {
    // Fallback: color by current position
    const [lon, lat] = computeCentroid(feature.geometry)
    return getRegionColorFromCentroid(lon, lat)
  }

  const [lon, lat] = computeCentroid(feature.geometry)

  // Find nearest reference point
  let bestDist = Infinity
  let bestColor = DEFAULT_COLOR
  for (const ref of referencePoints) {
    const d = distSq(lon, lat, ref.lon, ref.lat)
    if (d < bestDist) {
      bestDist = d
      bestColor = ref.color
    }
  }
  return bestColor
}
