interface AgeLabelProps {
  age: number
}

export default function AgeLabel({ age }: AgeLabelProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        fontSize: 36,
        fontWeight: 700,
        fontFamily: 'monospace',
        letterSpacing: 2,
        pointerEvents: 'none',
        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        zIndex: 10,
      }}
    >
      {age} Ma
    </div>
  )
}
