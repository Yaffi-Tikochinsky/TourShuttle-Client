import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, XOctagon } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Alert.module.css'

export type Tone = 'info' | 'success' | 'warning' | 'danger'

const icons: Record<Tone, ReactNode> = {
  info: <Info aria-hidden="true" />,
  success: <CheckCircle2 aria-hidden="true" />,
  warning: <AlertTriangle aria-hidden="true" />,
  danger: <XOctagon aria-hidden="true" />,
}

interface AlertProps {
  tone?: Tone
  title?: ReactNode
  children?: ReactNode
  /** A button or link under the text, such as "try again". */
  action?: ReactNode
  className?: string
}

export function Alert({ tone = 'info', title, children, action, className }: AlertProps) {
  return (
    // "alert" interrupts a screen reader immediately, so it is kept for problems; the rest is a polite "status".
    <div className={cx(styles.alert, styles[tone], className)} role={tone === 'danger' ? 'alert' : 'status'}>
      <span className={styles.icon}>{icons[tone]}</span>
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.text}>{children}</div>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  )
}
