import { Link } from 'react-router'
import { MapPin, Ticket, Users, X } from 'lucide-react'
import type { Booking } from '@/api/types'
import { Badge, Button, Card } from '@/components/ui'
import { DepartureCountdown } from '@/features/tours/components/TourBits'
import { cx } from '@/lib/cx'
import { formatDay, formatPrice, formatSeats, formatTime } from '@/lib/format'
import { canCancel } from '../bookingRules'
import styles from './BookingCard.module.css'

interface BookingCardProps {
  booking: Booking
  onCancel?: (booking: Booking) => void
}

/** One booking as a ticket: the trip on one side, the stop and seats on the other, joined by a perforation. */
export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const cancelled = booking.status === 'Cancelled'

  return (
    <Card as="article" padding="none" className={cx(styles.ticket, cancelled && styles.faded)}>
      <div className={styles.trip}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>
            <Link to={`/tours/${booking.tourId}`} viewTransition className={styles.link}>
              {booking.destinationName}
            </Link>
          </h3>
          <BookingStatus booking={booking} />
        </div>
        <p className={styles.day}>
          {formatDay(booking.departureAt)} ·{' '}
          <bdi dir="ltr">
            {formatTime(booking.departureAt)}–{formatTime(booking.returnAt)}
          </bdi>
        </p>
        {!cancelled && booking.tourDisplayStatus === 'Scheduled' && <DepartureCountdown departureAt={booking.departureAt} />}
      </div>

      <div className={styles.stub}>
        <p className={styles.row}>
          <MapPin aria-hidden="true" />
          <span>
            <span className={styles.stopName}>{booking.pickupPointName}</span>
            <span className={styles.muted}>{booking.pickupPointAddress}</span>
          </span>
        </p>
        <p className={styles.row}>
          <Ticket aria-hidden="true" />
          <span>
            איסוף משוער <strong className={styles.time}>{formatTime(booking.estimatedPickupTimeUtc)}</strong>
          </span>
        </p>
        <p className={styles.row}>
          <Users aria-hidden="true" />
          <span>
            {formatSeats(booking.seatsCount)} · {formatPrice(booking.totalPrice)}
          </span>
        </p>
        {onCancel && canCancel(booking) && (
          <Button variant="ghost" size="sm" icon={<X />} className={styles.cancel} onClick={() => onCancel(booking)}>
            ביטול ההזמנה
          </Button>
        )}
      </div>
    </Card>
  )
}

function BookingStatus({ booking }: { booking: Booking }) {
  // The tour was cancelled by the company: said first, so the customer knows it was not their own cancellation.
  if (booking.tourDisplayStatus === 'Cancelled') return <Badge tone="danger">ההסעה בוטלה</Badge>
  if (booking.status === 'Cancelled') return <Badge tone="danger">בוטלה</Badge>
  switch (booking.tourDisplayStatus) {
    case 'Scheduled':
      return <Badge tone="success">פעילה</Badge>
    case 'InProgress':
      return <Badge tone="info">בדרך</Badge>
    case 'Completed':
      return <Badge tone="neutral">הסתיימה</Badge>
  }
}
