import { useState, useCallback } from 'react'
import DeckGL from '@deck.gl/react'
import { GlobeView } from '@deck.gl/core'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { ViewStateChangeParameters } from '@deck.gl/core'

const COUNTRIES_GEOJSON_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 0,
}

export default function Globe() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)

  const onViewStateChange = useCallback(({ viewState: vs }: ViewStateChangeParameters) => {
    setViewState(vs as typeof INITIAL_VIEW_STATE)
  }, [])

  const layers = [
    new GeoJsonLayer({
      id: 'countries',
      data: COUNTRIES_GEOJSON_URL,
      stroked: true,
      filled: true,
      getFillColor: [30, 80, 40],
      getLineColor: [100, 180, 80],
      lineWidthMinPixels: 0.5,
    }),
  ]

  return (
    <DeckGL
      views={new GlobeView()}
      viewState={viewState}
      onViewStateChange={onViewStateChange}
      controller={true}
      layers={layers}
      style={{ background: '#000000' }}
    />
  )
}
