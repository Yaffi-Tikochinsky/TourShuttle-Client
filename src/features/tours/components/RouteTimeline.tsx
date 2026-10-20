import type { TourStop } from '@/api/types'
import { cx } from '@/lib/cx'
import { formatTime } from '@/lib/format'
import styles from './RouteTimeline.module.css'

interface RouteTimelineProps {
  stops: TourStop[]
  destinationName: string
  destinationCity: string
  /** Highlights one stop, for example the one the customer chose. */
  selectedStopId?: number
}

/**
 * The route, top to bottom: each stop with its estimated pickup time, joined by a dashed line,
 * ending at the site. The line draws itself once when the page opens.
 */
export function RouteTimeline({ stops, destinationName, destinationCity, selectedStopId }: RouteTimelineProps) {
  return (
    <ol className={styles.timeline}>
      {stops.map((stop, index) => (
        <li
          key={stop.pickupPointId}
          className={cx(styles.stop, stop.pickupPointId === selectedStopId && styles.selected)}
          style={{ animationDelay: `${index * 180}ms` }}
        >
          <span className={styles.marker} aria-hidden="true" />
          <div className={styles.place}>
            <span className={styles.name}>{stop.name}</span>
            <span className={styles.address}>{stop.address}</span>
          </div>
          <time className={styles.time} dateTime={stop.estimatedPickupTimeUtc}>
            <span className="visually-hidden">איסוף משוער בשעה </span>
            {formatTime(stop.estimatedPickupTimeUtc)}
          </time>
        </li>
      ))}
      <li className={cx(styles.stop, styles.destination)} style={{ animationDelay: `${stops.length * 180}ms` }}>
        <span className={styles.marker} aria-hidden="true" />
        <div className={styles.place}>
          <span className={styles.name}>{destinationName}</span>
          <span className={styles.address}>{destinationCity}</span>
        </div>
      </li>
    </ol>
  )
}
