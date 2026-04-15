const SPEEDS = [0.5, 1, 2, 5]

interface TimelineControlsProps {
  currentAge: number
  isPlaying: boolean
  playbackSpeed: number
  onPlay: () => void
  onPause: () => void
  onSetAge: (age: number) => void
  onSetSpeed: (speed: number) => void
}

export default function TimelineControls({
  currentAge,
  isPlaying,
  playbackSpeed,
  onPlay,
  onPause,
  onSetAge,
  onSetSpeed,
}: TimelineControlsProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        padding: '12px 24px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        zIndex: 10,
      }}
    >
      {/* Play/Pause button */}
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
        {isPlaying ? '⏸' : '▶'}
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
  )
}
