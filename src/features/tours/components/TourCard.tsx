import { Link } from 'react-router'
import { usePrefetchTour } from '../hooks/useTourData'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import type { TourSummary } from '@/api/types'
import { Card, Skeleton } from '@/components/ui'
import { formatDay, formatPrice, formatTime } from '@/lib/format'
import { DepartureCountdown, RouteLine, SeatsMeter, StatusBadge } from './TourBits'
import styles from './TourCard.module.css'

/** One tour in a list. The whole card is clickable through its title link (a stretched link, see the CSS). */
export function TourCard({ tour }: { tour: TourSummary }) {
  const prefetch = usePrefetchTour(tour.id)
  return (
    <Card as="article" padding="md" interactive className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>
          <Link to={`/tours/${tour.id}`} viewTransition className={styles.link} onMouseEnter={prefetch} onFocus={prefetch}>
            {tour.destinationName}
          </Link>
        </h3>
        <StatusBadge status={tour.displayStatus} availableSeats={tour.availableSeats} />
      </header>

      <p className={styles.when}>
        <CalendarDays aria-hidden="true" />
        <span>
          {formatDay(tour.departureAt)} ·{' '}
          {/* A time range inside RTL text would read backwards ("14:00–09:00") without an LTR island. */}
          <bdi dir="ltr">
            {formatTime(tour.departureAt)}–{formatTime(tour.returnAt)}
          </bdi>
        </span>
      </p>

      <RouteLine cities={tour.cities} destination={tour.city} />

      <SeatsMeter capacity={tour.capacity} availableSeats={tour.availableSeats} />

      <footer className={styles.footer}>
        <div>
          <span className={styles.price}>{formatPrice(tour.price)}</span>
          <span className={styles.perSeat}> למקום</span>
        </div>
        <DepartureCountdown departureAt={tour.departureAt} />
        <ArrowLeft className={styles.arrow} aria-hidden="true" />
      </footer>
    </Card>
  )
}

/** The same shape, shimmering, while tours load: the page does not jump when they arrive. */
export function TourCardSkeleton() {
  return (
    <Card padding="md" className={styles.card} aria-hidden="true">
      <Skeleton width="55%" height="1.4rem" />
      <Skeleton width="70%" />
      <Skeleton width="85%" />
      <Skeleton height="6px" radius="999px" />
      <Skeleton width="40%" height="1.3rem" />
    </Card>
  )
}
