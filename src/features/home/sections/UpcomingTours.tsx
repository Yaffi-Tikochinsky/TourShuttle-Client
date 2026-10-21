import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Blob } from '@/components/art/Blob'
import { Dust } from '@/components/art/Dust'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Reveal } from '@/components/motion/Reveal'
import { TourCard, TourCardSkeleton } from '@/features/tours/components/TourCard'
import { useTours } from '@/features/tours/hooks/useTourData'
import { toApiError } from '@/lib/errors'
import styles from '../HomePage.module.css'
import { SectionHeading } from './SectionHeading'

export function UpcomingTours() {
  const { data, isPending, error } = useTours({ pageSize: 4 })

  return (
    <section className={styles.section} aria-labelledby="upcoming-title">
      <Blob shape={3} tone={0} style={{ top: 80, insetInlineStart: -150, width: 400 }} />
      <Dust count={12} seed={9} />
      <div className="container">
        <SectionHeading
          id="upcoming-title"
          title="הסעות קרובות"
          subtitle="המקומות מתמלאים, כדאי להקדים"
          action={
            <Link to="/tours" viewTransition className={styles.sectionLink}>
              לכל ההסעות
              <ArrowLeft aria-hidden="true" />
            </Link>
          }
        />

        {error && <ApiErrorAlert error={toApiError(error)} />}

        <div className={styles.tourGrid}>
          {isPending && Array.from({ length: 4 }, (_, i) => <TourCardSkeleton key={i} />)}
          {data?.items.map((tour, index) => (
            <Reveal key={tour.id} delay={index * 80}>
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
