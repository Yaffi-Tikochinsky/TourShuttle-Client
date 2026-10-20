import { useActionState } from 'react'
import { UserPlus } from 'lucide-react'
import type { RegisterRequest, User } from '@/api/types'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, PasswordField, TextField } from '@/components/ui'
import { toApiError, type ApiError } from '@/lib/errors'
import { useAuth } from '../useAuth'
import { hasErrors, validateRegister, type FieldErrors } from '../validation'
import styles from './AuthForms.module.css'

interface RegisterState {
  values: Omit<RegisterRequest, 'password'>
  fieldErrors: FieldErrors<RegisterRequest>
  apiError: ApiError | null
}

const initialState: RegisterState = {
  values: { fullName: '', email: '', phone: '' },
  fieldErrors: {},
  apiError: null,
}

export function RegisterForm({ onSuccess }: { onSuccess: (user: User) => void }) {
  const { register } = useAuth()

  const [state, formAction, isPending] = useActionState<RegisterState, FormData>(async (_previous, formData) => {
    const values: RegisterRequest = {
      fullName: String(formData.get('fullName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    }
    // The password is never kept in state, so it is never written back into the page.
    const safeValues = { fullName: values.fullName, email: values.email, phone: values.phone }

    const fieldErrors = validateRegister(values)
    if (hasErrors(fieldErrors)) return { values: safeValues, fieldErrors, apiError: null }

    try {
      // The API returns a token on registration, so the new customer is signed in straight away.
      onSuccess(await register(values))
      return initialState
    } catch (error) {
      const apiError = toApiError(error)
      // 409 here means the email exists: show it on the email field, where it belongs.
      const emailTaken = apiError.status === 409
      return {
        values: safeValues,
        fieldErrors: emailTaken ? { email: 'כבר קיים חשבון עם האימייל הזה' } : {},
        apiError: emailTaken ? null : apiError,
      }
    }
  }, initialState)

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.apiError && <ApiErrorAlert error={state.apiError} />}

      <TextField
        label="שם מלא"
        name="fullName"
        autoComplete="name"
        required
        autoFocus
        defaultValue={state.values.fullName}
        error={state.fieldErrors.fullName}
      />
      <div className={styles.row}>
        <TextField
          label="אימייל"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          required
          defaultValue={state.values.email}
          error={state.fieldErrors.email}
        />
        <TextField
          label="טלפון"
          name="phone"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          required
          defaultValue={state.values.phone}
          error={state.fieldErrors.phone}
          hint="לעדכונים על ההסעה"
        />
      </div>
      <PasswordField
        label="סיסמה"
        name="password"
        dir="ltr"
        autoComplete="new-password"
        required
        error={state.fieldErrors.password}
        hint="לפחות 8 תווים, עם אות באנגלית וספרה"
      />

      <Button type="submit" size="lg" fullWidth isLoading={isPending} icon={<UserPlus />}>
        {isPending ? 'יוצרים חשבון…' : 'פתיחת חשבון'}
      </Button>
    </form>
  )
}
