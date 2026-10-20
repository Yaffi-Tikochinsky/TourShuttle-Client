import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import styles from './AuthLayout.module.css'

interface AuthLayoutProps {
  title: string
  subtitle: ReactNode
  children: ReactNode
  /** Under the card: "No account yet? Register". */
  footer?: ReactNode
  /** Under the footer, such as the demo accounts. */
  aside?: ReactNode
}

/** The shared frame of the login and register pages (composition: the pages pass in their own form). */
export function AuthLayout({ title, subtitle, children, footer, aside }: AuthLayoutProps) {
  return (
    <section className={`container ${styles.layout}`}>
      <div className={styles.visual} aria-hidden="true">
        <svg viewBox="0 0 400 300" className={styles.scene}>
          <circle cx="200" cy="120" r="46" className={styles.sun} />
          <path d="M0 230 Q 90 170 180 215 T 400 200 V300 H0Z" className={styles.hillFar} />
          <path d="M0 260 Q 120 210 230 250 T 400 240 V300 H0Z" className={styles.hillNear} />
          <path d="M150 300 V200 a50 50 0 0 1 100 0 V300" className={styles.gate} />
        </svg>
        <p className={styles.quote}>״מה טובו אוהליך יעקב, משכנותיך ישראל״</p>
      </div>

      <div className={styles.content}>
        <Card padding="lg" className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {children}
        </Card>
        {footer && <p className={styles.footer}>{footer}</p>}
        {aside}
      </div>
    </section>
  )
}
