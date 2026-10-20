import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowRight, Lock, Save } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import type { TourDetails, TourRequest } from '@/api/types'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Alert, Button, Card, Select, Skeleton, TextField, useToast } from '@/components/ui'
import { hasErrors, type FieldErrors } from '@/features/auth/validation'
import { tourKeys, useDestinations, useTour } from '@/features/tours/hooks/useTourData'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toApiError, type ApiError } from '@/lib/errors'
import { israelInputToUtc, utcToIsraelInput } from '@/lib/israelTime'
import { validateTour } from '../adminValidation'
import { RouteBuilder } from '../components/RouteBuilder'
import { useAdminMutation, useDrivers, usePickupPoints } from '../hooks/useAdminData'
import styles from './TourFormPage.module.css'

/** /admin/tours/new and /admin/tours/:id/edit: the same form, empty or filled with the tour. */
export default function TourFormPage() {
  const id = Number(useParams().id)
  const isEdit = Number.isInteger(id) && id > 0
  const { data: tour, isPending, error } = useTour(isEdit ? id : 0)
  useDocumentTitle(isEdit ? 'עריכת הסעה' : 'הסעה חדשה')

  return (
    <div className={`container ${styles.page}`}>
      <Link to="/admin/tours" viewTransition className={styles.back}>
        <ArrowRight aria-hidden="true" />
        לכל ההסעות
      </Link>
      <h1 className={styles.title}>{isEdit ? 'עריכת הסעה' : 'הסעה חדשה'}</h1>

      {!isEdit ? (
        <TourForm />
      ) : error ? (
        <ApiErrorAlert error={toApiError(error)} />
      ) : isPending ? (
        <Skeleton height="30rem" radius="22px" />
      ) : (
        // key: if the admin moves from one tour's form to another's, the form starts over with that tour's values.
        <TourForm key={tour.id} tour={tour} />
      )}
    </div>
  )
}

/** The form's own values: what the inputs show (text), converted to a TourRequest only on submit. */
interface Draft {
  destinationId: string
  driverId: string
  departure: string
  returnAt: string
  capacity: string
  maxSeats: string
  price: string
  minutes: string
  route: number[]
}

function draftFrom(tour?: TourDetails): Draft {
  return {
    destinationId: tour ? String(tour.destinationId) : '',
    driverId: tour?.driverId ? String(tour.driverId) : '',
    departure: tour ? utcToIsraelInput(tour.departureAt) : '',
    returnAt: tour ? utcToIsraelInput(tour.returnAt) : '',
    capacity: tour ? String(tour.capacity) : '40',
    maxSeats: tour ? String(tour.maxSeatsPerBooking) : '6',
    price: tour ? String(tour.price) : '',
    // The custom value only: empty means "decided by the departure hour", and the effective value is the placeholder.
    minutes: tour?.customMinutesBetweenPickupPoints ? String(tour.customMinutesBetweenPickupPoints) : '',
    route: tour ? tour.pickupPoints.map((p) => p.pickupPointId) : [],
  }
}

function toRequest(draft: Draft): TourRequest {
  return {
    destinationId: Number(draft.destinationId),
    driverId: draft.driverId ? Number(draft.driverId) : null,
    departureAt: israelInputToUtc(draft.departure) ?? '',
    returnAt: israelInputToUtc(draft.returnAt) ?? '',
    capacity: Number(draft.capacity),
    maxSeatsPerBooking: Number(draft.maxSeats),
    price: draft.price === '' ? Number.NaN : Number(draft.price),
    minutesBetweenPickupPoints: draft.minutes === '' ? null : Number(draft.minutes),
    pickupPointIds: draft.route,
  }
}

const FOUR_HOURS = 4 * 60 * 60_000

/**
 * Controlled inputs this time (unlike the login form): the route builder and the "return time follows departure"
 * help need the current values while the admin types, not only when the form is sent.
 */
function TourForm({ tour }: { tour?: TourDetails }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { data: destinations } = useDestinations()
  const { data: drivers } = useDrivers()
  const { data: points } = usePickupPoints()

  const [draft, setDraft] = useState(() => draftFrom(tour))
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TourRequest>>({})
  const [apiError, setApiError] = useState<ApiError | null>(null)

  const invalidates = [tourKeys.all]
  const create = useAdminMutation(adminApi.createTour, invalidates)
  const update = useAdminMutation((request: TourRequest) => adminApi.updateTour(tour!.id, request), invalidates)
  const isSaving = create.isPending || update.isPending

  // Customers booked this destination, time and route: the server refuses to change them, so the form locks them.
  const bookedSeats = tour ? tour.capacity - tour.availableSeats : 0
  const locked = bookedSeats > 0

  const set = (field: keyof Draft) => (event: { target: { value: string } }) => setDraft((d) => ({ ...d, [field]: event.target.value }))

  /** A new departure moves an empty or earlier return time to four hours later: one less field to fix by hand. */
  function setDeparture(value: string) {
    setDraft((d) => {
      const departure = israelInputToUtc(value)
      const currentReturn = israelInputToUtc(d.returnAt)
      const needsReturn = departure && (!currentReturn || Date.parse(currentReturn) <= Date.parse(departure))
      return {
        ...d,
        departure: value,
        returnAt: needsReturn ? utcToIsraelInput(new Date(Date.parse(departure) + FOUR_HOURS).toISOString()) : d.returnAt,
      }
    })
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    const request = toRequest(draft)
    const errors = validateTour(request)
    if (bookedSeats > 0 && request.capacity < bookedSeats) errors.capacity = `כבר הוזמנו ${bookedSeats} מקומות`
    setFieldErrors(errors)
    setApiError(null)
    if (hasErrors(errors)) return

    try {
      if (tour) await update.mutateAsync(request)
      else await create.mutateAsync(request)
      toast.success(tour ? 'ההסעה עודכנה' : 'ההסעה נוצרה')
      navigate('/admin/tours', { viewTransition: true })
    } catch (cause) {
      const error = toApiError(cause)
      setApiError(error)
      const server: FieldErrors<TourRequest> = {}
      for (const field of Object.keys(request) as Array<keyof TourRequest>) {
        const message = error.fieldError(field)
        if (message) server[field] = message
      }
      setFieldErrors(server)
    }
  }

  const effectiveMinutes = tour?.minutesBetweenPickupPoints

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {locked && (
        <Alert tone="info" title={`בהסעה הזו כבר הוזמנו ${bookedSeats} מקומות`}>
          היעד, שעת היציאה והמסלול נעולים, כי לקוחות הזמינו לפיהם. אפשר לשנות נהג, מחיר, מספר מקומות ומרווח בין תחנות.
        </Alert>
      )}
      {apiError && <ApiErrorAlert error={apiError} title={apiError.status === 409 ? 'השינוי לא נשמר' : undefined} />}

      <div className={styles.grid}>
        <Card as="section" padding="lg" className={styles.section} aria-labelledby="when-title">
          <h2 id="when-title" className={styles.sectionTitle}>
            לאן ומתי
          </h2>
          <Select label="יעד" value={draft.destinationId} onChange={set('destinationId')} disabled={locked} icon={locked ? <Lock /> : undefined}>
            <option value="">בחרו יעד</option>
            {destinations?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} · {d.city}
              </option>
            ))}
          </Select>
          {fieldErrors.destinationId && <p className={styles.error}>{fieldErrors.destinationId}</p>}

          <div className={styles.pair}>
            <TextField
              label="יציאה (שעון ישראל)"
              type="datetime-local"
              dir="ltr"
              value={draft.departure}
              onChange={(event) => setDeparture(event.target.value)}
              disabled={locked}
              required
              error={fieldErrors.departureAt}
            />
            <TextField label="חזרה משוערת" type="datetime-local" dir="ltr" value={draft.returnAt} onChange={set('returnAt')} required error={fieldErrors.returnAt} />
          </div>

          <Select label="נהג" value={draft.driverId} onChange={set('driverId')}>
            <option value="">עדיין ללא נהג</option>
            {drivers?.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.fullName}
              </option>
            ))}
          </Select>
        </Card>

        <Card as="section" padding="lg" className={styles.section} aria-labelledby="seats-title">
          <h2 id="seats-title" className={styles.sectionTitle}>
            מקומות ומחיר
          </h2>
          <div className={styles.pair}>
            <TextField
              label="מקומות בהסעה"
              type="number"
              inputMode="numeric"
              min={Math.max(1, bookedSeats)}
              max={200}
              value={draft.capacity}
              onChange={set('capacity')}
              required
              error={fieldErrors.capacity}
              hint={bookedSeats > 0 ? `לפחות ${bookedSeats}, המקומות שכבר הוזמנו` : undefined}
            />
            <TextField
              label="עד כמה מקומות בהזמנה"
              type="number"
              inputMode="numeric"
              min={1}
              max={20}
              value={draft.maxSeats}
              onChange={set('maxSeats')}
              required
              error={fieldErrors.maxSeatsPerBooking}
            />
          </div>
          <TextField
            label="מחיר למקום (₪)"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.5"
            value={draft.price}
            onChange={set('price')}
            required
            error={fieldErrors.price}
          />
          <TextField
            label="דקות בין תחנה לתחנה"
            type="number"
            inputMode="numeric"
            min={1}
            max={30}
            value={draft.minutes}
            onChange={set('minutes')}
            placeholder={effectiveMinutes ? `${effectiveMinutes} (לפי שעת היציאה)` : 'לפי שעת היציאה'}
            error={fieldErrors.minutesBetweenPickupPoints}
            hint="ריק: המערכת מחשבת לפי שעת היציאה (1 בלילה, 3 בשעות העומס, 2 בשאר היום). מספר: גובר על החישוב."
          />
        </Card>
      </div>

      <Card as="section" padding="lg" className={styles.section} aria-labelledby="route-title">
        <h2 id="route-title" className={styles.sectionTitle}>
          מסלול האיסוף
          {locked && <Lock className={styles.lockIcon} aria-label="נעול" />}
        </h2>
        {points ? (
          <RouteBuilder
            points={points}
            value={draft.route}
            onChange={(route) => setDraft((d) => ({ ...d, route }))}
            disabled={locked}
            error={fieldErrors.pickupPointIds}
          />
        ) : (
          <Skeleton height="12rem" />
        )}
      </Card>

      <div className={styles.saveBar}>
        <Button variant="ghost" onClick={() => navigate('/admin/tours')} disabled={isSaving}>
          ביטול
        </Button>
        <Button type="submit" size="lg" icon={<Save />} isLoading={isSaving}>
          {tour ? 'שמירת השינויים' : 'יצירת ההסעה'}
        </Button>
      </div>
    </form>
  )
}
