import { REGION_LEGEND } from '../utils/plateColors'

export default function PlateLegend({ visible }: { visible: boolean }) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 72,
        right: 16,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        borderRadius: 8,
        padding: '10px 14px',
        color: '#ccc',
        fontSize: 11,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 12, color: '#eee' }}>
        Regions
      </div>
      {REGION_LEGEND.map(({ name, color }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})`,
              flexShrink: 0,
            }}
          />
          <span>{name}</span>
        </div>
      ))}
    </div>
  )
}
