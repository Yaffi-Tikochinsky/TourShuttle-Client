import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Select.module.css'

type SelectProps = ComponentPropsWithRef<'select'> & {
  label: string
  /** Hide the label visually (still read by screen readers), for compact search bars. */
  hideLabel?: boolean
  /** An icon inside the field, at its start. */
  icon?: ReactNode
}

/** A native <select> in the app's look: keyboard, screen readers and mobile pickers all work out of the box. */
export function Select({ label, hideLabel = false, icon, id, className, children, ...rest }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={selectId} className={hideLabel ? 'visually-hidden' : styles.label}>
        {label}
      </label>
      <div className={cx(styles.control, icon !== undefined && styles.withIcon)}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <select id={selectId} className={styles.select} {...rest}>
          {children}
        </select>
        <ChevronDown className={styles.chevron} aria-hidden="true" />
      </div>
    </div>
  )
}
