import { createContext } from 'react'
import type { LoginRequest, RegisterRequest, User, UserRole } from '@/api/types'

export interface AuthContextValue {
  /** The signed-in user, or null for a guest. */
  user: User | null
  isAuthenticated: boolean
  hasRole: (...roles: UserRole[]) => boolean
  login: (request: LoginRequest) => Promise<User>
  register: (request: RegisterRequest) => Promise<User>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
