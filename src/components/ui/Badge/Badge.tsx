import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import type { Tone } from '../Alert/Alert'
import styles from './Badge.module.css'

interface BadgeProps {
  tone?: Tone | 'neutral'
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function Badge({ tone = 'neutral', icon, children, className }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], className)}>
      {icon}
      {children}
    </span>
  )
}
