import DeckGL from '@deck.gl/react'
import { _GlobeView as GlobeView, GeoJsonLayer } from 'deck.gl'
import type { Layer } from 'deck.gl'
import type { PlateFeatureCollection, PlateFeature } from '../types/plates'

interface GlobeViewState {
  longitude: number
  latitude: number
  zoom: number
}

interface GlobeProps {
  layers?: Layer[]
  initialViewState?: GlobeViewState
  data?: PlateFeatureCollection | null
}

const DEFAULT_VIEW_STATE: GlobeViewState = {
  longitude: 0,
  latitude: 20,
  zoom: 1,
}

function hashColor(id: number): [number, number, number, number] {
  const hash = (id * 2654435761) & 0xffffff
  return [(hash >> 16) & 0xff, (hash >> 8) & 0xff, hash & 0xff, 80]
}

export function Globe({ layers = [], initialViewState = DEFAULT_VIEW_STATE, data }: GlobeProps) {
  const plateLayer = data
    ? new GeoJsonLayer<PlateFeature>({
        id: 'plates',
        data: data as unknown as PlateFeature[],
        stroked: true,
        filled: true,
        getLineColor: [255, 200, 0, 200],
        lineWidthMinPixels: 1,
        getFillColor: (f: PlateFeature) => hashColor(f.properties?.PLATEID1 ?? 0),
      })
    : null

  const allLayers = [...(plateLayer ? [plateLayer] : []), ...layers]

  return (
    <DeckGL
      views={[new GlobeView()]}
      initialViewState={initialViewState}
      controller={true}
      layers={allLayers}
      style={{ width: '100%', height: '100%', background: '#1a2744' }}
    />
  )
}
