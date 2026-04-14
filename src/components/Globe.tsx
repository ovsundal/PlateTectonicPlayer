import DeckGL from '@deck.gl/react'
import { GlobeView } from 'deck.gl'
import type { Layer } from 'deck.gl'

interface GlobeViewState {
  longitude: number
  latitude: number
  zoom: number
}

interface GlobeProps {
  layers?: Layer[]
  initialViewState?: GlobeViewState
}

const DEFAULT_VIEW_STATE: GlobeViewState = {
  longitude: 0,
  latitude: 20,
  zoom: 1,
}

export function Globe({ layers = [], initialViewState = DEFAULT_VIEW_STATE }: GlobeProps) {
  return (
    <DeckGL
      views={[new GlobeView()]}
      initialViewState={initialViewState}
      controller={true}
      layers={layers}
      style={{ width: '100%', height: '100%', background: '#1a2744' }}
    />
  )
}
