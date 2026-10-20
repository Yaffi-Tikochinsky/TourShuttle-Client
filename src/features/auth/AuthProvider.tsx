import { useCallback, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import type { AuthResponse, LoginRequest, RegisterRequest, UserRole } from '@/api/types'
import { useToast } from '@/components/ui'
import { sessionStore } from '@/lib/session'
import { AuthContext, type AuthContextValue } from './authContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  // The session lives in an external store (lib/session) that the API client also reads;
  // useSyncExternalStore re-renders this provider, and everything that uses useAuth, whenever it changes.
  const session = useSyncExternalStore(sessionStore.subscribe, sessionStore.get)
  const queryClient = useQueryClient()
  const toast = useToast()

  // Log out exactly when the token expires, even if the user is just reading a page.
  useEffect(() => {
    if (!session) return
    const msLeft = Date.parse(session.expiresAt) - Date.now()
    const timer = window.setTimeout(() => sessionStore.end('expired'), Math.max(msLeft, 0))
    return () => window.clearTimeout(timer)
  }, [session])

  // When a session ends (logout, expiry, or a 401 from any request), drop cached data that belonged to that user.
  useEffect(() => {
    if (session) return
    queryClient.removeQueries({ queryKey: ['me'] })
    if (sessionStore.takeEndReason() === 'expired') {
      toast.show({ tone: 'warning', title: 'פג תוקף ההתחברות', message: 'מטעמי אבטחה יש להתחבר שוב.' })
    }
  }, [session, queryClient, toast])

  const start = useCallback((response: AuthResponse) => {
    sessionStore.start({ token: response.token, expiresAt: response.expiresAt, user: response.user })
    return response.user
  }, [])

  const login = useCallback(async (request: LoginRequest) => start(await authApi.login(request)), [start])
  const register = useCallback(async (request: RegisterRequest) => start(await authApi.register(request)), [start])

  const logout = useCallback(() => {
    sessionStore.end('logout')
    toast.info('התנתקת', 'נשמח לראות אותך שוב.')
  }, [toast])

  // Memoized, so components that read the context re-render only when the session really changes.
  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null
    return {
      user,
      isAuthenticated: user !== null,
      hasRole: (...roles: UserRole[]) => user !== null && roles.includes(user.role),
      login,
      register,
      logout,
    }
  }, [session, login, register, logout])

  return <AuthContext value={value}>{children}</AuthContext>
}
