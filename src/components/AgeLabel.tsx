interface AgeLabelProps {
  currentAge: number
}

export function AgeLabel({ currentAge }: AgeLabelProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#f0c060',
        fontSize: '32px',
        fontWeight: 700,
        fontFamily: 'monospace',
        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
      }}
    >
      {Math.round(currentAge)} Ma
    </div>
  )
}
