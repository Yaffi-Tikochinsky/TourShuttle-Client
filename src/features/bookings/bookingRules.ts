import type { Booking } from '@/api/types'

/*
  The same rules the server applies, used here only to shape the UI (which buttons to show, which tab).
  The server still decides: a cancel the UI allows can still be refused, and that is handled as an error.
*/

/** Active, and the tour has not finished or been cancelled. */
export function isUpcoming(booking: Booking): boolean {
  return booking.status === 'Active' && (booking.tourDisplayStatus === 'Scheduled' || booking.tourDisplayStatus === 'InProgress')
}

/** A booking can be cancelled until the tour leaves. */
export function canCancel(booking: Booking): boolean {
  return booking.status === 'Active' && booking.tourDisplayStatus === 'Scheduled'
}

/** Upcoming soonest first; the history most recent first. */
export function splitBookings(bookings: Booking[]): { upcoming: Booking[]; history: Booking[] } {
  const byDeparture = (a: Booking, b: Booking) => Date.parse(a.departureAt) - Date.parse(b.departureAt)
  return {
    upcoming: bookings.filter(isUpcoming).sort(byDeparture),
    history: bookings.filter((b) => !isUpcoming(b)).sort((a, b) => byDeparture(b, a)),
  }
}
