import { Clock } from 'lucide-react'
import type { TourDisplayStatus } from '@/api/types'
import { Badge } from '@/components/ui'
import { useInView } from '@/hooks/useInView'
import { useNow } from '@/hooks/useNow'
import { cx } from '@/lib/cx'
import { formatRelativeDeparture, formatSeats } from '@/lib/format'
import styles from './TourBits.module.css'

/* Small building blocks shared by the tour card, the tours list and the tour page. */

const statusText: Record<TourDisplayStatus, string> = {
  Scheduled: 'מתוכננת',
  InProgress: 'בדרך',
  Completed: 'הסתיימה',
  Cancelled: 'בוטלה',
}

export function StatusBadge({ status, availableSeats }: { status: TourDisplayStatus; availableSeats: number }) {
  if (status === 'Scheduled' && availableSeats === 0) return <Badge tone="danger">מלאה</Badge>
  const tone = status === 'Cancelled' ? 'danger' : status === 'Scheduled' ? 'success' : status === 'InProgress' ? 'info' : 'neutral'
  return <Badge tone={tone}>{statusText[status]}</Badge>
}

/** "בעוד 3 ימים", refreshed every minute while on screen. */
export function DepartureCountdown({ departureAt, className }: { departureAt: string; className?: string }) {
  const now = useNow()
  return (
    <span className={cx(styles.countdown, className)}>
      <Clock aria-hidden="true" />
      {formatRelativeDeparture(departureAt, now)}
    </span>
  )
}

/**
 * How full the tour is. The bar shows seats taken; the text says what is left.
 * Under a third left turns gold ("last seats"), none left turns clay.
 */
export function SeatsMeter({ capacity, availableSeats }: { capacity: number; availableSeats: number }) {
  // The bar fills from empty the first time it scrolls into view (a CSS transition on its width).
  const [ref, inView] = useInView<HTMLDivElement>()
  const taken = capacity - availableSeats
  const ratioLeft = capacity > 0 ? availableSeats / capacity : 0
  const level = availableSeats === 0 ? 'full' : ratioLeft <= 1 / 3 ? 'low' : 'ok'
  const label =
    level === 'full' ? 'כל המקומות נתפסו' : level === 'low' ? `נותרו ${formatSeats(availableSeats)} אחרונים` : `נותרו ${formatSeats(availableSeats)}`

  return (
    <div className={styles.meter} data-level={level} ref={ref}>
      <div
        className={styles.track}
        role="meter"
        aria-label="תפוסה"
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-valuenow={taken}
        aria-valuetext={label}
      >
        <span className={styles.fill} style={{ width: inView && capacity > 0 ? `${(taken / capacity) * 100}%` : 0 }} />
      </div>
      <span className={styles.meterText}>
        {label}
        <span className={styles.meterOf}> מתוך {capacity}</span>
      </span>
    </div>
  )
}

/** The route's cities on a dashed line: the first stop in olive, the destination end in gold. */
export function RouteLine({ cities, destination }: { cities: string[]; destination?: string }) {
  return (
    <ol className={styles.route} aria-label="מסלול ההסעה">
      {cities.map((city) => (
        <li key={city} className={styles.stop}>
          <span className={styles.dot} aria-hidden="true" />
          {city}
        </li>
      ))}
      {destination && (
        <li className={cx(styles.stop, styles.end)}>
          <span className={styles.dot} aria-hidden="true" />
          {destination}
        </li>
      )}
    </ol>
  )
}
