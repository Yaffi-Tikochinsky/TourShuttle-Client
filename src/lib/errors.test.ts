import { describe, expect, it } from 'vitest'
import { ApiError, headlineForStatus } from './errors'

const problem = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/problem+json' } })

describe('ApiError.fromResponse', () => {
  it('reads the ProblemDetails body the server sends', async () => {
    const error = await ApiError.fromResponse(
      problem(409, {
        title: 'Conflict',
        status: 409,
        detail: 'Not enough seats: 1 left and 2 requested.',
        correlationId: 'a1b2c3d4e5f6',
      }),
    )

    expect(error.status).toBe(409)
    expect(error.detail).toBe('Not enough seats: 1 left and 2 requested.')
    expect(error.correlationId).toBe('a1b2c3d4e5f6')
    expect(error.headline).toBe('הפעולה התנגשה עם שינוי אחר')
  })

  it('finds validation messages by field name, ignoring case', async () => {
    const error = await ApiError.fromResponse(
      problem(400, { title: 'One or more validation errors occurred.', errors: { Email: ['The Email field is not a valid e-mail address.'] } }),
    )

    expect(error.fieldError('email')).toBe('The Email field is not a valid e-mail address.')
    expect(error.fieldError('password')).toBeUndefined()
  })

  it('still works when the body is not JSON', async () => {
    const error = await ApiError.fromResponse(new Response('Bad gateway', { status: 502, statusText: 'Bad Gateway' }))

    expect(error.status).toBe(502)
    expect(error.headline).toBe('תקלה בשרת, נסו שוב בעוד רגע')
  })
})

describe('headlineForStatus', () => {
  it.each([
    [0, 'אין חיבור לשרת'],
    [401, 'נדרשת התחברות'],
    [403, 'אין לך הרשאה לפעולה הזו'],
    [404, 'לא מצאנו את מה שחיפשת'],
  ])('status %i reads "%s"', (status, text) => {
    expect(headlineForStatus(status)).toBe(text)
  })
})
