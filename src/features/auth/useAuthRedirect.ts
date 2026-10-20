import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { User } from '@/api/types'
import { useToast } from '@/components/ui'
import type { LoginRedirectState } from './RouteGuards'

/** After signing in: greet the user and return to the page they were trying to open (or home). */
export function useAuthRedirect(greeting: (user: User) => string) {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const from = (location.state as LoginRedirectState | null)?.from ?? '/'

  return useCallback(
    (user: User) => {
      toast.success(greeting(user))
      navigate(from, { replace: true })
    },
    [toast, greeting, navigate, from],
  )
}
