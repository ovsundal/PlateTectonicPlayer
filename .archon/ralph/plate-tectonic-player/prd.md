# Plate Tectonic Player — Product Requirements

## Overview

**Problem**: No simple, browser-based tool lets a user watch Earth's tectonic plates drift across geological time with minimal friction. GPlates (desktop) and academic tooling are powerful but not browser-native or zero-install.
**Solution**: A standalone static web app (Vite + React + TypeScript + deck.gl GlobeView) that animates Muller paleogeographic plate polygon data across 0–750 Ma on a 3D globe, driven by a single Play button and a timeline scrubber.
**Branch**: `ralph/plate-tectonic-player`

---

## Goals & Success

### Primary Goal
User can click Play and watch 750 million years of continental drift on a 3D globe in a desktop browser — no install required.

### Success Metrics
| Metric | Target | How Measured |
|--------|--------|--------------|
| Animation smoothness | No visible frame drops | Visual inspection on modern desktop browser |
| Data coverage | 0–750 Ma continuous | Scrubber traverses full range |
| Time to "wow" | Play within 5 seconds of page load | Manual timing |
| Initial load time | < 5 seconds on fast connection | DevTools Network tab |
| Scientific fidelity | Recognizable Pangaea (~250 Ma), Gondwana (~500 Ma) | Visual comparison to reference maps |

### Non-Goals (Out of Scope)
- Mobile support — desktop-only reduces scope significantly
- User accounts / authentication — single-user hobby tool
- Backend API or server-side rendering — static file serving is sufficient
- Real-time external data fetching — all data self-hosted
- Multi-dataset support — Muller only for MVP
- Stratigraphic or fossil overlay layers — potential future addition
- 100% scientific accuracy — visual polish valued alongside accuracy

---

## User & Context

### Target User
- **Who**: The author (geoscience major / hobbyist developer), and curious visitors
- **Role**: Personal leisure exploration of Earth's deep history
- **Current Pain**: No equivalent browser tool combines scientific fidelity with a polished, zero-install experience

### User Journey
1. **Trigger**: User opens the static site URL in a desktop browser
2. **Action**: Clicks the Play button; optionally drags the timeline scrubber to a specific age
3. **Outcome**: Continents animate smoothly across geological time on a 3D globe; current age (Ma) is displayed

---

## UX Requirements

### Interaction Model
Single-page app. Controls overlay at the bottom of the full-screen globe:
- **Play / Pause** toggle button
- **Timeline scrubber** (range input, 0–750 Ma)
- **Age label** displaying current Ma (e.g., "250 Ma")
- **Speed control** (optional, "Should" priority)

### States to Handle
| State | Description | Behavior |
|-------|-------------|----------|
| Initial | Page loaded, no data yet | Globe renders; controls show loading indicator |
| Loading | Fetching GeoJSON for current timestep | Spinner or opacity change on polygon layer |
| Playing | Animation advancing automatically | Play button shows Pause icon; scrubber advances |
| Paused | User paused or scrubbed | Play button shows Play icon; scrubber at current age |
| Error | GeoJSON fetch fails | Console error; skip frame; no crash |

### MoSCoW Priority
| Priority | Feature |
|----------|---------|
| **Must** | 3D globe rendering in browser |
| **Must** | Play / Pause button |
| **Must** | Smooth animation across geological time |
| **Must** | Muller dataset loaded as self-hosted static files |
| **Must** | TypeScript codebase |
| **Must** | Standalone static site (no backend) |
| **Should** | Timeline scrubber (drag to a specific age) |
| **Should** | Current age label displayed (e.g., "250 Ma") |
| **Should** | Playback speed control |
| **Could** | Color-coded plates |
| **Could** | Present-day coastlines overlay for reference |
| **Could** | Camera auto-rotation while playing |
| **Won't** | Mobile layout |
| **Won't** | User accounts |
| **Won't** | Backend API |
| **Won't** | Additional datasets beyond Muller |

---

## Technical Context

### Resolved Design Decisions
- **Globe library**: deck.gl `GlobeView` — React-friendly, lighter than CesiumJS, native GeoJSON polygon support via `GeoJsonLayer`
- **Data format**: One GeoJSON file per timestep, named `plates_{N}Ma.geojson` (e.g., `plates_0Ma.geojson` … `plates_750Ma.geojson`), at 5 Ma resolution (~150 files)
- **Animation**: `requestAnimationFrame`-based loop in `useAnimation.ts` — not `setInterval`, for frame-rate-aware playback
- **Prefetching**: `usePlateData.ts` prefetches adjacent timesteps during playback to avoid stuttering
- **Interpolation**: Linear between snapshots for MVP; morphing is out of scope

### Patterns to Follow
All files are to be created (project directory is empty, confirmed 2026-04-14). Patterns follow standard Vite + React + TypeScript + deck.gl conventions:
- **deck.gl GlobeView pattern**: `DeckGL` component with `views={[new GlobeView()]}` + `GeoJsonLayer` for polygon rendering
- **Animation loop**: `useRef` for rAF handle + `useState` for `isPlaying` / `currentAge` — advance age in rAF callback
- **Data hook**: `useCallback` + `fetch` + `Map<number, GeoJSON.FeatureCollection>` cache for loaded timesteps
- **Component structure**: Thin presentational components wired by `App.tsx`; logic lives in hooks

### Types & Interfaces
```typescript
// src/types/plates.ts (to be created)
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export interface PlateProperties {
  PLATEID1?: number;
  NAME?: string;
  [key: string]: unknown;
}

export type PlateFeature = Feature<MultiPolygon | Polygon, PlateProperties>;

export type PlateFeatureCollection = FeatureCollection & {
  features: PlateFeature[];
};

export interface AnimationState {
  isPlaying: boolean;
  currentAge: number;   // Ma — 0 (present) to 750 (oldest)
  speed: number;        // Ma per second of real time
}

export const AGE_MIN = 0;
export const AGE_MAX = 750;
export const AGE_STEP = 5;  // Ma between GeoJSON snapshots
```

### Proposed Directory Structure (all files to be created)
```
PlateTectonicPlayer/
├── public/
│   └── data/
│       └── muller/           # plates_0Ma.geojson … plates_750Ma.geojson
├── src/
│   ├── main.tsx              # Vite entry point
│   ├── App.tsx               # Root component — wires hooks to components
│   ├── components/
│   │   ├── Globe.tsx         # DeckGL + GlobeView + GeoJsonLayer
│   │   ├── TimelineControls.tsx  # Play/pause button + range scrubber
│   │   └── AgeLabel.tsx     # Current age display ("250 Ma")
│   ├── hooks/
│   │   ├── useAnimation.ts   # rAF animation loop, play/pause, currentAge
│   │   └── usePlateData.ts   # fetch + Map cache + prefetch
│   └── types/
│       └── plates.ts         # PlateFeature, AnimationState, constants
├── scripts/
│   └── preprocess_muller.py  # One-time Python/GDAL pipeline (not runtime)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### Architecture Notes
- deck.gl peer deps: `deck.gl`, `@deck.gl/react`, `react`, `react-dom`
- `@types/geojson` needed for GeoJSON type definitions
- `vite build` produces static `dist/` — deployable to GitHub Pages / Netlify with zero server
- Python pipeline (`preprocess_muller.py`) uses `geopandas` + `fiona`; output is `public/data/muller/`

---

## Implementation Summary

### Story Overview
| ID | Title | Priority | Dependencies |
|----|-------|----------|--------------|
| US-001 | Scaffold Vite + React + TypeScript project | 1 | — |
| US-002 | Add deck.gl and render static GlobeView | 2 | US-001 |
| US-003 | Create preprocess_muller.py data pipeline | 3 | — |
| US-004 | Define TypeScript types for plate data | 4 | US-001 |
| US-005 | Implement usePlateData hook (fetch + cache) | 5 | US-004 |
| US-006 | Render GeoJsonLayer plate polygons on globe | 6 | US-002, US-005 |
| US-007 | Implement useAnimation hook (rAF play/pause) | 7 | US-004 |
| US-008 | Create TimelineControls component | 8 | US-007 |
| US-009 | Wire App.tsx — connect animation, data, globe, controls | 9 | US-006, US-008 |
| US-010 | Polish — color-coded plates, AgeLabel, speed control | 10 | US-009 |

### Dependency Graph
```
US-001 (scaffold)
    ├── US-002 (static globe — deck.gl GlobeView)
    └── US-004 (TypeScript types)
            ├── US-005 (usePlateData hook)
            │       └── US-006 (GeoJsonLayer on globe) ← needs US-002
            └── US-007 (useAnimation hook)
                    └── US-008 (TimelineControls)
                            └── US-009 (App.tsx wiring) ← needs US-006
                                    └── US-010 (polish)

US-003 (Python pipeline) — independent, no JS deps
```

---

## Validation Requirements

Every story must pass:
- [ ] Type-check: `npx tsc --noEmit`
- [ ] Lint: `npx eslint src`
- [ ] Dev server starts: `npx vite` (no console errors)
- [ ] Build succeeds: `npx vite build`

---

*Generated: 2026-04-14T00:00:00Z*
