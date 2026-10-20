import { useActionState, useState } from 'react'
import { Mail, Phone, Plus, UserPlus } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import type { RegisterRequest } from '@/api/types'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, Card, EmptyState, Modal, PasswordField, Skeleton, TextField, useToast } from '@/components/ui'
import { hasErrors, validateRegister, type FieldErrors } from '@/features/auth/validation'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toApiError, type ApiError } from '@/lib/errors'
import { adminKeys, useAdminMutation, useDrivers } from '../hooks/useAdminData'
import shared from './AdminPages.module.css'
import formStyles from '../components/CatalogForms.module.css'

/**
 * The drivers, and adding a new one. Customers register themselves; a driver is added by the admin,
 * who gives them their email and first password.
 */
export default function DriversPage() {
  useDocumentTitle('ניהול נהגים')
  const { data: drivers, isPending, error } = useDrivers()
  const toast = useToast()
  const [adding, setAdding] = useState(false)
  const create = useAdminMutation(adminApi.createDriver, [adminKeys.drivers])

  async function save(request: RegisterRequest) {
    const driver = await create.mutateAsync(request)
    toast.success('הנהג נוסף', `${driver.fullName} יכול להתחבר עם ${driver.email}`)
    setAdding(false)
  }

  return (
    <section aria-labelledby="drivers-title">
      <div className={shared.toolbar}>
        <div>
          <h2 id="drivers-title" className={shared.title}>
            נהגים
          </h2>
          <p className={shared.lead}>הנהגים שאפשר לשבץ להסעות. כל נהג רואה את ההסעות שלו ואת רשימת הנוסעים.</p>
        </div>
        <Button icon={<Plus />} onClick={() => setAdding(true)}>
          נהג חדש
        </Button>
      </div>

      {error ? (
        <ApiErrorAlert error={toApiError(error)} />
      ) : isPending ? (
        <Skeleton height="10rem" radius="22px" />
      ) : drivers.length === 0 ? (
        <EmptyState
          visual={<UserPlus />}
          title="עוד אין נהגים"
          action={
            <Button icon={<Plus />} onClick={() => setAdding(true)}>
              נהג ראשון
            </Button>
          }
        />
      ) : (
        <ul className={shared.cards}>
          {drivers.map((driver, index) => (
            <li key={driver.id} className={shared.item} style={{ animationDelay: `${index * 110}ms` }}>
              <Card padding="md">
                <h3 className={shared.cardTitle}>{driver.fullName}</h3>
                <p className={shared.rowSub}>
                  <Mail aria-hidden="true" width={14} height={14} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                  <bdi dir="ltr">{driver.email}</bdi>
                </p>
                <p className={shared.rowSub}>
                  <Phone aria-hidden="true" width={14} height={14} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                  <a href={`tel:${driver.phone}`}>
                    <bdi dir="ltr">{driver.phone}</bdi>
                  </a>
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="נהג חדש">
        {adding && <DriverForm onSubmit={save} onCancel={() => setAdding(false)} />}
      </Modal>
    </section>
  )
}

interface DriverFormState {
  values: Omit<RegisterRequest, 'password'>
  fieldErrors: FieldErrors<RegisterRequest>
  apiError: ApiError | null
}

const empty: DriverFormState = { values: { fullName: '', email: '', phone: '' }, fieldErrors: {}, apiError: null }

/** The registration fields and rules (validateRegister), sent to the admin endpoint instead. */
function DriverForm({ onSubmit, onCancel }: { onSubmit: (request: RegisterRequest) => Promise<unknown>; onCancel: () => void }) {
  const [state, formAction, isPending] = useActionState<DriverFormState, FormData>(async (_previous, formData) => {
    const request: RegisterRequest = {
      fullName: String(formData.get('fullName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
    }
    // The password is never kept in state: after a failed submit the admin types it again.
    const values = { fullName: request.fullName, email: request.email, phone: request.phone }
    const fieldErrors = validateRegister(request)
    if (hasErrors(fieldErrors)) return { values, fieldErrors, apiError: null }
    try {
      await onSubmit(request)
      return empty
    } catch (error) {
      const apiError = toApiError(error)
      if (apiError.status === 409) return { values, fieldErrors: { email: 'כבר יש משתמש עם האימייל הזה' }, apiError: null }
      return { values, fieldErrors: {}, apiError }
    }
  }, empty)

  return (
    <form action={formAction} className={formStyles.form} noValidate>
      {state.apiError && <ApiErrorAlert error={state.apiError} />}
      <TextField label="שם מלא" name="fullName" required autoFocus defaultValue={state.values.fullName} error={state.fieldErrors.fullName} />
      <TextField label="אימייל" name="email" type="email" dir="ltr" required defaultValue={state.values.email} error={state.fieldErrors.email} />
      <TextField label="טלפון" name="phone" type="tel" dir="ltr" required defaultValue={state.values.phone} error={state.fieldErrors.phone} />
      <PasswordField
        label="סיסמה ראשונית"
        name="password"
        dir="ltr"
        autoComplete="new-password"
        required
        error={state.fieldErrors.password}
        hint="לפחות 8 תווים, עם אות באנגלית וספרה. מסרו אותה לנהג."
      />
      <div className={formStyles.buttons}>
        <Button variant="ghost" onClick={onCancel} disabled={isPending}>
          ביטול
        </Button>
        <Button type="submit" icon={<UserPlus />} isLoading={isPending}>
          הוספת הנהג
        </Button>
      </div>
    </form>
  )
}
