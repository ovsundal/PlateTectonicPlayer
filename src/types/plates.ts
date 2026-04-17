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

export type BoundaryType =
  | 'MidOceanRidge'
  | 'SubductionZone'
  | 'Transform'
  | 'ContinentalRift'
  | 'Fault'
  | 'TerraneBoundary'
  | 'ExtendedContinentalCrust'
  | 'InferredPaleoBoundary'
  | 'UnclassifiedFeature'

export interface BoundaryFeatureProperties {
  type: BoundaryType
  name: string
  pid: number
  length: number
  polarity?: 'Right' | 'Left'
  [key: string]: unknown
}

export interface BoundaryFeature {
  type: 'Feature'
  geometry: {
    type: 'LineString'
    coordinates: number[][]
  }
  properties: BoundaryFeatureProperties
}

export interface BoundaryCollection {
  type: 'FeatureCollection'
  features: BoundaryFeature[]
}
