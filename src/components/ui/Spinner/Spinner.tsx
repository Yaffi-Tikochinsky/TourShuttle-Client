import { cx } from '@/lib/cx'
import styles from './Spinner.module.css'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  /** Read by screen readers. Pass an empty string when the surrounding element already says it is loading. */
  label?: string
  className?: string
}

export function Spinner({ size = 'md', label = 'טוען…', className }: SpinnerProps) {
  return (
    <span className={cx(styles.spinner, styles[size], className)} role={label ? 'status' : undefined}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle className={styles.track} cx="12" cy="12" r="9" />
        <circle className={styles.arc} cx="12" cy="12" r="9" />
      </svg>
      {label && <span className="visually-hidden">{label}</span>}
    </span>
  )
}
