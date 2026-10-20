import { Skeleton } from '@/components/ui'
import { Reveal } from '@/components/motion/Reveal'
import { useCities, useDestinations, useTours } from '@/features/tours/hooks/useTourData'
import styles from '../HomePage.module.css'

/** Live numbers from the API, not marketing copy: they change as tours are added and booked. */
export function StatsStrip() {
  // pageSize 1: only the total count is needed, so the server sends a single row.
  const tours = useTours({ pageSize: 1 })
  const destinations = useDestinations()
  const cities = useCities()

  const stats = [
    { value: tours.data?.totalCount, label: 'הסעות קרובות' },
    { value: destinations.data?.length, label: 'אתרים קדושים' },
    { value: cities.status === 'success' ? cities.data.length : undefined, label: 'ערים עם תחנות איסוף' },
  ]

  return (
    <Reveal className={`container ${styles.stats}`}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <span className={styles.statValue}>{stat.value ?? <Skeleton width="2.5rem" height="2rem" />}</span>
          <span className={styles.statLabel}>{stat.label}</span>
        </div>
      ))}
      <div className={styles.stat}>
        {/* A range of numbers inside RTL text would read "3–1" without an explicit left-to-right island. */}
        <span className={styles.statValue}>
          <bdi dir="ltr">1–3</bdi>
        </span>
        <span className={styles.statLabel}>דקות בין תחנה לתחנה, לפי העומס</span>
      </div>
    </Reveal>
  )
}
