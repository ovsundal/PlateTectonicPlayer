export interface PlatePolygonProperties {
  PLATEID1: number
  FROMAGE: number
  TOAGE: number
  NAME: string
  DESCR: string
  PLATEID2: number
  FROMAGE2?: number
  TOAGE2?: number
  [key: string]: unknown
}

export interface PlatePolygonFeature {
  type: 'Feature'
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
  properties: PlatePolygonProperties
}

export interface PlatePolygonCollection {
  type: 'FeatureCollection'
  features: PlatePolygonFeature[]
}
