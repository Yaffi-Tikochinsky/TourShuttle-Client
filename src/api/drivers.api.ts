import { http } from './client'
import type { TourPassengers, TourSummary } from './types'

export const driversApi = {
  /** The signed-in driver's tours that have not returned yet, soonest first. */
  myTours: (signal?: AbortSignal) => http.get<TourSummary[]>('/api/drivers/me/tours', { signal }),
  /** Who gets on where: the tour's driver or an admin. */
  passengers: (tourId: number, signal?: AbortSignal) => http.get<TourPassengers>(`/api/tours/${tourId}/passengers`, { signal }),
}
