import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

export interface PlateProperties {
  PLATEID1?: number
  NAME?: string
  [key: string]: unknown
}

export type PlateFeature = Feature<MultiPolygon | Polygon, PlateProperties>

export type PlateFeatureCollection = FeatureCollection & {
  features: PlateFeature[]
}

export interface AnimationState {
  isPlaying: boolean
  currentAge: number
  speed: number
}

export const AGE_MIN = 0
export const AGE_MAX = 750
export const AGE_STEP = 5
