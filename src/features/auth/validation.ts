import type { LoginRequest, RegisterRequest } from '@/api/types'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[0-9+\-\s()]{9,20}$/

/*
  The same rules as the server's DTO Data Annotations (RegisterRequest.cs, LoginRequest.cs), checked here first
  so the user gets Hebrew messages instantly. The server still validates: the client can always be bypassed.
*/

export function validateLogin(values: LoginRequest): FieldErrors<LoginRequest> {
  const errors: FieldErrors<LoginRequest> = {}
  if (!EMAIL.test(values.email)) errors.email = 'יש להזין כתובת אימייל תקינה'
  if (!values.password) errors.password = 'יש להזין סיסמה'
  return errors
}

export function validateRegister(values: RegisterRequest): FieldErrors<RegisterRequest> {
  const errors: FieldErrors<RegisterRequest> = {}
  const name = values.fullName.trim()
  if (name.length < 2 || name.length > 100) errors.fullName = 'שם מלא באורך 2 עד 100 תווים'
  if (!EMAIL.test(values.email) || values.email.length > 200) errors.email = 'יש להזין כתובת אימייל תקינה'
  if (!PHONE.test(values.phone.trim())) errors.phone = 'מספר טלפון תקין, למשל 050-1234567'
  if (values.password.length < 8) errors.password = 'לפחות 8 תווים'
  else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password))
    errors.password = 'הסיסמה צריכה לכלול לפחות אות אחת באנגלית וספרה אחת'
  return errors
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0
}
