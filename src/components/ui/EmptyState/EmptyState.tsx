import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  /** An illustration or a large icon. */
  visual?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}

/** What a list shows when it has nothing to show: an invitation, not an apology. */
export function EmptyState({ visual, title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      {visual && <div className={styles.visual}>{visual}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
