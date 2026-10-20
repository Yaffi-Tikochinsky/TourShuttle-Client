import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('calls onClick when pressed', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>הזמנה</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'הזמנה' }))

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('blocks clicks and tells assistive technology it is busy while loading', async () => {
    const onClick = vi.fn()
    render(
      <Button isLoading onClick={onClick}>
        שולחים
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'שולחים' })
    await userEvent.click(button)

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(onClick).not.toHaveBeenCalled()
  })
})
