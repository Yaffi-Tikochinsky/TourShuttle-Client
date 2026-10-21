import type { ReactNode } from 'react'
import { LostPath } from '@/components/art/Ornaments'
import { Dust } from '@/components/art/Dust'
import styles from './StatusPage.module.css'

interface StatusPageProps {
  code: string
  title: string
  description: ReactNode
  actions?: ReactNode
}

/** The shared look of the 404, 403 and error pages: a path that fades into the hills. */
export function StatusPage({ code, title, description, actions }: StatusPageProps) {
  return (
    <section className={`container ${styles.page}`}>
      <Dust count={10} seed={17} />
      <LostPath className={styles.art} />
      <p className={styles.code} aria-hidden="true">
        {code}
      </p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  )
}
