import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { TourSummary } from '@/api/types'
import { TourCard } from './TourCard'

const tour = (overrides: Partial<TourSummary> = {}): TourSummary => ({
  id: 5,
  destinationId: 1,
  destinationName: 'הכותל המערבי',
  city: 'ירושלים',
  departureAt: '2030-10-21T06:00:00Z',
  returnAt: '2030-10-21T11:00:00Z',
  price: 45,
  capacity: 50,
  availableSeats: 38,
  maxSeatsPerBooking: 8,
  status: 'Scheduled',
  displayStatus: 'Scheduled',
  driverName: 'משה הנהג',
  cities: ['בני ברק', 'רמת גן', 'פתח תקווה'],
  ...overrides,
})

const renderCard = (t: TourSummary) =>
  render(
    <MemoryRouter>
      <TourCard tour={t} />
    </MemoryRouter>,
  )

describe('TourCard', () => {
  it('links to the tour and shows its route, times and price', () => {
    renderCard(tour())

    expect(screen.getByRole('link', { name: 'הכותל המערבי' })).toHaveAttribute('href', '/tours/5')
    expect(screen.getByRole('list', { name: 'מסלול ההסעה' })).toHaveTextContent('בני ברקרמת גןפתח תקווהירושלים')
    expect(screen.getByText(/09:00–14:00/)).toBeInTheDocument()
    expect(screen.getByText('נותרו 38 מקומות')).toBeInTheDocument()
  })

  it('warns when few seats are left', () => {
    renderCard(tour({ availableSeats: 2 }))

    expect(screen.getByText('נותרו 2 מקומות אחרונים')).toBeInTheDocument()
  })

  it('marks a tour with no seats left as full', () => {
    renderCard(tour({ availableSeats: 0 }))

    expect(screen.getByText('מלאה')).toBeInTheDocument()
    expect(screen.getByText('כל המקומות נתפסו')).toBeInTheDocument()
  })
})
