import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Booking, TourDetails } from '@/api/types'
import { sessionStore } from '@/lib/session'
import { renderWithProviders } from '@/test/renderWithProviders'
import { BookingPanel } from './BookingPanel'

const tour = (overrides: Partial<TourDetails> = {}): TourDetails => ({
  id: 5,
  destinationId: 1,
  destinationName: 'הכותל המערבי',
  city: 'ירושלים',
  departureAt: '2030-10-21T06:00:00Z',
  returnAt: '2030-10-21T11:00:00Z',
  price: 45,
  capacity: 50,
  availableSeats: 10,
  maxSeatsPerBooking: 6,
  status: 'Scheduled',
  displayStatus: 'Scheduled',
  driverName: null,
  cities: ['בני ברק'],
  destinationDescription: null,
  driverId: null,
  minutesBetweenPickupPoints: 2,
  customMinutesBetweenPickupPoints: null,
  pickupPoints: [
    { pickupPointId: 3, name: 'בני ברק - רבי עקיבא', address: 'רבי עקיבא 100', order: 1, estimatedPickupTimeUtc: '2030-10-21T06:00:00Z' },
    { pickupPointId: 4, name: 'רמת גן - הבורסה', address: 'ז׳בוטינסקי 1', order: 2, estimatedPickupTimeUtc: '2030-10-21T06:02:00Z' },
  ],
  ...overrides,
})

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

/** A fake server: each test says what the booking POST and the tour GET answer. */
function fakeServer({ post, freshTour }: { post: () => Response; freshTour?: TourDetails }) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith('/api/users/me/bookings')) return json(200, [])
    if (url.endsWith('/api/tours/5/bookings') && init?.method === 'POST') return post()
    if (url.endsWith('/api/tours/5')) return json(200, freshTour ?? tour())
    return json(404, {})
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  sessionStore.start({
    token: 'test-token',
    expiresAt: '2099-01-01T00:00:00Z',
    user: { id: 2, fullName: 'לקוח לדוגמה', email: 'c@example.com', phone: '050', role: 'Customer' },
  })
})

afterEach(() => {
  sessionStore.end('logout')
  vi.unstubAllGlobals()
})

async function chooseAndReview(seats: number) {
  await userEvent.click(await screen.findByRole('radio', { name: /רמת גן/ }))
  const more = screen.getByRole('button', { name: 'מקום אחד יותר' })
  for (let i = 1; i < seats; i++) await userEvent.click(more)
  await userEvent.click(screen.getByRole('button', { name: /המשך לאישור/ }))
}

describe('BookingPanel', () => {
  it('cannot continue before a stop is chosen, and stops the count at the booking limit', async () => {
    fakeServer({ post: () => json(201, {}) })
    renderWithProviders(<BookingPanel tour={tour({ maxSeatsPerBooking: 3 })} />)

    expect(await screen.findByRole('button', { name: /המשך לאישור/ })).toBeDisabled()

    const more = screen.getByRole('button', { name: 'מקום אחד יותר' })
    await userEvent.click(more)
    await userEvent.click(more)
    expect(more).toBeDisabled()
    expect(screen.getByText('זה המקסימום: 3 מקומות')).toBeInTheDocument()
  })

  it('books and shows the confirmation', async () => {
    const booking = {
      id: 77,
      tourId: 5,
      destinationName: 'הכותל המערבי',
      pickupPointName: 'רמת גן - הבורסה',
      estimatedPickupTimeUtc: '2030-10-21T06:02:00Z',
      seatsCount: 2,
    } as Booking
    const fetchMock = fakeServer({ post: () => json(201, booking) })
    renderWithProviders(<BookingPanel tour={tour()} />)

    await chooseAndReview(2)
    // Intl puts invisible right-to-left marks around the number and the shekel sign, so match loosely.
    expect(screen.getByText(/90\D*₪/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'אישור והזמנה' }))

    expect(await screen.findByRole('heading', { name: 'ההזמנה נקלטה' })).toBeInTheDocument()
    const post = fetchMock.mock.calls.find(([, init]) => init?.method === 'POST')
    expect(JSON.parse(String(post?.[1]?.body))).toEqual({ pickupPointId: 4, seatsCount: 2 })
  })

  it('turns a 409 into an offer of the seats that are left', async () => {
    fakeServer({
      post: () => json(409, { title: 'Conflict', status: 409, detail: 'Not enough seats: 2 left and 4 requested.' }),
      freshTour: tour({ availableSeats: 2 }),
    })
    renderWithProviders(<BookingPanel tour={tour()} />)

    await chooseAndReview(4)
    await userEvent.click(screen.getByRole('button', { name: 'אישור והזמנה' }))

    expect(await screen.findByText('חלק מהמקומות נתפסו ממש עכשיו')).toBeInTheDocument()
    expect(screen.getByText(/ביקשתם 4 מקומות, ונשארו 2 מקומות/)).toBeInTheDocument()
    const review = screen.getByText('מקומות').closest('div')!
    expect(within(review).getByText('2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'אישור והזמנה' })).toBeEnabled()
  })
})
