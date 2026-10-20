import { Skeleton } from '@/components/ui'
import { useCities, useDestinations, useTours } from '@/features/tours/hooks/useTourData'
import { useCountUp } from '@/hooks/useCountUp'
import { useInView } from '@/hooks/useInView'
import styles from '../HomePage.module.css'

/** Live numbers from the API, not marketing copy. They count up softly the first time the strip comes into view. */
export function StatsStrip() {
  // pageSize 1: only the total count is needed, so the server sends a single row.
  const tours = useTours({ pageSize: 1 })
  const destinations = useDestinations()
  const cities = useCities()
  const [ref, inView] = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className={`container reveal ${styles.stats}`} data-visible={inView}>
      <Stat value={tours.data?.totalCount} label="הסעות קרובות" start={inView} />
      <Stat value={destinations.data?.length} label="אתרים קדושים" start={inView} />
      <Stat value={cities.status === 'success' ? cities.data.length : undefined} label="ערים עם תחנות איסוף" start={inView} />
      <div className={styles.stat}>
        {/* A range of numbers inside RTL text would read "3–1" without an explicit left-to-right island. */}
        <span className={styles.statValue}>
          <bdi dir="ltr">1–3</bdi>
        </span>
        <span className={styles.statLabel}>דקות בין תחנה לתחנה, לפי העומס</span>
      </div>
    </div>
  )
}

function Stat({ value, label, start }: { value: number | undefined; label: string; start: boolean }) {
  const shown = useCountUp(value, start)
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{shown ?? <Skeleton width="2.5rem" height="2rem" />}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}
