import type * as GeoJSON from 'geojson'

export function buildGraticule(): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = []
  for (let lat = -90; lat <= 90; lat += 30) {
    const coords: [number, number][] = []
    for (let lon = -180; lon <= 180; lon += 2) {
      coords.push([lon, lat])
    }
    features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} })
  }
  for (let lon = -180; lon <= 180; lon += 30) {
    const coords: [number, number][] = []
    for (let lat = -90; lat <= 90; lat += 2) {
      coords.push([lon, lat])
    }
    features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} })
  }
  return { type: 'FeatureCollection', features }
}
