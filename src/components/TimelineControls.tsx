interface TimelineControlsProps {
  isPlaying: boolean
  currentAge: number
  onPlay: () => void
  onPause: () => void
  onSeek: (age: number) => void
}

export function TimelineControls({
  isPlaying,
  currentAge,
  onPlay,
  onPause,
  onSeek,
}: TimelineControlsProps) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        background: 'rgba(10, 20, 40, 0.85)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        color: '#fff',
      }}
    >
      <button
        onClick={isPlaying ? onPause : onPlay}
        style={{
          padding: '8px 20px',
          background: '#2a6fd4',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          minWidth: '70px',
        }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <input
        type="range"
        min={0}
        max={750}
        step={5}
        value={Math.round(currentAge)}
        onChange={(e) => onSeek(Number(e.target.value))}
        style={{ flex: 1, cursor: 'pointer' }}
      />

      <span
        style={{
          fontSize: '18px',
          fontWeight: 700,
          minWidth: '80px',
          textAlign: 'right',
          color: '#f0c060',
        }}
      >
        {Math.round(currentAge)} Ma
      </span>
    </div>
  )
}
