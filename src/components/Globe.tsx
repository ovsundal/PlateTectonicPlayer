import { useState, useCallback } from 'react'
import type * as GeoJSON from 'geojson'
import DeckGL from '@deck.gl/react'
import { _GlobeView as GlobeView } from '@deck.gl/core'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { ViewStateChangeParameters } from '@deck.gl/core'
import { usePlateData } from '../hooks/usePlateData'

const COUNTRIES_GEOJSON_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 0,
}

interface GlobeProps {
  currentAge: number
}

export default function Globe({ currentAge }: GlobeProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const { data: plateData, loading, error } = usePlateData(currentAge)

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
    ...(plateData
      ? [
          new GeoJsonLayer({
            id: 'plate-polygons',
            data: plateData as unknown as GeoJSON.FeatureCollection,
            stroked: true,
            filled: true,
            getFillColor: [50, 100, 200, 100],
            getLineColor: [80, 160, 255, 220],
            lineWidthMinPixels: 1,
          }),
        ]
      : []),
  ]

  return (
    <>
      <DeckGL
        views={new GlobeView()}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={true}
        layers={layers}
        style={{ background: '#000000' }}
      />
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 72,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            background: 'rgba(0,0,0,0.6)',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 13,
            pointerEvents: 'none',
          }}
        >
          Loading plate polygons…
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: 72,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#f88',
            background: 'rgba(0,0,0,0.7)',
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 13,
            pointerEvents: 'none',
          }}
        >
          Error: {error}
        </div>
      )}
    </>
  )
}
