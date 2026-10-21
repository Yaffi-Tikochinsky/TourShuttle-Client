import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Dust } from '@/components/art/Dust'
import { Reveal } from './Reveal'

const specks = (container: HTMLElement) => [...container.querySelectorAll('span')].map((s) => s.getAttribute('style'))

describe('Dust', () => {
  it('scatters the same way on every render (a pure component), and differently for another seed', () => {
    const first = render(<Dust count={6} seed={3} />)
    const again = render(<Dust count={6} seed={3} />)
    const other = render(<Dust count={6} seed={4} />)

    expect(specks(first.container)).toHaveLength(6)
    expect(specks(again.container)).toEqual(specks(first.container))
    expect(specks(other.container)).not.toEqual(specks(first.container))
  })

  it('is hidden from screen readers', () => {
    const { container } = render(<Dust />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('Reveal', () => {
  it('passes HTML attributes on to its element', () => {
    render(
      <Reveal as="section" aria-labelledby="title" variant="scale">
        <h2 id="title">פרטי ההסעה</h2>
      </Reveal>,
    )

    const section = screen.getByRole('region', { name: 'פרטי ההסעה' })
    expect(section).toHaveAttribute('data-variant', 'scale')
  })
})
