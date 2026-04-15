import { getPeriod, MAJOR_EVENTS } from '../data/geologicalTimescale'

const MAX_AGE = 750

interface NowPanelProps {
  currentAge: number
}

export default function NowPanel({ currentAge }: NowPanelProps) {
  const period = getPeriod(currentAge)

  // Most recent major event at or before current age
  const lastEvent = [...MAJOR_EVENTS]
    .filter((e) => e.ageMa <= currentAge)
    .sort((a, b) => b.ageMa - a.ageMa)[0] ?? null

  // Progress within the current period (0 = start of period / old end, 1 = end / young end)
  const periodProgress = period
    ? 1 - (currentAge - period.endMa) / (period.startMa - period.endMa)
    : null

  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 280,
        background: 'rgba(6, 14, 30, 0.90)',
        backdropFilter: 'blur(10px)',
        borderRadius: 10,
        overflow: 'hidden',
        zIndex: 20,
        pointerEvents: 'none',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      {/* Period header band */}
      {period && (
        <div
          style={{
            background: period.color + '22',
            borderLeft: `4px solid ${period.color}`,
            padding: '12px 16px 10px',
          }}
        >
          <div style={{ color: period.color, fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>
            {period.name.toUpperCase()}
          </div>
          <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>
            {period.eon} · {period.startMa}–{Math.max(period.endMa, 0)} Ma
          </div>

          {/* Period progress bar */}
          {periodProgress !== null && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  height: 4,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.round(periodProgress * 100)}%`,
                    height: '100%',
                    background: period.color,
                    borderRadius: 2,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <span style={{ color: '#666', fontSize: 10, flexShrink: 0 }}>
                {Math.round(periodProgress * 100)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Last major event */}
      {lastEvent && (
        <div style={{ padding: '12px 16px 14px' }}>
          <div style={{ color: '#4a6', fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>
            {lastEvent.ageMa === currentAge ? 'Now' : 'Last milestone'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{ color: '#cde', fontSize: 13, fontWeight: 600 }}>{lastEvent.label}</span>
            {lastEvent.ageMa > 0 && (
              <span style={{ color: '#446', fontSize: 11 }}>{lastEvent.ageMa} Ma</span>
            )}
          </div>
          <p style={{ color: '#8a9aaa', fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
            {lastEvent.detail}
          </p>
        </div>
      )}

      {/* Overall position in Earth history */}
      <div
        style={{
          padding: '8px 16px 10px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 3,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${(currentAge / MAX_AGE) * 100}%`,
              height: '100%',
              background: 'rgba(74,158,255,0.6)',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <span style={{ color: '#445', fontSize: 10, flexShrink: 0 }}>
          {currentAge === 0 ? 'Present' : `${currentAge} Ma ago`}
        </span>
      </div>
    </div>
  )
}
