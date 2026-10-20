import { http } from './client'
import type { Destination, PagedResult, TourDetails, TourQuery, TourSummary } from './types'

export const toursApi = {
  list: (query: TourQuery, signal?: AbortSignal) =>
    http.get<PagedResult<TourSummary>>('/api/tours', { query: { ...query }, signal }),
  get: (id: number, signal?: AbortSignal) => http.get<TourDetails>(`/api/tours/${id}`, { signal }),
}

export const destinationsApi = {
  list: (signal?: AbortSignal) => http.get<Destination[]>('/api/destinations', { signal }),
}

export const pickupPointsApi = {
  /** Public: the cities that have stops, for "where are you leaving from?". */
  cities: (signal?: AbortSignal) => http.get<string[]>('/api/pickup-points/cities', { signal }),
}
