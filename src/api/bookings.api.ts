import { http } from './client'
import type { Booking, BookingRequest } from './types'

export const bookingsApi = {
  /** Takes seats on a tour. 409 when the seats are gone or the customer already booked this tour. */
  create: (tourId: number, request: BookingRequest) => http.post<Booking>(`/api/tours/${tourId}/bookings`, request),
  /** The signed-in customer's bookings, active and cancelled. */
  mine: (signal?: AbortSignal) => http.get<Booking[]>('/api/users/me/bookings', { signal }),
  /** Cancels a booking and returns its seats to the tour. */
  cancel: (id: number) => http.delete(`/api/bookings/${id}`),
}
