/**
 * Deterministic PLATEID1 → RGBA color mapping for tectonic plate visualization.
 * 24 perceptually distinct hues, evenly spaced in HSL, pre-computed as RGBA tuples.
 */

function hslToRgba(h: number, s: number, l: number): [number, number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) { r = c; g = x }
  else if (h < 120) { r = x; g = c }
  else if (h < 180) { g = c; b = x }
  else if (h < 240) { g = x; b = c }
  else if (h < 300) { r = x; b = c }
  else { r = c; b = x }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
    255,
  ]
}

const PLATE_PALETTE: [number, number, number, number][] = Array.from({ length: 24 }, (_, i) =>
  hslToRgba(i * 15, 0.6, 0.5),
)

export function getPlateColor(plateId: number): [number, number, number, number] {
  return PLATE_PALETTE[Math.abs(plateId) % PLATE_PALETTE.length]
}
