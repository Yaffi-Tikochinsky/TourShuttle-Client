import type { TourSummary } from '@/api/types'
import { israelDateKey } from '@/lib/format'

export interface ScheduleDay {
  /** "2026-10-21", the Israel calendar day. */
  key: string
  tours: TourSummary[]
}

/** The driver's tours grouped by Israel calendar day, in departure order (a tour after midnight UTC still counts by Israel time). */
export function groupByDay(tours: TourSummary[]): ScheduleDay[] {
  const sorted = [...tours].sort((a, b) => Date.parse(a.departureAt) - Date.parse(b.departureAt))
  const days: ScheduleDay[] = []
  for (const tour of sorted) {
    const key = israelDateKey(new Date(tour.departureAt))
    const last = days.at(-1)
    if (last?.key === key) last.tours.push(tour)
    else days.push({ key, tours: [tour] })
  }
  return days
}

/** "היום", "מחר", or null for any other day (the caller then shows the date). */
export function relativeDayName(key: string, now: Date): string | null {
  if (key === israelDateKey(now)) return 'היום'
  if (key === israelDateKey(new Date(now.getTime() + 86_400_000))) return 'מחר'
  return null
}

/** Seats taken on the tour: what the driver actually carries. */
export const seatsTaken = (tour: TourSummary) => tour.capacity - tour.availableSeats
