import { describe, expect, it } from 'vitest'
import { formatCities, formatRelativeDeparture, formatSeats, formatTime, greetingFor } from './format'

describe('formatTime', () => {
  it('shows Israel time, in winter and in summer', () => {
    // 07:00 UTC is 09:00 in January (UTC+2) and 10:00 in July (UTC+3).
    expect(formatTime('2026-01-15T07:00:00Z')).toBe('09:00')
    expect(formatTime('2026-07-15T07:00:00Z')).toBe('10:00')
  })
})

describe('formatRelativeDeparture', () => {
  // 21.10.2026 09:00 UTC = 12:00 in Israel
  const now = new Date('2026-10-21T09:00:00Z')

  it.each([
    ['2026-10-21T08:00:00Z', 'יצאה לדרך'],
    ['2026-10-21T09:30:00Z', 'בעוד 30 דקות'],
    ['2026-10-21T12:00:00Z', 'היום ב-15:00'],
    ['2026-10-22T06:00:00Z', 'מחר ב-09:00'],
    ['2026-10-24T07:00:00Z', 'בעוד 3 ימים'],
  ])('%s reads "%s"', (departure, text) => {
    expect(formatRelativeDeparture(departure, now)).toBe(text)
  })

  it('counts days by the Israeli calendar, not by 24-hour blocks', () => {
    // 22:30 Israel time tonight is still "today", even though it is 10.5 hours away.
    expect(formatRelativeDeparture('2026-10-21T19:30:00Z', now)).toBe('היום ב-22:30')
    // 00:30 Israel time is "tomorrow", even though it is only 12.5 hours away.
    expect(formatRelativeDeparture('2026-10-21T21:30:00Z', now)).toBe('מחר ב-00:30')
  })
})

describe('formatSeats and formatCities', () => {
  it('says seat counts in natural Hebrew', () => {
    expect(formatSeats(0)).toBe('אין מקומות')
    expect(formatSeats(1)).toBe('מקום אחד')
    expect(formatSeats(12)).toBe('12 מקומות')
  })

  it('joins route cities with a middle dot', () => {
    expect(formatCities(['בני ברק', 'רמת גן'])).toBe('בני ברק · רמת גן')
  })
})

describe('greetingFor', () => {
  it('greets by the hour in Israel, not the computer clock', () => {
    // 05:30 UTC in October is 08:30 in Israel (UTC+3).
    expect(greetingFor(new Date('2026-10-21T05:30:00Z'))).toBe('בוקר טוב')
    expect(greetingFor(new Date('2026-10-21T10:00:00Z'))).toBe('צהריים טובים')
    expect(greetingFor(new Date('2026-10-21T15:00:00Z'))).toBe('ערב טוב')
    expect(greetingFor(new Date('2026-10-21T22:00:00Z'))).toBe('לילה טוב')
  })
})
