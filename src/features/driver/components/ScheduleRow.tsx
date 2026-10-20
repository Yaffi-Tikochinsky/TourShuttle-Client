import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import type { TourSummary } from '@/api/types'
import { StatusBadge } from '@/features/tours/components/TourBits'
import { formatCities, formatTime } from '@/lib/format'
import { seatsTaken } from '../driverSchedule'
import styles from './ScheduleRow.module.css'

/** One tour in the driver's day: departure time, destination and route, passengers, a link to the list. */
export function ScheduleRow({ tour }: { tour: TourSummary }) {
  const taken = seatsTaken(tour)
  return (
    <Link to={`/driver/tours/${tour.id}`} viewTransition className={styles.row}>
      <time className={styles.time} dateTime={tour.departureAt}>
        {formatTime(tour.departureAt)}
      </time>
      <span className={styles.main}>
        <span className={styles.titleLine}>
          <span className={styles.destination}>{tour.destinationName}</span>
          <StatusBadge status={tour.displayStatus} availableSeats={tour.availableSeats} />
        </span>
        <span className={styles.route}>{formatCities(tour.cities)}</span>
      </span>
      <span className={styles.load} aria-label={`${taken} נוסעים מתוך ${tour.capacity}`}>
        {/* The ring shows how full the shuttle is; it fills once, then stays. */}
        <svg viewBox="0 0 36 36" className={styles.ring} aria-hidden="true">
          <circle cx="18" cy="18" r="15" className={styles.ringTrack} />
          {/* With no passengers, no fill at all: a round line cap would still draw a dot. */}
          {taken > 0 && (
            <circle
              cx="18"
              cy="18"
              r="15"
              pathLength={100}
              className={styles.ringFill}
              style={{ strokeDasharray: `${(taken / tour.capacity) * 100} 100` }}
            />
          )}
        </svg>
        <span className={styles.loadText}>
          <bdi dir="ltr">
            {taken}/{tour.capacity}
          </bdi>
        </span>
      </span>
      <ChevronLeft className={styles.chevron} aria-hidden="true" />
    </Link>
  )
}
