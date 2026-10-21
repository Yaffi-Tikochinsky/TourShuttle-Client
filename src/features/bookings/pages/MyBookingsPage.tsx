import { useOptimistic, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router'
import { Search } from 'lucide-react'
import type { Booking } from '@/api/types'
import { Blob } from '@/components/art/Blob'
import { Dust } from '@/components/art/Dust'
import { EmptyBench } from '@/components/art/Ornaments'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, ButtonLink, EmptyState, Modal, Skeleton, useToast } from '@/components/ui'
import { useAuth } from '@/features/auth/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cx } from '@/lib/cx'
import { toApiError } from '@/lib/errors'
import { formatDay, formatSeats, formatTime } from '@/lib/format'
import { splitBookings } from '../bookingRules'
import { BookingCard } from '../components/BookingCard'
import { useCancelBooking, useMyBookings } from '../hooks/useBookings'
import styles from './MyBookingsPage.module.css'

type Tab = 'upcoming' | 'history'

const markCancelled = (bookings: Booking[], id: number): Booking[] =>
  bookings.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))

export default function MyBookingsPage() {
  useDocumentTitle('ההזמנות שלי')
  const { user } = useAuth()
  const { data, isPending, error, refetch } = useMyBookings()
  const cancelBooking = useCancelBooking()
  const toast = useToast()

  // The tab lives in the URL (?tab=history), so a refresh or a shared link opens the same tab.
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: Tab = searchParams.get('tab') === 'history' ? 'history' : 'upcoming'

  /*
    Optimistic cancel. useOptimistic shows a temporary version of the list while an async action runs:
    the booking looks cancelled the moment the customer confirms. When the action ends, React drops the
    temporary version and shows `data` again: the server's fresh list on success, the untouched list on failure
    (so a failed cancel "rolls back" by itself, with no undo code).
  */
  const [bookings, cancelOptimistically] = useOptimistic(data ?? [], markCancelled)
  const [, startTransition] = useTransition()
  const [toCancel, setToCancel] = useState<Booking | null>(null)

  function confirmCancel() {
    const booking = toCancel
    if (!booking) return
    setToCancel(null)
    startTransition(async () => {
      cancelOptimistically(booking.id)
      try {
        await cancelBooking.mutateAsync(booking.id)
        const returned = booking.seatsCount === 1 ? 'מקום אחד חזר' : `${booking.seatsCount} מקומות חזרו`
        toast.success('ההזמנה בוטלה', `${returned} להסעה אל ${booking.destinationName}.`)
      } catch (cause) {
        const apiError = toApiError(cause)
        toast.error('הביטול לא הצליח', apiError.detail ?? apiError.headline)
      }
    })
  }

  const { upcoming, history } = splitBookings(bookings)
  const shown = tab === 'upcoming' ? upcoming : history
  const firstName = user?.fullName.split(' ')[0]

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <Blob shape={2} tone={1} style={{ top: -150, insetInlineStart: -140, width: 440 }} />
        <Dust count={12} seed={4} />
        <div className="container">
          <h1 className={styles.title}>ההזמנות שלי</h1>
          <p className={styles.lead}>{firstName ? `שלום ${firstName}, ` : ''}כאן כל המקומות ששמרתם, וזמני האיסוף המשוערים.</p>
        </div>
      </section>

      <div className="container">
        <div className={styles.tabs} role="tablist" aria-label="סינון הזמנות">
          <TabButton current={tab} value="upcoming" count={upcoming.length} onSelect={() => setSearchParams({}, { replace: true })}>
            קרובות
          </TabButton>
          <TabButton current={tab} value="history" count={history.length} onSelect={() => setSearchParams({ tab: 'history' }, { replace: true })}>
            היסטוריה
          </TabButton>
        </div>

        <div role="tabpanel" aria-labelledby="bookings-panel-title">
          <h2 id="bookings-panel-title" className="visually-hidden">
            {tab === 'upcoming' ? 'הזמנות קרובות' : 'היסטוריית הזמנות'}
          </h2>
          {error ? (
            <ApiErrorAlert
              error={toApiError(error)}
              action={
                <Button variant="secondary" size="sm" onClick={() => void refetch()}>
                  לנסות שוב
                </Button>
              }
            />
          ) : isPending ? (
            <div className={styles.list} aria-busy="true" aria-label="טוען הזמנות">
              <Skeleton height="10rem" radius="22px" />
              <Skeleton height="10rem" radius="22px" />
            </div>
          ) : shown.length === 0 ? (
            <EmptyState
              visual={<EmptyBench className={styles.emptyArt} />}
              title={tab === 'upcoming' ? 'אין לכם הסעות קרובות' : 'עוד אין היסטוריה'}
              description={tab === 'upcoming' ? 'מקום על הספסל מחכה לכם. בחרו הסעה ושמרו מקום בכמה לחיצות.' : 'הסעות שהסתיימו או בוטלו יופיעו כאן.'}
              action={
                tab === 'upcoming' && (
                  <ButtonLink to="/tours" viewTransition icon={<Search />}>
                    לחיפוש הסעה
                  </ButtonLink>
                )
              }
            />
          ) : (
            // key={tab}: switching tabs mounts a fresh list, so its cards rise in again one after another.
            <ul className={styles.list} key={tab}>
              {shown.map((booking, index) => (
                <li key={booking.id} className={styles.item} style={{ animationDelay: `${index * 140}ms` }}>
                  <BookingCard booking={booking} onCancel={setToCancel} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal
        open={toCancel !== null}
        onClose={() => setToCancel(null)}
        title="לבטל את ההזמנה?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setToCancel(null)}>
              השאירו אותה
            </Button>
            <Button variant="danger" onClick={confirmCancel}>
              כן, לבטל
            </Button>
          </>
        }
      >
        {toCancel && (
          <p>
            {formatSeats(toCancel.seatsCount)} אל <strong>{toCancel.destinationName}</strong>, {formatDay(toCancel.departureAt)} בשעה{' '}
            {formatTime(toCancel.estimatedPickupTimeUtc)}. המקומות יחזרו להסעה ויהיו פתוחים לאחרים.
          </p>
        )}
      </Modal>
    </div>
  )
}

interface TabButtonProps {
  current: Tab
  value: Tab
  count: number
  onSelect: () => void
  children: string
}

function TabButton({ current, value, count, onSelect, children }: TabButtonProps) {
  const selected = current === value
  return (
    <button type="button" role="tab" aria-selected={selected} className={cx(styles.tab, selected && styles.tabSelected)} onClick={onSelect}>
      {children}
      <span className={styles.count}>{count}</span>
    </button>
  )
}
