import type { ReactNode } from 'react'
import { ArchScene } from '@/components/art/ArchScene'
import { Blob } from '@/components/art/Blob'
import { Dust } from '@/components/art/Dust'
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
    <section className={styles.wrapper}>
      <Blob shape={3} tone={0} style={{ top: -60, insetInlineEnd: -140, width: 460 }} />
      <Dust count={16} seed={3} />
      <div className={`container ${styles.layout}`}>
        <div className={styles.visual} aria-hidden="true">
          <ArchScene />
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
      </div>
    </section>
  )
}
