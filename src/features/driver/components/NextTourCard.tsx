import { ArrowLeft, Users } from 'lucide-react'
import type { TourSummary } from '@/api/types'
import { SiteIllustration } from '@/components/art/SiteIllustration'
import { ButtonLink, Card } from '@/components/ui'
import { DepartureCountdown, RouteLine } from '@/features/tours/components/TourBits'
import { formatDay, formatSeats, formatTime } from '@/lib/format'
import { siteKindFor } from '@/lib/sites'
import { seatsTaken } from '../driverSchedule'
import styles from './NextTourCard.module.css'

/** The driver's next tour, large: when, where to, how many passengers, and the way to the passenger list. */
export function NextTourCard({ tour }: { tour: TourSummary }) {
  return (
    <Card as="section" padding="none" className={styles.card} aria-labelledby="next-tour-title">
      <div className={styles.text}>
        <p className="eyebrow">ההסעה הבאה שלך</p>
        <h2 id="next-tour-title" className={styles.title}>
          {tour.destinationName}
        </h2>
        <p className={styles.when}>
          {formatDay(tour.departureAt)} · יציאה ב-<strong>{formatTime(tour.departureAt)}</strong>
        </p>
        <DepartureCountdown departureAt={tour.departureAt} className={styles.countdown} />
        <RouteLine cities={tour.cities} destination={tour.city} />
        <p className={styles.passengers}>
          <Users aria-hidden="true" />
          {seatsTaken(tour) === 0 ? 'עוד אין נוסעים רשומים' : `${formatSeats(seatsTaken(tour))} תפוסים מתוך ${tour.capacity}`}
        </p>
        <ButtonLink to={`/driver/tours/${tour.id}`} viewTransition size="lg" className={styles.action}>
          <span className={styles.actionText}>
            לרשימת הנוסעים
            <ArrowLeft aria-hidden="true" />
          </span>
        </ButtonLink>
      </div>
      <div className={styles.art}>
        <SiteIllustration kind={siteKindFor(tour.destinationName, tour.city)} />
      </div>
    </Card>
  )
}
