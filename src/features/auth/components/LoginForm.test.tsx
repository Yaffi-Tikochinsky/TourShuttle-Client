import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { LoginForm } from './LoginForm'

const respond = (status: number, body: object) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }))

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('LoginForm', () => {
  it('shows Hebrew validation messages without calling the server', async () => {
    const fetchMock = respond(200, {})
    vi.stubGlobal('fetch', fetchMock)
    renderWithProviders(<LoginForm onSuccess={vi.fn()} />)

    await userEvent.type(screen.getByLabelText(/אימייל/), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: 'התחברות' }))

    expect(await screen.findByText('יש להזין כתובת אימייל תקינה')).toBeInTheDocument()
    expect(screen.getByText('יש להזין סיסמה')).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows one clear message for a wrong email or password, and keeps the typed email', async () => {
    vi.stubGlobal(
      'fetch',
      respond(401, { title: 'Unauthorized', status: 401, detail: 'The email or password is incorrect.', correlationId: 'abc123' }),
    )
    const onSuccess = vi.fn()
    renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await userEvent.type(screen.getByLabelText(/אימייל/), 'customer1@tourshuttle.demo')
    await userEvent.type(screen.getByLabelText(/^סיסמה/, { selector: 'input' }), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'התחברות' }))

    expect(await screen.findByText('האימייל או הסיסמה שגויים')).toBeInTheDocument()
    expect(screen.getByText('abc123')).toBeInTheDocument()
    expect(screen.getByLabelText(/אימייל/)).toHaveValue('customer1@tourshuttle.demo')
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('signs in and hands the user to the page', async () => {
    const user = { id: 3, fullName: 'ישראל ישראלי', email: 'customer1@tourshuttle.demo', phone: '052-1111111', role: 'Customer' }
    vi.stubGlobal('fetch', respond(200, { token: 'jwt', expiresAt: new Date(Date.now() + 3_600_000).toISOString(), user }))
    const onSuccess = vi.fn()
    renderWithProviders(<LoginForm onSuccess={onSuccess} />)

    await userEvent.type(screen.getByLabelText(/אימייל/), 'customer1@tourshuttle.demo')
    await userEvent.type(screen.getByLabelText(/^סיסמה/, { selector: 'input' }), 'Customer123!')
    await userEvent.click(screen.getByRole('button', { name: 'התחברות' }))

    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledWith(user))
  })
})
