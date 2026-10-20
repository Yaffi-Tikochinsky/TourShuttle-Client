import { Blob } from '@/components/art/Blob'
import { EmptyBench } from '@/components/art/Ornaments'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, EmptyState, Skeleton } from '@/components/ui'
import { useAuth } from '@/features/auth/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useNow } from '@/hooks/useNow'
import { toApiError } from '@/lib/errors'
import { formatDay, greetingFor } from '@/lib/format'
import { NextTourCard } from '../components/NextTourCard'
import { ScheduleRow } from '../components/ScheduleRow'
import { groupByDay, relativeDayName } from '../driverSchedule'
import { useDriverTours } from '../hooks/useDriverData'
import styles from './DriverToursPage.module.css'

/** The driver's work schedule: the next tour up front, then every assigned tour grouped by day. */
export default function DriverToursPage() {
  useDocumentTitle('ההסעות שלי')
  const { user } = useAuth()
  const { data: tours, isPending, error, refetch } = useDriverTours()
  const now = useNow()

  // The server returns tours that have not returned yet; the next one is the first that has not left.
  const next = tours?.find((t) => t.displayStatus === 'Scheduled')
  const days = groupByDay(tours ?? [])
  const firstName = user?.fullName.split(' ')[0]

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <Blob shape={3} tone={0} style={{ top: -160, insetInlineEnd: -140, width: 460 }} />
        <div className="container">
          <h1 className={styles.title}>ההסעות שלי</h1>
          <p className={styles.lead}>{firstName ? `${greetingFor(now)} ${firstName}. ` : ''}כל ההסעות שהוקצו לך, ומי עולה בכל תחנה.</p>
        </div>
      </section>

      <div className={`container ${styles.body}`}>
        {error ? (
          <ApiErrorAlert
            error={toApiError(error)}
            action={
              <Button variant="secondary" size="sm" onClick={() => void refetch()}>
                לנסות שוב
              </Button>
            }
          />
        ) : isPending ? (
          <div className={styles.loading} aria-busy="true" aria-label="טוען את ההסעות">
            <Skeleton height="16rem" radius="22px" />
            <Skeleton height="5rem" />
            <Skeleton height="5rem" />
          </div>
        ) : days.length === 0 ? (
          <EmptyState
            visual={<EmptyBench className={styles.emptyArt} />}
            title="אין הסעות משובצות כרגע"
            description="כשהמנהל ישבץ אותך להסעה, היא תופיע כאן עם רשימת הנוסעים."
          />
        ) : (
          <>
            {next && <NextTourCard tour={next} />}

            {days.map((day, dayIndex) => {
              const date = formatDay(day.key)
              const name = relativeDayName(day.key, now)
              return (
              <section key={day.key} className={styles.day} aria-labelledby={`day-${day.key}`} style={{ animationDelay: `${200 + dayIndex * 160}ms` }}>
                <h2 id={`day-${day.key}`} className={styles.dayTitle}>
                  {name ?? date}
                  {name && <span className={styles.dayDate}>{date}</span>}
                </h2>
                <ul className={styles.rows}>
                  {day.tours.map((tour) => (
                    <li key={tour.id}>
                      <ScheduleRow tour={tour} />
                    </li>
                  ))}
                </ul>
              </section>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
