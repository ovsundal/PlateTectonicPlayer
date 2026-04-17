import { useState, useCallback } from 'react'
import type * as GeoJSON from 'geojson'
import DeckGL from '@deck.gl/react'
import { _GlobeView as GlobeView } from '@deck.gl/core'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { ViewStateChangeParameters } from '@deck.gl/core'
import { usePlateData } from '../hooks/usePlateData'
import { buildGraticule } from '../utils/buildGraticule'
import { getPlateColor } from '../utils/plateColors'

const COUNTRIES_URL = `${import.meta.env.BASE_URL}data/ne_countries_110m.geojson`

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 0,
}

// Full-globe polygon rendered as the ocean base layer
const OCEAN_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
      },
      properties: {},
    },
  ],
}

// Graticule GeoJSON computed once at module level (30-degree grid)
const GRATICULE_GEOJSON = buildGraticule()

interface GlobeProps {
  currentAge: number
  showCountries: boolean
  showGraticule: boolean
  colorByPlate: boolean
}

export default function Globe({ currentAge, showCountries, showGraticule, colorByPlate }: GlobeProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const { data: plateData, loading, error } = usePlateData(currentAge)

  const onViewStateChange = useCallback(({ viewState: vs }: ViewStateChangeParameters) => {
    setViewState(vs as typeof INITIAL_VIEW_STATE)
  }, [])

  const layers = [
    // 1. Ocean base
    new GeoJsonLayer({
      id: 'ocean',
      data: OCEAN_GEOJSON,
      stroked: false,
      filled: true,
      getFillColor: [10, 40, 90, 255],
    }),
    // 2. Coastlines
    ...(plateData
      ? [
          new GeoJsonLayer({
            id: 'coastlines',
            data: plateData as unknown as GeoJSON.FeatureCollection,
            stroked: true,
            filled: true,
            getFillColor: colorByPlate
              ? (_f: GeoJSON.Feature, { index }: { index: number }) => getPlateColor(index)
              : [139, 115, 85, 255],
            getLineColor: [180, 150, 100, 255],
            lineWidthMinPixels: 1,
            updateTriggers: { getFillColor: colorByPlate },
          }),
        ]
      : []),
    // 3. Graticule grid overlay
    ...(showGraticule
      ? [
          new GeoJsonLayer({
            id: 'graticule',
            data: GRATICULE_GEOJSON,
            stroked: true,
            filled: false,
            getLineColor: [255, 255, 255, 40],
            lineWidthMinPixels: 0.5,
          }),
        ]
      : []),
    // 4. Countries ghost (optional)
    ...(showCountries
      ? [
          new GeoJsonLayer({
            id: 'countries-ghost',
            data: COUNTRIES_URL,
            stroked: true,
            filled: false,
            getLineColor: [255, 255, 255, 55],
            lineWidthMinPixels: 0.5,
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
