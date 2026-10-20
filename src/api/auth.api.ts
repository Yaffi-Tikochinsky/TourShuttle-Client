import { http } from './client'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from './types'

export const authApi = {
  login: (request: LoginRequest) => http.post<AuthResponse>('/api/auth/login', request),
  register: (request: RegisterRequest) => http.post<AuthResponse>('/api/auth/register', request),
  me: (signal?: AbortSignal) => http.get<User>('/api/users/me', { signal }),
}
