import { http } from './client'
import type { Destination, PickupPoint, TourDetails, TourRequest, User, UserRole } from './types'

/** What the admin sends for a destination or a pickup point (PUT replaces every field). */
export interface DestinationRequest {
  name: string
  description: string | null
  city: string
}

export interface PickupPointRequest {
  name: string
  address: string
  city: string
}

/** The admin's write operations. Reads that everyone uses (tours, destinations) stay in tours.api. */
export const adminApi = {
  createTour: (request: TourRequest) => http.post<TourDetails>('/api/tours', request),
  updateTour: (id: number, request: TourRequest) => http.put<void>(`/api/tours/${id}`, request),
  deleteTour: (id: number) => http.delete(`/api/tours/${id}`),

  createDestination: (request: DestinationRequest) => http.post<Destination>('/api/destinations', request),
  updateDestination: (id: number, request: DestinationRequest) => http.put<void>(`/api/destinations/${id}`, request),
  deleteDestination: (id: number) => http.delete(`/api/destinations/${id}`),

  pickupPoints: (signal?: AbortSignal) => http.get<PickupPoint[]>('/api/pickup-points', { signal }),
  createPickupPoint: (request: PickupPointRequest) => http.post<PickupPoint>('/api/pickup-points', request),
  updatePickupPoint: (id: number, request: PickupPointRequest) => http.put<void>(`/api/pickup-points/${id}`, request),
  deletePickupPoint: (id: number) => http.delete(`/api/pickup-points/${id}`),

  users: (role?: UserRole, signal?: AbortSignal) => http.get<User[]>('/api/users', { query: { role }, signal }),
}
