import type { Booking } from '@/api/types'

/*
  The booking panel's state machine, as a reducer. Every change goes through a named action, so the
  rules ("you can't review without a stop", "seats stay between 1 and the limit") live in one pure function
  that can be tested without rendering anything.

  choose ──review──▶ confirm ──booked──▶ done
    ▲                   │
    └──────edit─────────┘   (a 409 "seats taken" stays on confirm with the corrected count)
*/

export type BookingStep = 'choose' | 'confirm' | 'done'

/** Something the customer should know before trying again. */
export interface SeatsTakenNotice {
  requested: number
  available: number
}

export interface BookingFlowState {
  step: BookingStep
  pickupPointId: number | null
  seats: number
  notice: SeatsTakenNotice | null
  booking: Booking | null
}

export type BookingFlowAction =
  | { type: 'selectStop'; pickupPointId: number }
  | { type: 'setSeats'; seats: number; max: number }
  | { type: 'review' }
  | { type: 'edit' }
  | { type: 'seatsTaken'; requested: number; available: number }
  | { type: 'booked'; booking: Booking }
  | { type: 'startOver' }

export const initialBookingFlow: BookingFlowState = {
  step: 'choose',
  pickupPointId: null,
  seats: 1,
  notice: null,
  booking: null,
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max))

export function bookingFlowReducer(state: BookingFlowState, action: BookingFlowAction): BookingFlowState {
  switch (action.type) {
    case 'selectStop':
      return { ...state, pickupPointId: action.pickupPointId }

    case 'setSeats':
      return { ...state, seats: clamp(action.seats, 1, action.max), notice: null }

    case 'review':
      // The button is disabled without a stop, but the reducer does not trust the UI.
      return state.pickupPointId === null ? state : { ...state, step: 'confirm' }

    case 'edit':
      return { ...state, step: 'choose', notice: null }

    case 'seatsTaken':
      // Someone else was faster. Offer what is left instead of failing: the count drops to the seats
      // still free and the customer only has to confirm again. With nothing left, back to the start.
      return action.available > 0
        ? { ...state, step: 'confirm', seats: Math.min(state.seats, action.available), notice: { requested: action.requested, available: action.available } }
        : { ...state, step: 'choose', notice: { requested: action.requested, available: action.available } }

    case 'booked':
      return { ...state, step: 'done', booking: action.booking, notice: null }

    case 'startOver':
      return initialBookingFlow
  }
}
