/*
  The shapes the TourShuttle API sends and accepts, mirroring the server's DTOs
  (TourShuttle.Application/DTOs). Dates arrive as ISO strings in UTC; convert only for display (lib/format).
*/

// ---------- Users and auth ----------
export type UserRole = 'Admin' | 'Customer' | 'Driver'

export interface User {
  id: number
  fullName: string
  email: string
  phone: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  expiresAt: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  phone: string
  password: string
}

// ---------- Catalog ----------
export interface Destination {
  id: number
  name: string
  description: string | null
  city: string
}

export interface PickupPoint {
  id: number
  name: string
  address: string
  city: string
}

// ---------- Tours ----------
export type TourStatus = 'Scheduled' | 'Cancelled'
export type TourDisplayStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled'
export type TourSortBy = 'Departure' | 'Price'
export type SortDirection = 'Asc' | 'Desc'

export interface TourSummary {
  id: number
  destinationId: number
  destinationName: string
  city: string
  departureAt: string
  returnAt: string
  price: number
  capacity: number
  availableSeats: number
  maxSeatsPerBooking: number
  status: TourStatus
  displayStatus: TourDisplayStatus
  driverName: string | null
  /** The cities the route passes through, in route order, each once. */
  cities: string[]
}

export interface TourStop {
  pickupPointId: number
  name: string
  address: string
  order: number
  estimatedPickupTimeUtc: string
}

export interface TourDetails extends TourSummary {
  destinationDescription: string | null
  /** Admins only. */
  driverId: number | null
  /** The interval the estimated times were computed with. */
  minutesBetweenPickupPoints: number
  /** The value stored on the tour; null when the departure-hour band decides. */
  customMinutesBetweenPickupPoints: number | null
  pickupPoints: TourStop[]
}

export interface TourQuery {
  destinationId?: number
  /** Tours with at least one stop in this city. */
  city?: string
  from?: string
  to?: string
  sortBy?: TourSortBy
  sortDirection?: SortDirection
  page?: number
  pageSize?: number
  includeCancelled?: boolean
}

export interface TourRequest {
  destinationId: number
  driverId: number | null
  departureAt: string
  returnAt: string
  capacity: number
  maxSeatsPerBooking: number
  price: number
  minutesBetweenPickupPoints: number | null
  pickupPointIds: number[]
}

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// ---------- Bookings ----------
export type BookingStatus = 'Active' | 'Cancelled'

export interface BookingRequest {
  pickupPointId: number
  seatsCount: number
}

export interface Booking {
  id: number
  tourId: number
  destinationName: string
  departureAt: string
  returnAt: string
  tourDisplayStatus: TourDisplayStatus
  pickupPointId: number
  pickupPointName: string
  pickupPointAddress: string
  estimatedPickupTimeUtc: string
  seatsCount: number
  totalPrice: number
  createdAt: string
  status: BookingStatus
}

// ---------- Driver ----------
export interface Passenger {
  bookingId: number
  fullName: string
  phone: string
  seatsCount: number
}

export interface StopPassengers {
  pickupPointId: number
  name: string
  address: string
  order: number
  estimatedPickupTimeUtc: string
  totalSeats: number
  passengers: Passenger[]
}

export interface TourPassengers {
  tourId: number
  destinationName: string
  departureAt: string
  totalSeats: number
  pickupPoints: StopPassengers[]
}
