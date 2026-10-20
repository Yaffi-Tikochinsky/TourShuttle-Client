import { use } from 'react'
import { AuthContext, type AuthContextValue } from './authContext'

/** Who is signed in, and login / register / logout. Usable in any component under <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const auth = use(AuthContext)
  if (!auth) throw new Error('useAuth must be used inside <AuthProvider>.')
  return auth
}
