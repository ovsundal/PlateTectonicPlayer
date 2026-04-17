/**
 * Deterministic feature-index → RGBA color mapping for tectonic plate visualization.
 * Uses a curated palette of 12 distinct earth-tone and muted colors that look good
 * on a dark ocean background. Each polygon gets a color by index modulo palette size.
 */

export const PLATE_PALETTE: [number, number, number, number][] = [
  [180, 140, 100, 255],  // tan
  [120, 160, 90, 255],   // olive green
  [200, 120, 80, 255],   // terracotta
  [100, 150, 160, 255],  // teal
  [190, 170, 110, 255],  // khaki
  [150, 100, 130, 255],  // mauve
  [160, 180, 120, 255],  // sage
  [210, 150, 120, 255],  // peach
  [130, 130, 170, 255],  // lavender
  [170, 130, 80, 255],   // bronze
  [110, 170, 140, 255],  // seafoam
  [190, 110, 110, 255],  // dusty rose
]

export const PLATE_PALETTE_NAMES: string[] = [
  'Tan',
  'Olive',
  'Terracotta',
  'Teal',
  'Khaki',
  'Mauve',
  'Sage',
  'Peach',
  'Lavender',
  'Bronze',
  'Seafoam',
  'Rose',
]

export function getPlateColor(featureIndex: number): [number, number, number, number] {
  return PLATE_PALETTE[Math.abs(featureIndex) % PLATE_PALETTE.length]
}
