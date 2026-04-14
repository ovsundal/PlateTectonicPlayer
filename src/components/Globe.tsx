import DeckGL from '@deck.gl/react'
import { _GlobeView as GlobeView, GeoJsonLayer } from 'deck.gl'
import type { Layer } from 'deck.gl'
import type { PlateFeatureCollection } from '../types/plates'

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

export function Globe({ layers = [], initialViewState = DEFAULT_VIEW_STATE, data }: GlobeProps) {
  const plateLayer = data
    ? new GeoJsonLayer({
        id: 'plates',
        data,
        stroked: true,
        filled: false,
        getLineColor: [255, 200, 0, 200],
        lineWidthMinPixels: 1,
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
