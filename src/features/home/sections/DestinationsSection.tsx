import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Blob } from '@/components/art/Blob'
import { Dust } from '@/components/art/Dust'
import { SiteIllustration } from '@/components/art/SiteIllustration'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Reveal } from '@/components/motion/Reveal'
import { Card, Skeleton } from '@/components/ui'
import { useDestinations } from '@/features/tours/hooks/useTourData'
import { toApiError } from '@/lib/errors'
import { siteKindFor } from '@/lib/sites'
import styles from '../HomePage.module.css'
import { SectionHeading } from './SectionHeading'

/** The sites, each with its own drawing. Choosing one opens the tours to it. */
export function DestinationsSection() {
  const { data: destinations, isPending, error } = useDestinations()

  return (
    <section className={styles.section} aria-labelledby="destinations-title">
      <Blob shape={2} tone={1} style={{ top: 40, insetInlineEnd: -160, width: 420 }} />
      <Dust count={14} seed={7} />
      <div className="container">
        <SectionHeading id="destinations-title" title="לאן יוצאים?" subtitle="בחרו מקום, ונראה לכם את ההסעות הקרובות אליו" />

        {error && <ApiErrorAlert error={toApiError(error)} />}

        <div className={styles.destinations}>
          {isPending &&
            Array.from({ length: 3 }, (_, i) => (
              <Card key={i} padding="none" className={styles.destination}>
                <Skeleton height="9rem" radius="0" />
                <div className={styles.destinationBody}>
                  <Skeleton width="60%" height="1.2rem" />
                  <Skeleton width="85%" />
                </div>
              </Card>
            ))}

          {destinations?.map((destination, index) => (
            <Reveal key={destination.id} delay={index * 110} variant="scale">
              <Card as="article" padding="none" interactive className={styles.destination}>
                <div className={styles.destinationArt}>
                  <SiteIllustration kind={siteKindFor(destination.name, destination.city)} />
                </div>
                <div className={styles.destinationBody}>
                  <h3 className={styles.destinationName}>
                    <Link to={`/tours?destinationId=${destination.id}`} viewTransition className={styles.stretchedLink}>
                      {destination.name}
                    </Link>
                  </h3>
                  <p className={styles.destinationCity}>{destination.city}</p>
                  {destination.description && <p className={styles.destinationText}>{destination.description}</p>}
                  <span className={styles.destinationMore}>
                    להסעות הקרובות
                    <ArrowLeft aria-hidden="true" />
                  </span>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
