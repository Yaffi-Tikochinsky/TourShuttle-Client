import { describe, expect, it } from 'vitest'
import { israelInputToUtc, utcToIsraelInput } from './israelTime'

describe('israel time for datetime-local inputs', () => {
  it('reads the input as Israel time in summer (UTC+3) and winter (UTC+2)', () => {
    expect(israelInputToUtc('2026-07-01T09:00')).toBe('2026-07-01T06:00:00.000Z')
    expect(israelInputToUtc('2026-12-01T09:00')).toBe('2026-12-01T07:00:00.000Z')
  })

  it('shows a UTC time as the Israel wall clock', () => {
    expect(utcToIsraelInput('2026-10-23T06:00:00Z')).toBe('2026-10-23T09:00')
    expect(utcToIsraelInput('2026-12-01T22:30:00Z')).toBe('2026-12-02T00:30')
  })

  it('round-trips, and rejects what is not a date and time', () => {
    expect(utcToIsraelInput(israelInputToUtc('2026-10-25T07:15')!)).toBe('2026-10-25T07:15')
    expect(israelInputToUtc('')).toBeNull()
    expect(israelInputToUtc('tomorrow')).toBeNull()
  })
})
