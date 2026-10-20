import { Link, useParams } from 'react-router'
import { ArrowRight, Printer, RotateCcw } from 'lucide-react'
import type { TourPassengers } from '@/api/types'
import { Blob } from '@/components/art/Blob'
import { LostPath } from '@/components/art/Ornaments'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, ButtonLink, EmptyState, Skeleton } from '@/components/ui'
import { useAuth } from '@/features/auth/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { toApiError } from '@/lib/errors'
import { formatDay, formatSeats, formatTime } from '@/lib/format'
import { StopCard } from '../components/StopCard'
import { usePassengers } from '../hooks/useDriverData'
import styles from './PassengersPage.module.css'

export default function PassengersPage() {
  const id = Number(useParams().id)
  const { user } = useAuth()
  const { data, isPending, error, dataUpdatedAt } = usePassengers(id)
  useDocumentTitle(data ? `נוסעים: ${data.destinationName}` : 'רשימת נוסעים')

  const back = user?.role === 'Admin' ? { to: `/tours/${id}`, label: 'לדף ההסעה' } : { to: '/driver', label: 'להסעות שלי' }

  if (error) {
    const apiError = toApiError(error)
    if (apiError.status === 404 || apiError.status === 403) {
      return (
        <div className="container">
          <EmptyState
            visual={<LostPath className={styles.lostArt} />}
            title={apiError.status === 404 ? 'ההסעה הזו לא נמצאה' : 'ההסעה הזו לא משובצת לך'}
            description="רשימת הנוסעים פתוחה רק לנהג של ההסעה ולמנהל."
            action={<ButtonLink to={back.to}>{back.label}</ButtonLink>}
          />
        </div>
      )
    }
    return (
      <div className="container">
        <ApiErrorAlert error={apiError} />
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="container" style={{ paddingBlock: 'var(--space-7)' }} aria-busy="true" aria-label="טוען את רשימת הנוסעים">
        <Skeleton width="45%" height="2.5rem" />
        <div style={{ height: 'var(--space-6)' }} />
        <Skeleton height="8rem" radius="14px" />
        <div style={{ height: 'var(--space-4)' }} />
        <Skeleton height="8rem" radius="14px" />
      </div>
    )
  }

  // key: each tour gets its own board, so its "on board" marks are read from its own storage key.
  return <PassengerBoard key={data.tourId} data={data} back={back} updatedAt={dataUpdatedAt} />
}

interface PassengerBoardProps {
  data: TourPassengers
  back: { to: string; label: string }
  updatedAt: number
}

function PassengerBoard({ data, back, updatedAt }: PassengerBoardProps) {
  // The driver's own check-off, kept on this device only: a working aid, not data the server needs.
  const [marked, setMarked] = useLocalStorage<number[]>(`tourshuttle.boarded.${data.tourId}`, [])

  // A booking cancelled after it was marked no longer counts: only ids still on the list are used.
  const current = data.pickupPoints.flatMap((stop) => stop.passengers)
  const boarded = new Set(marked.filter((bookingId) => current.some((p) => p.bookingId === bookingId)))
  const boardedSeats = current.filter((p) => boarded.has(p.bookingId)).reduce((sum, p) => sum + p.seatsCount, 0)
  const progress = data.totalSeats > 0 ? boardedSeats / data.totalSeats : 0

  const toggle = (bookingId: number) =>
    setMarked((ids) => (ids.includes(bookingId) ? ids.filter((x) => x !== bookingId) : [...ids, bookingId]))

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <Blob shape={1} tone={2} style={{ top: -170, insetInlineStart: -150, width: 460 }} />
        <div className="container">
          <Link to={back.to} viewTransition className={styles.back}>
            <ArrowRight aria-hidden="true" />
            {back.label}
          </Link>
          <h1 className={styles.title}>{data.destinationName}</h1>
          <p className={styles.subtitle}>
            {formatDay(data.departureAt)} · יציאה ב-{formatTime(data.departureAt)}
          </p>

          <div className={styles.summary}>
            <div className={styles.progress}>
              <div className={styles.progressText}>
                <strong>{data.totalSeats === 0 ? 'עוד אין נוסעים רשומים' : `עלו ${boardedSeats} מתוך ${formatSeats(data.totalSeats)}`}</strong>
                <span className={styles.updated}>מתעדכן כל דקה · עודכן ב-{formatTime(new Date(updatedAt).toISOString())}</span>
              </div>
              <div
                className={styles.track}
                role="progressbar"
                aria-label="נוסעים שעלו"
                aria-valuemin={0}
                aria-valuemax={data.totalSeats}
                aria-valuenow={boardedSeats}
              >
                <span className={styles.fill} style={{ transform: `scaleX(${progress})` }} />
              </div>
            </div>
            <div className={styles.tools}>
              <Button variant="secondary" size="sm" icon={<Printer />} onClick={() => window.print()}>
                הדפסה
              </Button>
              <Button variant="ghost" size="sm" icon={<RotateCcw />} disabled={boarded.size === 0} onClick={() => setMarked([])}>
                ניקוי סימונים
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <h2 className="visually-hidden">תחנות האיסוף והנוסעים</h2>
        <ol className={styles.route}>
          {data.pickupPoints.map((stop, index) => (
            <StopCard key={stop.pickupPointId} stop={stop} boarded={boarded} onToggle={toggle} index={index} />
          ))}
        </ol>
      </div>
    </div>
  )
}
