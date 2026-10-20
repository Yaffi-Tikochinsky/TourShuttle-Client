import type { DestinationRequest, PickupPointRequest } from '@/api/admin.api'
import type { TourRequest } from '@/api/types'
import type { FieldErrors } from '@/features/auth/validation'

/*
  The server's Data Annotations (DestinationRequest.cs, PickupPointRequest.cs, TourRequest.cs) checked first in
  the browser, for instant Hebrew messages. Rules that need the database (the tour has bookings, the destination
  is in use) stay on the server and come back as 409.
*/

const length = (value: string, min: number, max: number) => value.trim().length >= min && value.trim().length <= max

export function validateDestination(values: DestinationRequest): FieldErrors<DestinationRequest> {
  const errors: FieldErrors<DestinationRequest> = {}
  if (!length(values.name, 2, 100)) errors.name = 'שם באורך 2 עד 100 תווים'
  if (!length(values.city, 2, 100)) errors.city = 'עיר באורך 2 עד 100 תווים'
  if ((values.description ?? '').length > 1000) errors.description = 'עד 1000 תווים'
  return errors
}

export function validatePickupPoint(values: PickupPointRequest): FieldErrors<PickupPointRequest> {
  const errors: FieldErrors<PickupPointRequest> = {}
  if (!length(values.name, 2, 100)) errors.name = 'שם באורך 2 עד 100 תווים'
  if (!length(values.address, 2, 200)) errors.address = 'כתובת באורך 2 עד 200 תווים'
  if (!length(values.city, 2, 100)) errors.city = 'עיר באורך 2 עד 100 תווים'
  return errors
}

/** `now` is a parameter so tests control the clock. */
export function validateTour(values: TourRequest, now: Date = new Date()): FieldErrors<TourRequest> {
  const errors: FieldErrors<TourRequest> = {}
  if (!values.destinationId) errors.destinationId = 'יש לבחור יעד'
  if (!values.departureAt) errors.departureAt = 'יש לבחור תאריך ושעה'
  else if (Date.parse(values.departureAt) <= now.getTime()) errors.departureAt = 'שעת היציאה צריכה להיות בעתיד'
  if (!values.returnAt) errors.returnAt = 'יש לבחור שעת חזרה'
  else if (values.departureAt && Date.parse(values.returnAt) <= Date.parse(values.departureAt))
    errors.returnAt = 'שעת החזרה צריכה להיות אחרי היציאה'
  if (!Number.isInteger(values.capacity) || values.capacity < 1 || values.capacity > 200) errors.capacity = 'בין 1 ל-200 מקומות'
  if (!Number.isInteger(values.maxSeatsPerBooking) || values.maxSeatsPerBooking < 1 || values.maxSeatsPerBooking > 20)
    errors.maxSeatsPerBooking = 'בין 1 ל-20 מקומות'
  else if (values.maxSeatsPerBooking > values.capacity) errors.maxSeatsPerBooking = 'לא יותר ממספר המקומות בהסעה'
  if (!(values.price >= 0) || values.price > 99_999_999.99) errors.price = 'מחיר לא תקין'
  const minutes = values.minutesBetweenPickupPoints
  if (minutes !== null && (!Number.isInteger(minutes) || minutes < 1 || minutes > 30)) errors.minutesBetweenPickupPoints = 'בין 1 ל-30 דקות, או ריק'
  if (values.pickupPointIds.length === 0) errors.pickupPointIds = 'יש להוסיף לפחות תחנה אחת'
  else if (values.pickupPointIds.length > 20) errors.pickupPointIds = 'עד 20 תחנות'
  return errors
}
