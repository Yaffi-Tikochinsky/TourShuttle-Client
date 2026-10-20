import { describe, expect, it } from 'vitest'
import type { TourSummary } from '@/api/types'
import { groupByDay, relativeDayName } from './driverSchedule'

const tour = (id: number, departureAt: string) => ({ id, departureAt }) as TourSummary

describe('groupByDay', () => {
  it('groups by the Israel calendar day, soonest first', () => {
    const days = groupByDay([
      tour(3, '2026-10-22T06:00:00Z'),
      tour(1, '2026-10-21T05:00:00Z'),
      // 22:30 UTC on the 21st is 01:30 on the 22nd in Israel.
      tour(2, '2026-10-21T22:30:00Z'),
    ])

    expect(days.map((d) => d.key)).toEqual(['2026-10-21', '2026-10-22'])
    expect(days[1]?.tours.map((t) => t.id)).toEqual([2, 3])
  })
})

describe('relativeDayName', () => {
  const now = new Date('2026-10-21T09:00:00Z')

  it('names today and tomorrow, and leaves other days to the date', () => {
    expect(relativeDayName('2026-10-21', now)).toBe('היום')
    expect(relativeDayName('2026-10-22', now)).toBe('מחר')
    expect(relativeDayName('2026-10-25', now)).toBeNull()
  })
})
