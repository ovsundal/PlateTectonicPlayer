import DeckGL from '@deck.gl/react';
import { GlobeView } from '@deck.gl/core';
import { GeoJsonLayer } from '@deck.gl/layers';

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 0,
};

const LAND_GEOJSON_URL =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.json';

const layers = [
  new GeoJsonLayer({
    id: 'land',
    data: LAND_GEOJSON_URL,
    filled: true,
    getFillColor: [70, 130, 60, 255],
  }),
];

export default function Globe() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <DeckGL
        views={new GlobeView()}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      />
    </div>
  );
}
