import { useState, useCallback } from 'react'
import type * as GeoJSON from 'geojson'
import DeckGL from '@deck.gl/react'
import { _GlobeView as GlobeView } from '@deck.gl/core'
import { GeoJsonLayer } from '@deck.gl/layers'
import type { ViewStateChangeParameters } from '@deck.gl/core'
import { usePlateData } from '../hooks/usePlateData'
import { useBoundaryData } from '../hooks/useBoundaryData'
import { buildGraticule } from '../utils/buildGraticule'

const COUNTRIES_URL = '/data/ne_countries_110m.geojson'

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

const CLIMATE_BANDS_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-180,66.5],[180,66.5],[180,90],[-180,90],[-180,66.5]]] }, properties: { zone: 'polar' } },
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-180,23.5],[180,23.5],[180,66.5],[-180,66.5],[-180,23.5]]] }, properties: { zone: 'temperate' } },
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-180,-23.5],[180,-23.5],[180,23.5],[-180,23.5],[-180,-23.5]]] }, properties: { zone: 'tropical' } },
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-180,-66.5],[180,-66.5],[180,-23.5],[-180,-23.5],[-180,-66.5]]] }, properties: { zone: 'temperate' } },
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[-180,-90],[180,-90],[180,-66.5],[-180,-66.5],[-180,-90]]] }, properties: { zone: 'polar' } },
  ],
}

interface GlobeProps {
  currentAge: number
  showCountries: boolean
  showGraticule: boolean
  showClimateBands: boolean
  showBoundaries: boolean
}

export default function Globe({ currentAge, showCountries, showGraticule, showClimateBands, showBoundaries }: GlobeProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE)
  const { data: plateData, loading, error } = usePlateData(currentAge)
  const { data: boundaryData, loading: boundaryLoading, error: boundaryError } = useBoundaryData(currentAge)

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
    // 2. Climate bands (behind coastlines)
    ...(showClimateBands
      ? [
          new GeoJsonLayer({
            id: 'climate-bands',
            data: CLIMATE_BANDS_GEOJSON,
            stroked: false,
            filled: true,
            getFillColor: (f: GeoJSON.Feature) => {
              const zone = (f.properties as { zone: string }).zone
              if (zone === 'tropical') return [255, 100, 50, 35]
              if (zone === 'temperate') return [100, 200, 100, 25]
              return [200, 220, 255, 30]
            },
          }),
        ]
      : []),
    // 3. Coastlines
    ...(plateData
      ? [
          new GeoJsonLayer({
            id: 'coastlines',
            data: plateData as unknown as GeoJSON.FeatureCollection,
            stroked: true,
            filled: true,
            getFillColor: [139, 115, 85, 255],
            getLineColor: [180, 150, 100, 255],
            lineWidthMinPixels: 1,
          }),
        ]
      : []),
    // 4. Plate boundaries (on top of land)
    ...(showBoundaries && boundaryData
      ? [
          new GeoJsonLayer({
            id: 'boundaries',
            data: boundaryData as unknown as GeoJSON.FeatureCollection,
            stroked: true,
            filled: false,
            getLineColor: (f: GeoJSON.Feature) => {
              const btype = (f.properties as { type: string }).type
              if (btype === 'MidOceanRidge') return [255, 80, 60, 200]
              if (btype === 'SubductionZone') return [60, 120, 255, 200]
              if (btype === 'Transform') return [160, 160, 160, 180]
              return [120, 120, 120, 100]
            },
            lineWidthMinPixels: 1.5,
          }),
        ]
      : []),
    // 5. Graticule grid overlay
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
    // 6. Countries ghost (optional)
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
      {showBoundaries && boundaryLoading && (
        <div
          style={{
            position: 'absolute',
            top: 102,
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
          Loading plate boundaries…
        </div>
      )}
      {showBoundaries && boundaryError && (
        <div
          style={{
            position: 'absolute',
            top: 102,
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
          Boundary error: {boundaryError}
        </div>
      )}
    </>
  )
}
