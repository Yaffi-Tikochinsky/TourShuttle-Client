import { useActionState, useId } from 'react'
import { Save } from 'lucide-react'
import type { DestinationRequest, PickupPointRequest } from '@/api/admin.api'
import type { Destination, PickupPoint } from '@/api/types'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, TextField } from '@/components/ui'
import { hasErrors, type FieldErrors } from '@/features/auth/validation'
import { toApiError, type ApiError } from '@/lib/errors'
import { validateDestination, validatePickupPoint } from '../adminValidation'
import styles from './CatalogForms.module.css'

/*
  The two small catalog forms. Both use React 19 form actions (useActionState), like the login form:
  uncontrolled inputs, FormData read on submit, the result (errors) kept between submissions.
  The values are kept in the state too, so a failed submit shows what was typed (React resets the fields).
*/

interface FormState<T> {
  values: T
  fieldErrors: FieldErrors<T>
  apiError: ApiError | null
}

/** Client errors first; then the server's 400 field errors, matched by name, for anything the client let through. */
function serverFieldErrors<T>(error: ApiError, fields: Array<keyof T & string>): FieldErrors<T> {
  const errors: FieldErrors<T> = {}
  for (const field of fields) {
    const message = error.fieldError(field)
    if (message) errors[field] = message
  }
  return errors
}

const text = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim()

interface DestinationFormProps {
  initial?: Destination
  onSubmit: (request: DestinationRequest) => Promise<unknown>
  onCancel: () => void
}

export function DestinationForm({ initial, onSubmit, onCancel }: DestinationFormProps) {
  const initialState: FormState<DestinationRequest> = {
    values: { name: initial?.name ?? '', city: initial?.city ?? '', description: initial?.description ?? null },
    fieldErrors: {},
    apiError: null,
  }

  const [state, formAction, isPending] = useActionState<FormState<DestinationRequest>, FormData>(async (_previous, formData) => {
    const values: DestinationRequest = {
      name: text(formData, 'name'),
      city: text(formData, 'city'),
      description: text(formData, 'description') || null,
    }
    const fieldErrors = validateDestination(values)
    if (hasErrors(fieldErrors)) return { values, fieldErrors, apiError: null }
    try {
      await onSubmit(values)
      return { values, fieldErrors: {}, apiError: null }
    } catch (error) {
      const apiError = toApiError(error)
      return { values, fieldErrors: serverFieldErrors(apiError, ['name', 'city', 'description']), apiError }
    }
  }, initialState)

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.apiError && <ApiErrorAlert error={state.apiError} />}
      <TextField label="שם היעד" name="name" required autoFocus defaultValue={state.values.name} error={state.fieldErrors.name} />
      <TextField
        label="עיר"
        name="city"
        required
        defaultValue={state.values.city}
        error={state.fieldErrors.city}
        hint="העיר מופיעה ליד שם היעד בכל ההסעות אליו."
      />
      <TextArea label="תיאור" name="description" defaultValue={state.values.description ?? ''} error={state.fieldErrors.description} />
      <FormButtons isPending={isPending} onCancel={onCancel} />
    </form>
  )
}

interface PickupPointFormProps {
  initial?: PickupPoint
  /** Cities already in use, offered while typing so a city is written the same way at every stop. */
  cities: string[]
  onSubmit: (request: PickupPointRequest) => Promise<unknown>
  onCancel: () => void
}

export function PickupPointForm({ initial, cities, onSubmit, onCancel }: PickupPointFormProps) {
  const listId = useId()
  const initialState: FormState<PickupPointRequest> = {
    values: { name: initial?.name ?? '', address: initial?.address ?? '', city: initial?.city ?? '' },
    fieldErrors: {},
    apiError: null,
  }

  const [state, formAction, isPending] = useActionState<FormState<PickupPointRequest>, FormData>(async (_previous, formData) => {
    const values: PickupPointRequest = { name: text(formData, 'name'), address: text(formData, 'address'), city: text(formData, 'city') }
    const fieldErrors = validatePickupPoint(values)
    if (hasErrors(fieldErrors)) return { values, fieldErrors, apiError: null }
    try {
      await onSubmit(values)
      return { values, fieldErrors: {}, apiError: null }
    } catch (error) {
      const apiError = toApiError(error)
      return { values, fieldErrors: serverFieldErrors(apiError, ['name', 'address', 'city']), apiError }
    }
  }, initialState)

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.apiError && <ApiErrorAlert error={state.apiError} />}
      <TextField
        label="עיר"
        name="city"
        required
        autoFocus
        list={listId}
        defaultValue={state.values.city}
        error={state.fieldErrors.city}
        hint="לקוחות מחפשים הסעות לפי העיר: כדאי לבחור עיר קיימת מהרשימה."
      />
      {/* <datalist>: the browser's own suggestions, while still allowing a new city. */}
      <datalist id={listId}>
        {cities.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>
      <TextField label="שם התחנה" name="name" required defaultValue={state.values.name} error={state.fieldErrors.name} hint="למשל: בני ברק - רבי עקיבא" />
      <TextField label="כתובת" name="address" required defaultValue={state.values.address} error={state.fieldErrors.address} />
      <FormButtons isPending={isPending} onCancel={onCancel} />
    </form>
  )
}

function TextArea({ label, name, defaultValue, error }: { label: string; name: string; defaultValue: string; error?: string }) {
  const id = useId()
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={3}
        className={styles.textarea}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

function FormButtons({ isPending, onCancel }: { isPending: boolean; onCancel: () => void }) {
  return (
    <div className={styles.buttons}>
      <Button variant="ghost" onClick={onCancel} disabled={isPending}>
        ביטול
      </Button>
      <Button type="submit" icon={<Save />} isLoading={isPending}>
        שמירה
      </Button>
    </div>
  )
}
