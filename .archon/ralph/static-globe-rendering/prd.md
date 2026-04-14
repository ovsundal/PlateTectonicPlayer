# Static Globe Rendering — Product Requirements

## Overview

**Problem**: The PlateTectonicPlayer app currently renders only a plain text placeholder (`<div>Plate Tectonic Player</div>`). Without a 3D globe, no plate tectonic visualization is possible — the app has no visual output at all.
**Solution**: Install deck.gl and render a full-screen 3D globe using `GlobeView` with a GeoJSON world basemap layer showing Earth's land masses against a dark space background.
**Branch**: `ralph/static-globe-rendering`

---

## Goals & Success

### Primary Goal
Open the browser and see a 3D interactive globe showing Earth's land masses — the visual foundation for all future plate tectonic overlays.

### Success Metrics
| Metric | Target | How Measured |
|--------|--------|--------------|
| Globe visible in browser | Yes | Visual inspection of dev server |
| Land masses rendered | Yes | GeoJsonLayer with world basemap visible |
| TypeScript errors | 0 | `npm run typecheck` exits with code 0 |
| Lint errors | 0 | `npm run lint` exits with code 0 |

### Non-Goals (Out of Scope)
- Plate tectonic data overlay — Phase 4 concern
- Animation or timeline scrubbing — Phase 4+ concern
- Camera controls beyond deck.gl defaults — future enhancement
- Custom basemap styling beyond land/ocean distinction — future enhancement

---

## User & Context

### Target User
- **Who**: Developer running the PlateTectonicPlayer locally
- **Role**: Building a geoscience visualization tool
- **Current Pain**: The app shows only a text placeholder; there is nothing to see or interact with

### User Journey
1. **Trigger**: Developer runs `npm run dev` and opens `localhost:5173`
2. **Action**: Browser loads the React app
3. **Outcome**: Full-screen 3D globe appears with visible land masses and dark background; user can orbit/zoom with mouse

---

## UX Requirements

### Interaction Model
- Globe occupies 100% of viewport width and height (no scrollbars, no margins)
- Dark space background (`#000010` or similar near-black)
- Land masses rendered in a distinct color (e.g. `[70, 130, 60]` green or similar earthy tone)
- Ocean surface distinguishable from land (deck.gl GlobeView renders ocean as globe background)
- Default view: centred at 0°N 0°E, zoom 0 (full globe visible)

### States to Handle
| State | Description | Behavior |
|-------|-------------|----------|
| Loading | GeoJSON basemap fetching | Globe sphere visible, land appears once data loads |
| Success | Basemap loaded | Full globe with green land masses |
| Error | GeoJSON fetch fails | Globe sphere renders without land layer (graceful degradation) |

---

## Technical Context

### Patterns to Follow
- **App entry**: `src/main.tsx` — StrictMode + createRoot pattern; no changes needed
- **App root**: `src/App.tsx:1-5` — minimal functional component, to be updated to render `<Globe />`
- **No existing component directory** — `src/components/` must be created

### Types & Interfaces
```typescript
// deck.gl core types (from @deck.gl/core)
import { GlobeView } from '@deck.gl/core';
// deck.gl React wrapper
import DeckGL from '@deck.gl/react';
// Layer types
import { GeoJsonLayer } from '@deck.gl/layers';

// Initial view state for GlobeView
interface GlobeViewState {
  longitude: number;  // 0
  latitude: number;   // 0
  zoom: number;       // 0
}
```

### Architecture Notes
- deck.gl requires a canvas element sized to the container; `DeckGL` component handles this internally
- `GlobeView` is in `@deck.gl/core` — requires explicit import (not in `@deck.gl/react`)
- World basemap GeoJSON: use Natural Earth 110m land polygons from public CDN (`https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_land.json`)
- Full-screen layout: set `margin: 0; padding: 0; overflow: hidden` on `html, body, #root` in a global CSS file or inline style on the wrapper div
- TypeScript strict mode is enabled (`tsconfig.app.json`); deck.gl ships its own type definitions — no `@types/` packages needed
- `skipLibCheck: true` is set, so deck.gl internal type quirks will not break compilation

### Integration Points
- `src/App.tsx` → import and render `<Globe />` full-screen
- `src/components/Globe.tsx` → new file, exports default React component
- `package.json` → new dependencies: `@deck.gl/core`, `@deck.gl/layers`, `@deck.gl/geo-layers`, `@deck.gl/react`

---

## Implementation Summary

### Story Overview
| ID | Title | Priority | Dependencies |
|----|-------|----------|--------------|
| US-001 | Install deck.gl dependencies | 1 | — |
| US-002 | Create Globe.tsx component | 2 | US-001 |
| US-003 | Wire Globe into App.tsx full-screen | 3 | US-002 |

### Dependency Graph
```
US-001 (install deps)
    ↓
US-002 (Globe.tsx component)
    ↓
US-003 (App.tsx integration + typecheck)
```

---

## Validation Requirements

Every story must pass:
- [ ] Type-check: `npm run typecheck`
- [ ] Lint: `npm run lint`
- [ ] Dev server renders globe visually: `npm run dev`

---

*Generated: 2026-04-14T00:00:00Z*
