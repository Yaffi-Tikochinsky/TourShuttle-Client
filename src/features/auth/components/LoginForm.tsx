import { useActionState } from 'react'
import { LogIn } from 'lucide-react'
import type { LoginRequest, User } from '@/api/types'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, PasswordField, TextField } from '@/components/ui'
import { toApiError, type ApiError } from '@/lib/errors'
import { useAuth } from '../useAuth'
import { hasErrors, validateLogin, type FieldErrors } from '../validation'
import styles from './AuthForms.module.css'

interface LoginState {
  email: string
  fieldErrors: FieldErrors<LoginRequest>
  apiError: ApiError | null
}

const initialState: LoginState = { email: '', fieldErrors: {}, apiError: null }

/**
 * React 19 form actions: <form action={...}> calls the action with the form's FormData, and useActionState
 * keeps the result between submissions together with `isPending`. No onSubmit, no preventDefault,
 * no useState per field: the inputs are uncontrolled and React reads them when the form is sent.
 */
export function LoginForm({ onSuccess }: { onSuccess: (user: User) => void }) {
  const { login } = useAuth()

  const [state, formAction, isPending] = useActionState<LoginState, FormData>(async (_previous, formData) => {
    const values: LoginRequest = {
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    }

    const fieldErrors = validateLogin(values)
    if (hasErrors(fieldErrors)) return { email: values.email, fieldErrors, apiError: null }

    try {
      onSuccess(await login(values))
      return initialState
    } catch (error) {
      return { email: values.email, fieldErrors: {}, apiError: toApiError(error) }
    }
  }, initialState)

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.apiError && (
        <ApiErrorAlert
          error={state.apiError}
          title={state.apiError.status === 401 ? 'האימייל או הסיסמה שגויים' : undefined}
        />
      )}

      {/* React resets uncontrolled fields after an action; defaultValue brings the email back so it is not retyped. */}
      <TextField
        label="אימייל"
        name="email"
        type="email"
        dir="ltr"
        autoComplete="email"
        required
        autoFocus
        defaultValue={state.email}
        error={state.fieldErrors.email}
      />
      <PasswordField
        label="סיסמה"
        name="password"
        dir="ltr"
        autoComplete="current-password"
        required
        error={state.fieldErrors.password}
      />

      <Button type="submit" size="lg" fullWidth isLoading={isPending} icon={<LogIn />}>
        {isPending ? 'מתחברים…' : 'התחברות'}
      </Button>
    </form>
  )
}
