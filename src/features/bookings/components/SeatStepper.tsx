import { useId } from 'react'
import { Minus, Plus } from 'lucide-react'
import { formatSeats } from '@/lib/format'
import styles from './SeatStepper.module.css'

interface SeatStepperProps {
  value: number
  max: number
  onChange: (seats: number) => void
  disabled?: boolean
}

/**
 * Minus, the count, plus. A controlled component: the parent owns the number and this only reports clicks.
 * The count is announced politely to screen readers after each change (aria-live on <output>).
 */
export function SeatStepper({ value, max, onChange, disabled = false }: SeatStepperProps) {
  const labelId = useId()

  return (
    <div className={styles.stepper}>
      <span id={labelId} className={styles.label}>
        מספר מקומות
      </span>
      <div className={styles.controls} role="group" aria-labelledby={labelId}>
        <button
          type="button"
          className={styles.step}
          aria-label="מקום אחד פחות"
          disabled={disabled || value <= 1}
          onClick={() => onChange(value - 1)}
        >
          <Minus aria-hidden="true" />
        </button>
        {/* key: a new element per value, so the number rises in softly each time it changes. */}
        <output key={value} className={styles.value} aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          className={styles.step}
          aria-label="מקום אחד יותר"
          disabled={disabled || value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus aria-hidden="true" />
        </button>
      </div>
      <span className={styles.hint}>{value >= max ? `זה המקסימום: ${formatSeats(max)}` : `אפשר עד ${formatSeats(max)}`}</span>
    </div>
  )
}
