import { useReducer } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CalendarCheck, Pencil, Ticket } from 'lucide-react'
import { toursApi } from '@/api/tours.api'
import type { TourDetails } from '@/api/types'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Alert, Button, ButtonLink, useToast } from '@/components/ui'
import { TourClosedNotice } from '@/features/tours/components/TourBits'
import { tourKeys } from '@/features/tours/hooks/useTourData'
import { toApiError } from '@/lib/errors'
import { formatPrice, formatSeats, formatTime } from '@/lib/format'
import { bookingFlowReducer, initialBookingFlow } from '../bookingFlow'
import { bookingKeys, useCreateBooking, useMyBookings } from '../hooks/useBookings'
import { SeatStepper } from './SeatStepper'
import { StopPicker } from './StopPicker'
import styles from './BookingPanel.module.css'

interface BookingPanelProps {
  tour: TourDetails
  /** Lets the page highlight the chosen stop on the route. */
  onStopSelected?: (pickupPointId: number) => void
}

/** A customer books seats on an open tour: choose a stop and a count, review, confirm. */
export function BookingPanel({ tour, onStopSelected }: BookingPanelProps) {
  const [flow, dispatch] = useReducer(bookingFlowReducer, initialBookingFlow)
  const createBooking = useCreateBooking(tour.id)
  const { data: myBookings } = useMyBookings()
  const queryClient = useQueryClient()
  const toast = useToast()

  // The server allows one active booking per customer per tour. Derived from the cached list, not stored.
  const existing = myBookings?.find((b) => b.tourId === tour.id && b.status === 'Active')
  const maxSeats = Math.max(1, Math.min(tour.maxSeatsPerBooking, tour.availableSeats))
  // The limit can drop after a refetch; the shown count follows it during render instead of in an effect.
  const seats = Math.min(flow.seats, maxSeats)
  const stop = tour.pickupPoints.find((p) => p.pickupPointId === flow.pickupPointId)

  if (flow.step === 'done' && flow.booking) {
    return (
      <div className={styles.done}>
        <SuccessMark />
        <h3 className={styles.doneTitle}>ההזמנה נקלטה</h3>
        <p className={styles.doneText}>
          {formatSeats(flow.booking.seatsCount)} מ{flow.booking.pickupPointName}, איסוף משוער בשעה{' '}
          <strong>{formatTime(flow.booking.estimatedPickupTimeUtc)}</strong>.
        </p>
        <ButtonLink to="/my-bookings" viewTransition fullWidth icon={<Ticket />}>
          להזמנות שלי
        </ButtonLink>
      </div>
    )
  }

  if (existing) {
    return (
      <Alert
        tone="success"
        title="כבר יש לכם מקום בהסעה הזו"
        action={
          <ButtonLink to="/my-bookings" viewTransition variant="secondary" size="sm">
            להזמנות שלי
          </ButtonLink>
        }
      >
        {formatSeats(existing.seatsCount)} מ{existing.pickupPointName}, איסוף משוער בשעה {formatTime(existing.estimatedPickupTimeUtc)}.
      </Alert>
    )
  }

  if (tour.displayStatus !== 'Scheduled' || tour.availableSeats === 0) {
    return <TourClosedNotice availableSeats={tour.availableSeats} />
  }

  function confirm() {
    if (flow.pickupPointId === null) return
    const requested = seats
    createBooking.mutate(
      { pickupPointId: flow.pickupPointId, seatsCount: requested },
      {
        onSuccess: (booking) => {
          dispatch({ type: 'booked', booking })
          toast.success('ההזמנה נקלטה', `${formatSeats(booking.seatsCount)} אל ${booking.destinationName}`)
        },
        onError: async (error) => {
          if (toApiError(error).status !== 409) return
          // 409: someone changed the tour first. Rather than only showing an error, look at what is true now:
          // the fresh tour (how many seats are left) and the fresh booking list (did this customer already book?).
          try {
            const [fresh] = await Promise.all([
              queryClient.fetchQuery({ queryKey: tourKeys.detail(tour.id), queryFn: () => toursApi.get(tour.id), staleTime: 0 }),
              queryClient.refetchQueries({ queryKey: bookingKeys.mine }),
            ])
            if (fresh.availableSeats < requested) {
              createBooking.reset()
              dispatch({ type: 'seatsTaken', requested, available: fresh.availableSeats })
            }
          } catch {
            // The check itself failed (for example, the connection dropped): the 409 message stays on screen.
          }
        },
      },
    )
  }

  const notice = flow.notice && (
    <Alert tone="warning" title="חלק מהמקומות נתפסו ממש עכשיו">
      ביקשתם {formatSeats(flow.notice.requested)},{' '}
      {flow.notice.available === 1 ? 'ונשאר מקום אחד' : `ונשארו ${formatSeats(flow.notice.available)}`}.{' '}
      {flow.notice.available > 0 ? 'עדכנו את ההזמנה בשבילכם, ונשאר רק לאשר.' : 'אפשר לבחור הסעה אחרת.'}
    </Alert>
  )

  if (flow.step === 'confirm' && stop) {
    return (
      <div className={styles.panel} key="confirm">
        {notice}
        <h3 className={styles.stepTitle}>אישור ההזמנה</h3>
        <dl className={styles.review}>
          <div>
            <dt>תחנה</dt>
            <dd>{stop.name}</dd>
          </div>
          <div>
            <dt>איסוף משוער</dt>
            <dd>{formatTime(stop.estimatedPickupTimeUtc)}</dd>
          </div>
          <div>
            <dt>מקומות</dt>
            {/* key: a new element when a 409 corrects the count, so the number fades in again. */}
            <dd key={seats} className={styles.changed}>
              {seats}
            </dd>
          </div>
          <div className={styles.totalRow}>
            <dt>סה״כ לתשלום</dt>
            <dd key={seats} className={styles.changed}>
              {formatPrice(tour.price * seats)}
            </dd>
          </div>
        </dl>
        {createBooking.error && <ApiErrorAlert error={toApiError(createBooking.error)} />}
        <Button size="lg" fullWidth icon={<CalendarCheck />} isLoading={createBooking.isPending} onClick={confirm}>
          אישור והזמנה
        </Button>
        <Button
          variant="ghost"
          fullWidth
          icon={<Pencil />}
          disabled={createBooking.isPending}
          onClick={() => {
            createBooking.reset()
            dispatch({ type: 'edit' })
          }}
        >
          חזרה לעריכה
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.panel} key="choose">
      {notice}
      <StopPicker
        stops={tour.pickupPoints}
        value={flow.pickupPointId}
        onChange={(pickupPointId) => {
          dispatch({ type: 'selectStop', pickupPointId })
          onStopSelected?.(pickupPointId)
        }}
      />
      <SeatStepper value={seats} max={maxSeats} onChange={(value) => dispatch({ type: 'setSeats', seats: value, max: maxSeats })} />
      <p className={styles.total}>
        <span>סה״כ</span>
        <strong key={seats} className={styles.changed}>
          {formatPrice(tour.price * seats)}
        </strong>
      </p>
      <Button size="lg" fullWidth disabled={flow.pickupPointId === null} onClick={() => dispatch({ type: 'review' })}>
        <span className={styles.next}>
          המשך לאישור
          <ArrowLeft aria-hidden="true" />
        </span>
      </Button>
      {flow.pickupPointId === null && <p className={styles.hint}>בחרו תחנה כדי להמשיך</p>}
    </div>
  )
}

/** A circle and a check that draw themselves once, then a slow, faint glow behind them. */
function SuccessMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 64 64" aria-hidden="true">
      <circle className={styles.markGlow} cx="32" cy="32" r="26" />
      <circle className={styles.markCircle} cx="32" cy="32" r="26" pathLength={1} />
      <path className={styles.markCheck} d="M21 33 L29 41 L44 24" pathLength={1} />
    </svg>
  )
}
