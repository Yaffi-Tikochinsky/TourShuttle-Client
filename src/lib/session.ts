import type { User } from '@/api/types'

/** What survives a page reload: the JWT and who it belongs to. */
export interface Session {
  token: string
  expiresAt: string
  user: User
}

export type SessionEndReason = 'logout' | 'expired'

type Listener = () => void

const STORAGE_KEY = 'tourshuttle.session'

/*
  A tiny external store (outside React) for the session.
  Why not plain React state: the API client must read the token at the moment of every request,
  including requests fired while React is still rendering. React components subscribe to it with
  useSyncExternalStore (see AuthContext), so they re-render whenever it changes.
*/
let current: Session | null = read()
let lastEndReason: SessionEndReason | null = null
const listeners = new Set<Listener>()

function read(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as Session
    return isExpired(session) ? null : session
  } catch {
    return null
  }
}

function isExpired(session: Session): boolean {
  return new Date(session.expiresAt).getTime() <= Date.now()
}

function emit() {
  listeners.forEach((listener) => listener())
}

export const sessionStore = {
  get(): Session | null {
    return current
  },

  getToken(): string | null {
    return current && !isExpired(current) ? current.token : null
  },

  start(session: Session) {
    current = session
    lastEndReason = null
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    emit()
  },

  end(reason: SessionEndReason) {
    if (!current) return
    current = null
    lastEndReason = reason
    localStorage.removeItem(STORAGE_KEY)
    emit()
  },

  /** Why the last session ended, read once (so the "session expired" message shows once). */
  takeEndReason(): SessionEndReason | null {
    const reason = lastEndReason
    lastEndReason = null
    return reason
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

// Log in or out in one tab and every other open tab follows.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return
    current = read()
    emit()
  })
}
