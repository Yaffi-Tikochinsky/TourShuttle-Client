import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { StopPassengers } from '@/api/types'
import { StopCard } from './StopCard'

const stop: StopPassengers = {
  pickupPointId: 3,
  name: 'בני ברק - רבי עקיבא',
  address: 'רבי עקיבא 100',
  order: 1,
  estimatedPickupTimeUtc: '2030-10-21T06:00:00Z',
  totalSeats: 3,
  passengers: [
    { bookingId: 11, fullName: 'שרה כהן', phone: '050-1111111', seatsCount: 2 },
    { bookingId: 12, fullName: 'דוד לוי', phone: '050-2222222', seatsCount: 1 },
  ],
}

const renderStop = (boarded: number[], onToggle = vi.fn()) =>
  render(
    <ol>
      <StopCard stop={stop} boarded={new Set(boarded)} onToggle={onToggle} index={0} />
    </ol>,
  )

describe('StopCard', () => {
  it('lists each passenger with seats and a phone link', () => {
    renderStop([])

    expect(screen.getByText('09:00')).toBeInTheDocument()
    expect(screen.getByText('3 מקומות')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'התקשרות אל שרה כהן' })).toHaveAttribute('href', 'tel:050-1111111')
  })

  it('reports a passenger checked as on board', async () => {
    const onToggle = vi.fn()
    renderStop([12], onToggle)

    expect(screen.getByRole('checkbox', { name: 'דוד לוי' })).toBeChecked()
    await userEvent.click(screen.getByRole('checkbox', { name: 'שרה כהן' }))
    expect(onToggle).toHaveBeenCalledWith(11)
  })

  it('says so when nobody gets on at the stop', () => {
    render(
      <ol>
        <StopCard stop={{ ...stop, totalSeats: 0, passengers: [] }} boarded={new Set()} onToggle={vi.fn()} index={0} />
      </ol>,
    )

    expect(screen.getByText('אין עולים')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })
})
