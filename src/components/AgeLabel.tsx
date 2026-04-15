import { getPeriod } from '../data/geologicalTimescale'

interface AgeLabelProps {
  age: number
}

export default function AgeLabel({ age }: AgeLabelProps) {
  const period = getPeriod(age)

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div
        style={{
          color: '#ffffff',
          fontSize: 36,
          fontWeight: 700,
          fontFamily: 'monospace',
          letterSpacing: 2,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}
      >
        {age === 0 ? 'Present' : `${age} Ma`}
      </div>

      {period && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0,0,0,0.55)',
            borderRadius: 6,
            padding: '4px 12px',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: period.color,
              flexShrink: 0,
              boxShadow: `0 0 6px ${period.color}`,
            }}
          />
          <span style={{ color: period.color, fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>
            {period.name}
          </span>
          <span style={{ color: '#888', fontSize: 12 }}>
            {period.eon}
          </span>
        </div>
      )}
    </div>
  )
}
