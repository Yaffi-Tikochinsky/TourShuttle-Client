import { Check, Phone } from 'lucide-react'
import type { StopPassengers } from '@/api/types'
import { cx } from '@/lib/cx'
import { formatSeats, formatTime } from '@/lib/format'
import styles from './StopCard.module.css'

interface StopCardProps {
  stop: StopPassengers
  /** Booking ids the driver marked as on board. */
  boarded: ReadonlySet<number>
  onToggle: (bookingId: number) => void
  /** For the staggered entrance. */
  index: number
}

/** One pickup stop on the driver's route: when, where, and each booking that gets on there. */
export function StopCard({ stop, boarded, onToggle, index }: StopCardProps) {
  const empty = stop.passengers.length === 0
  const allOn = !empty && stop.passengers.every((p) => boarded.has(p.bookingId))

  return (
    <li className={cx(styles.stop, empty && styles.empty, allOn && styles.done)} style={{ animationDelay: `${index * 160}ms` }}>
      <span className={styles.marker} aria-hidden="true">
        {allOn ? <Check /> : stop.order}
      </span>

      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.place}>
            <h3 className={styles.name}>{stop.name}</h3>
            <p className={styles.address}>{stop.address}</p>
          </div>
          <div className={styles.meta}>
            <time className={styles.time} dateTime={stop.estimatedPickupTimeUtc}>
              {formatTime(stop.estimatedPickupTimeUtc)}
            </time>
            <span className={styles.seats}>{empty ? 'אין עולים' : formatSeats(stop.totalSeats)}</span>
          </div>
        </header>

        {!empty && (
          <ul className={styles.passengers} aria-label={`נוסעים בתחנה ${stop.name}`}>
            {stop.passengers.map((passenger) => {
              const on = boarded.has(passenger.bookingId)
              return (
                <li key={passenger.bookingId} className={cx(styles.passenger, on && styles.on)}>
                  <label className={styles.check}>
                    <input type="checkbox" checked={on} onChange={() => onToggle(passenger.bookingId)} />
                    <span className={styles.box} aria-hidden="true">
                      <Check />
                    </span>
                    <span className={styles.who}>{passenger.fullName}</span>
                  </label>
                  <span className={styles.count}>{formatSeats(passenger.seatsCount)}</span>
                  {/* tel: opens the phone's dialer: one tap to call a passenger who is late. */}
                  <a href={`tel:${passenger.phone}`} className={styles.phone} aria-label={`התקשרות אל ${passenger.fullName}`}>
                    <Phone aria-hidden="true" />
                    <bdi dir="ltr">{passenger.phone}</bdi>
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </li>
  )
}
