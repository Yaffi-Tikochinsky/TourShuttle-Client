import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import type { PickupPoint } from '@/api/types'
import { RouteBuilder } from './RouteBuilder'

const points: PickupPoint[] = [
  { id: 1, name: 'בני ברק - רבי עקיבא', address: 'רבי עקיבא 100', city: 'בני ברק' },
  { id: 2, name: 'רמת גן - הבורסה', address: "ז'בוטינסקי 7", city: 'רמת גן' },
  { id: 3, name: 'מודיעין - מרכז העיר', address: 'עמק דותן 1', city: 'מודיעין' },
]

/** The builder is controlled, so the test gives it a parent that owns the route. */
function Harness({ initial = [] as number[] }) {
  const [route, setRoute] = useState(initial)
  return (
    <>
      <RouteBuilder points={points} value={route} onChange={setRoute} />
      <output data-testid="route">{route.join(',')}</output>
    </>
  )
}

describe('RouteBuilder', () => {
  it('adds stops in the order they are picked', async () => {
    render(<Harness />)

    await userEvent.click(screen.getByRole('button', { name: /רמת גן - הבורסה/ }))
    await userEvent.click(screen.getByRole('button', { name: /בני ברק - רבי עקיבא/ }))

    expect(screen.getByTestId('route')).toHaveTextContent('2,1')
  })

  it('moves a stop earlier and removes one', async () => {
    render(<Harness initial={[1, 2, 3]} />)

    await userEvent.click(screen.getByRole('button', { name: 'הקדמת מודיעין - מרכז העיר' }))
    expect(screen.getByTestId('route')).toHaveTextContent('1,3,2')

    await userEvent.click(screen.getByRole('button', { name: 'הסרת בני ברק - רבי עקיבא מהמסלול' }))
    expect(screen.getByTestId('route')).toHaveTextContent('3,2')
  })

  it('filters the available stops by city', async () => {
    render(<Harness />)

    await userEvent.type(screen.getByRole('searchbox', { name: 'חיפוש תחנה' }), 'מודיעין')

    const list = screen.getByRole('list')
    expect(within(list).getAllByRole('button')).toHaveLength(1)
    expect(within(list).getByRole('button', { name: /מודיעין/ })).toBeInTheDocument()
  })
})
