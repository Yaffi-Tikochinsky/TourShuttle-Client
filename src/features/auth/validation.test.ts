import { describe, expect, it } from 'vitest'
import { hasErrors, validateRegister } from './validation'

const valid = { fullName: 'שרה כהן', email: 'sara@example.com', phone: '052-2222222', password: 'Secret123' }

describe('validateRegister (same rules as the server DTO)', () => {
  it('accepts a valid registration', () => {
    expect(hasErrors(validateRegister(valid))).toBe(false)
  })

  it.each([
    ['fullName', { fullName: 'א' }],
    ['email', { email: 'not-an-email' }],
    ['phone', { phone: '12' }],
    ['password', { password: 'short1' }],
    ['password', { password: 'onlyletters' }],
    ['password', { password: '12345678' }],
  ])('rejects a bad %s', (field, change) => {
    const errors = validateRegister({ ...valid, ...change })

    expect(Object.keys(errors)).toEqual([field])
  })
})
