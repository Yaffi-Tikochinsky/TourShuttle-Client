import { describe, expect, it } from 'vitest'
import type { TourRequest } from '@/api/types'
import { validatePickupPoint, validateTour } from './adminValidation'

const now = new Date('2026-10-21T09:00:00Z')

const tour = (overrides: Partial<TourRequest> = {}): TourRequest => ({
  destinationId: 1,
  driverId: null,
  departureAt: '2026-10-23T06:00:00.000Z',
  returnAt: '2026-10-23T10:00:00.000Z',
  capacity: 40,
  maxSeatsPerBooking: 6,
  price: 45,
  minutesBetweenPickupPoints: null,
  pickupPointIds: [3, 4],
  ...overrides,
})

describe('validateTour', () => {
  it('accepts a complete tour, with or without custom minutes', () => {
    expect(validateTour(tour(), now)).toEqual({})
    expect(validateTour(tour({ minutesBetweenPickupPoints: 5 }), now)).toEqual({})
  })

  it('asks for a future departure and a return after it', () => {
    expect(validateTour(tour({ departureAt: '2026-10-20T06:00:00.000Z' }), now).departureAt).toBe('שעת היציאה צריכה להיות בעתיד')
    expect(validateTour(tour({ returnAt: '2026-10-23T05:00:00.000Z' }), now).returnAt).toBe('שעת החזרה צריכה להיות אחרי היציאה')
  })

  it('keeps the server ranges for seats, minutes and the route', () => {
    const errors = validateTour(tour({ capacity: 0, minutesBetweenPickupPoints: 31, pickupPointIds: [] }), now)

    expect(errors.capacity).toBeDefined()
    expect(errors.minutesBetweenPickupPoints).toBe('בין 1 ל-30 דקות, או ריק')
    expect(errors.pickupPointIds).toBe('יש להוסיף לפחות תחנה אחת')
  })

  it('does not allow more seats per booking than the tour has', () => {
    expect(validateTour(tour({ capacity: 4, maxSeatsPerBooking: 6 }), now).maxSeatsPerBooking).toBe('לא יותר ממספר המקומות בהסעה')
  })
})

describe('validatePickupPoint', () => {
  it('requires a city, since customers search by it', () => {
    expect(validatePickupPoint({ name: 'רמת גן - הבורסה', address: "ז'בוטינסקי 7", city: ' ' }).city).toBeDefined()
  })
})
