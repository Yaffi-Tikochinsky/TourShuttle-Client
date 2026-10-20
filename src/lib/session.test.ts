import { describe, expect, it, vi } from 'vitest'
import { sessionStore, type Session } from './session'

const session = (minutesLeft: number): Session => ({
  token: 'jwt-token',
  expiresAt: new Date(Date.now() + minutesLeft * 60_000).toISOString(),
  user: { id: 3, fullName: 'ישראל ישראלי', email: 'customer1@tourshuttle.demo', phone: '052-1111111', role: 'Customer' },
})

describe('sessionStore', () => {
  it('stores the session, hands out the token, and notifies subscribers', () => {
    const listener = vi.fn()
    const unsubscribe = sessionStore.subscribe(listener)

    sessionStore.start(session(60))

    expect(sessionStore.getToken()).toBe('jwt-token')
    expect(localStorage.getItem('tourshuttle.session')).toContain('jwt-token')
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    sessionStore.end('logout')
  })

  it('gives no token once the session has expired', () => {
    sessionStore.start(session(-1))

    expect(sessionStore.getToken()).toBeNull()
    sessionStore.end('logout')
  })

  it('remembers why the session ended, exactly once', () => {
    sessionStore.start(session(60))
    sessionStore.end('expired')

    expect(sessionStore.get()).toBeNull()
    expect(localStorage.getItem('tourshuttle.session')).toBeNull()
    expect(sessionStore.takeEndReason()).toBe('expired')
    expect(sessionStore.takeEndReason()).toBeNull()
  })
})
