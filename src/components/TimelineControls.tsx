import type { PlayDirection } from '../hooks/useAnimation'
import { MAJOR_EVENTS, PERIODS } from '../data/geologicalTimescale'

const MAX_AGE = 750

const SPEEDS = [0.5, 1, 2, 5]

interface TimelineControlsProps {
  currentAge: number
  isPlaying: boolean
  playbackSpeed: number
  direction: PlayDirection
  showCountries: boolean
  showGraticule: boolean
  onPlay: () => void
  onPause: () => void
  onSetAge: (age: number) => void
  onSetSpeed: (speed: number) => void
  onSetDirection: (dir: PlayDirection) => void
  onToggleGraticule: () => void
  onToggleCountries: () => void
  colorByPlate: boolean
  onToggleColorByPlate: () => void
}

export default function TimelineControls({
  currentAge,
  isPlaying,
  playbackSpeed,
  direction,
  showCountries,
  showGraticule,
  onPlay,
  onPause,
  onSetAge,
  onSetSpeed,
  onSetDirection,
  onToggleGraticule,
  onToggleCountries,
  colorByPlate,
  onToggleColorByPlate,
}: TimelineControlsProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(4px)',
        zIndex: 10,
      }}
    >
      {/* Major event snap buttons */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '8px 24px 0',
          flexWrap: 'wrap',
        }}
      >
        {MAJOR_EVENTS.map((ev) => {
          const active = currentAge === ev.ageMa
          return (
            <button
              key={ev.ageMa}
              onClick={() => onSetAge(ev.ageMa)}
              title={ev.description}
              style={{
                background: active ? 'rgba(74,158,255,0.35)' : 'rgba(255,255,255,0.07)',
                border: `1px solid ${active ? '#4a9eff' : 'rgba(255,255,255,0.18)'}`,
                borderRadius: 5,
                color: active ? '#4a9eff' : '#aaa',
                fontSize: 11,
                padding: '3px 9px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {ev.label}
              <span style={{ marginLeft: 5, opacity: 0.6, fontSize: 10 }}>{ev.ageMa} Ma</span>
            </button>
          )
        })}
      </div>

      {/* Geological period colour strip */}
      <div
        style={{
          display: 'flex',
          height: 8,
          margin: '6px 24px 0',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {PERIODS.map((p) => {
          const visibleStart = Math.min(p.endMa, MAX_AGE)
          const visibleEnd = Math.min(p.startMa, MAX_AGE)
          if (visibleEnd <= 0) return null
          const width = ((visibleEnd - visibleStart) / MAX_AGE) * 100
          return (
            <div
              key={p.name}
              title={`${p.name} (${p.startMa}–${p.endMa} Ma)`}
              style={{ width: `${width}%`, background: p.color, opacity: 0.75, flexShrink: 0 }}
            />
          )
        })}
        {/* Current position needle */}
        <div
          style={{
            position: 'absolute',
            left: `${(currentAge / MAX_AGE) * 100}%`,
            top: 0,
            bottom: 0,
            width: 2,
            background: '#fff',
            borderRadius: 1,
            transform: 'translateX(-50%)',
            transition: 'left 0.1s linear',
            boxShadow: '0 0 4px rgba(255,255,255,0.8)',
          }}
        />
      </div>

      {/* Main controls row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '10px 24px 14px',
        }}
      >
        {/* Direction toggle */}
        <button
          onClick={() => onSetDirection(direction === 'rev' ? 'fwd' : 'rev')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 6,
            color: '#ccc',
            fontSize: 11,
            padding: '4px 8px',
            cursor: 'pointer',
            flexShrink: 0,
            lineHeight: 1.3,
            textAlign: 'center',
          }}
          title="Toggle playback direction"
        >
          {direction === 'rev' ? '\u2192 Past' : '\u2192 Present'}
        </button>

        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 6,
            color: '#fff',
            fontSize: 18,
            width: 40,
            height: 40,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '\u23F8' : '\u25B6'}
        </button>

        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={750}
          step={5}
          value={currentAge}
          onChange={(e) => onSetAge(Number(e.target.value))}
          style={{
            flex: 1,
            accentColor: '#4a9eff',
            cursor: 'pointer',
            height: 4,
          }}
        />

        {/* Age readout */}
        <span
          style={{
            color: '#ccc',
            fontSize: 13,
            fontFamily: 'monospace',
            flexShrink: 0,
            minWidth: 60,
            textAlign: 'right',
          }}
        >
          {currentAge} Ma
        </span>

        {/* Grid toggle */}
        <button
          onClick={onToggleGraticule}
          style={{
            background: showGraticule ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${showGraticule ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 6,
            color: showGraticule ? '#eee' : '#666',
            fontSize: 11,
            padding: '4px 8px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="Toggle latitude/longitude grid"
        >
          Grid
        </button>

        {/* Countries ghost toggle */}
        <button
          onClick={onToggleCountries}
          style={{
            background: showCountries ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${showCountries ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 6,
            color: showCountries ? '#eee' : '#666',
            fontSize: 11,
            padding: '4px 8px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="Toggle modern country borders overlay"
        >
          Today's borders
        </button>

        {/* Plate coloring toggle */}
        <button
          onClick={onToggleColorByPlate}
          style={{
            background: colorByPlate ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${colorByPlate ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 6,
            color: colorByPlate ? '#eee' : '#666',
            fontSize: 11,
            padding: '4px 8px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          title="Toggle plate coloring by plate ID"
        >
          Plate colors
        </button>

        {/* Speed buttons */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              style={{
                background: playbackSpeed === s ? 'rgba(74,158,255,0.4)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${playbackSpeed === s ? '#4a9eff' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: 5,
                color: playbackSpeed === s ? '#4a9eff' : '#aaa',
                fontSize: 12,
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
