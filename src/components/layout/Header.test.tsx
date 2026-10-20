import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { Header } from './Header'

describe('Header', () => {
  it('closes the mobile menu with Escape and returns focus to its button', async () => {
    renderWithProviders(<Header />)
    const button = screen.getByRole('button', { name: 'פתיחת התפריט' })

    await userEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    await userEvent.keyboard('{Escape}')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveFocus()
  })

  it('shows a guest only the public links', () => {
    renderWithProviders(<Header />)

    expect(screen.getByRole('link', { name: 'הסעות' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'ההזמנות שלי' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'ההסעות שלי' })).not.toBeInTheDocument()
  })
})
