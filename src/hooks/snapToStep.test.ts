import { describe, it, expect } from 'vitest'
import { snapToStep } from './useBoundaryData'

describe('snapToStep', () => {
  it('snaps exact multiples of 5 unchanged', () => {
    expect(snapToStep(0)).toBe(0)
    expect(snapToStep(5)).toBe(5)
    expect(snapToStep(100)).toBe(100)
    expect(snapToStep(750)).toBe(750)
  })

  it('rounds to the nearest step', () => {
    expect(snapToStep(3)).toBe(5)
    expect(snapToStep(2)).toBe(0)
    expect(snapToStep(7)).toBe(5)
    expect(snapToStep(8)).toBe(10)
  })

  it('handles custom step sizes', () => {
    expect(snapToStep(7, 10)).toBe(10)
    expect(snapToStep(3, 10)).toBe(0)
    expect(snapToStep(15, 10)).toBe(20)
  })

  it('handles edge case of 2.5 (rounds up)', () => {
    expect(snapToStep(2.5)).toBe(5)
  })
})
