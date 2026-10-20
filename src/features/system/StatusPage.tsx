import type { ReactNode } from 'react'
import styles from './StatusPage.module.css'

interface StatusPageProps {
  code: string
  title: string
  description: ReactNode
  actions?: ReactNode
}

/** The shared look of the 404, 403 and error pages. */
export function StatusPage({ code, title, description, actions }: StatusPageProps) {
  return (
    <section className={`container ${styles.page}`}>
      <p className={styles.code} aria-hidden="true">
        {code}
      </p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  )
}
