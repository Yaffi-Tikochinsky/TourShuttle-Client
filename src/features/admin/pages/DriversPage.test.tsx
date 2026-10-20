import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import DriversPage from './DriversPage'

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

afterEach(() => vi.unstubAllGlobals())

async function fillDriver() {
  await userEvent.click(await screen.findByRole('button', { name: 'נהג חדש' }))
  await userEvent.type(screen.getByLabelText(/שם מלא/), 'יוסף הנהג')
  await userEvent.type(screen.getByLabelText(/אימייל/), 'yosef@tourshuttle.demo')
  await userEvent.type(screen.getByLabelText(/טלפון/), '050-7654321')
  await userEvent.type(screen.getByLabelText(/סיסמה ראשונית/, { selector: 'input' }), 'Driver123!')
  await userEvent.click(screen.getByRole('button', { name: 'הוספת הנהג' }))
}

describe('DriversPage', () => {
  it('sends a new driver to the admin endpoint', async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) =>
      init?.method === 'POST'
        ? json(201, { id: 9, fullName: 'יוסף הנהג', email: 'yosef@tourshuttle.demo', phone: '050-7654321', role: 'Driver' })
        : json(200, []),
    )
    vi.stubGlobal('fetch', fetchMock)
    renderWithProviders(<DriversPage />)

    await fillDriver()

    expect(await screen.findByText('הנהג נוסף')).toBeInTheDocument()
    const post = fetchMock.mock.calls.find(([, init]) => init?.method === 'POST')
    expect(post?.[0]).toBe('/api/users/drivers')
    expect(JSON.parse(String(post?.[1]?.body))).toMatchObject({ email: 'yosef@tourshuttle.demo', password: 'Driver123!' })
  })

  it('says on the email field that the email is taken', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, init?: RequestInit) =>
        init?.method === 'POST' ? json(409, { status: 409, detail: 'An account with this email already exists.' }) : json(200, []),
      ),
    )
    renderWithProviders(<DriversPage />)

    await fillDriver()

    expect(await screen.findByText('כבר יש משתמש עם האימייל הזה')).toBeInTheDocument()
    // The typed name stays; only the password must be typed again.
    expect(screen.getByLabelText(/שם מלא/)).toHaveValue('יוסף הנהג')
  })
})
