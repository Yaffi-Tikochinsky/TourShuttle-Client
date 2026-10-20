import { describe, expect, it } from 'vitest'
import type { Booking } from '@/api/types'
import { bookingFlowReducer as reduce, initialBookingFlow as initial } from './bookingFlow'

describe('bookingFlowReducer', () => {
  it('keeps the seat count between one and the limit', () => {
    expect(reduce(initial, { type: 'setSeats', seats: 9, max: 4 }).seats).toBe(4)
    expect(reduce(initial, { type: 'setSeats', seats: 0, max: 4 }).seats).toBe(1)
    expect(reduce(initial, { type: 'setSeats', seats: 3, max: 4 }).seats).toBe(3)
  })

  it('does not move to the confirmation without a pickup stop', () => {
    expect(reduce(initial, { type: 'review' }).step).toBe('choose')

    const withStop = reduce(initial, { type: 'selectStop', pickupPointId: 7 })
    expect(reduce(withStop, { type: 'review' }).step).toBe('confirm')
  })

  it('offers the seats that are left when others took some first', () => {
    const confirming = { ...initial, step: 'confirm' as const, pickupPointId: 7, seats: 5 }

    const next = reduce(confirming, { type: 'seatsTaken', requested: 5, available: 2 })

    expect(next.step).toBe('confirm')
    expect(next.seats).toBe(2)
    expect(next.notice).toEqual({ requested: 5, available: 2 })
  })

  it('goes back to the start when no seats are left at all', () => {
    const confirming = { ...initial, step: 'confirm' as const, pickupPointId: 7, seats: 2 }

    expect(reduce(confirming, { type: 'seatsTaken', requested: 2, available: 0 }).step).toBe('choose')
  })

  it('clears the notice once the customer changes the count or books', () => {
    const noticed = { ...initial, step: 'confirm' as const, pickupPointId: 7, notice: { requested: 4, available: 3 } }

    expect(reduce(noticed, { type: 'setSeats', seats: 2, max: 3 }).notice).toBeNull()
    const done = reduce(noticed, { type: 'booked', booking: { id: 1 } as Booking })
    expect(done.step).toBe('done')
    expect(done.notice).toBeNull()
  })
})
