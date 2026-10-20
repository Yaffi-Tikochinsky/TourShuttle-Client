import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import type { UserRole } from '@/api/types'
import { ForbiddenPage } from '@/features/system/ForbiddenPage'
import { useAuth } from './useAuth'

/** Where the login page sends the user back to after signing in. */
export interface LoginRedirectState {
  from?: string
}

interface RequireRoleProps {
  /** Omit to allow any signed-in user. */
  roles?: UserRole[]
  children?: ReactNode
}

/**
 * Guards a route. A guest is sent to /login and comes back afterwards; a signed-in user with the wrong role sees 403.
 * This only shapes the UI: the server checks the token and the role on every request anyway.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const state: LoginRedirectState = { from: location.pathname + location.search }
    return <Navigate to="/login" replace state={state} />
  }

  if (roles && !roles.includes(user.role)) return <ForbiddenPage />

  return children ?? <Outlet />
}

/** The login and register pages make no sense for someone already signed in. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : children
}
