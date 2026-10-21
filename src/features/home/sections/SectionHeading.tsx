import type { ReactNode } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import styles from '../HomePage.module.css'

interface SectionHeadingProps {
  id: string
  title: string
  subtitle?: string
  /** A link on the other side, such as "All tours". */
  action?: ReactNode
}

export function SectionHeading({ id, title, subtitle, action }: SectionHeadingProps) {
  return (
    <Reveal variant="side" className={styles.sectionHeading}>
      <div>
        <h2 id={id} className={styles.sectionTitle}>
          {title}
        </h2>
        {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
      </div>
      {action}
    </Reveal>
  )
}
