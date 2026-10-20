import { useId } from 'react'
import type { TourStop } from '@/api/types'
import { cx } from '@/lib/cx'
import { formatTime } from '@/lib/format'
import styles from './StopPicker.module.css'

interface StopPickerProps {
  stops: TourStop[]
  value: number | null
  onChange: (pickupPointId: number) => void
  disabled?: boolean
}

/**
 * The pickup stops as radio buttons drawn as cards. Real radio inputs underneath, so arrow keys move between
 * stops and a screen reader announces "1 of 4": the look changes, the semantics do not.
 */
export function StopPicker({ stops, value, onChange, disabled = false }: StopPickerProps) {
  const name = useId()

  return (
    <fieldset className={styles.picker} disabled={disabled}>
      <legend className={styles.legend}>מאיזו תחנה תעלו?</legend>
      <div className={styles.options}>
        {stops.map((stop, index) => (
          <label
            key={stop.pickupPointId}
            className={cx(styles.option, stop.pickupPointId === value && styles.checked)}
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <input
              type="radio"
              name={name}
              className={styles.radio}
              value={stop.pickupPointId}
              checked={stop.pickupPointId === value}
              onChange={() => onChange(stop.pickupPointId)}
            />
            <span className={styles.mark} aria-hidden="true" />
            <span className={styles.place}>
              <span className={styles.name}>{stop.name}</span>
              <span className={styles.address}>{stop.address}</span>
            </span>
            <time className={styles.time} dateTime={stop.estimatedPickupTimeUtc}>
              {formatTime(stop.estimatedPickupTimeUtc)}
            </time>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
