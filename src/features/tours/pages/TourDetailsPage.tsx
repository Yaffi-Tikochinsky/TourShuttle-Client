import { useState, type ReactNode } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { ArrowRight, CalendarDays, Clock, LogIn, Ticket, Timer, UserRound } from 'lucide-react'
import type { TourDetails } from '@/api/types'
import { Blob } from '@/components/art/Blob'
import { Dust } from '@/components/art/Dust'
import { LostPath } from '@/components/art/Ornaments'
import { SiteIllustration } from '@/components/art/SiteIllustration'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Alert, Button, ButtonLink, Card, EmptyState, Skeleton } from '@/components/ui'
import { BookingPanel } from '@/features/bookings/components/BookingPanel'
import { useAuth } from '@/features/auth/useAuth'
import type { LoginRedirectState } from '@/features/auth/RouteGuards'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useInView } from '@/hooks/useInView'
import { toApiError } from '@/lib/errors'
import { formatDay, formatPrice, formatTime } from '@/lib/format'
import { siteKindFor } from '@/lib/sites'
import { RouteTimeline } from '../components/RouteTimeline'
import { DepartureCountdown, SeatsMeter, StatusBadge, TourClosedNotice } from '../components/TourBits'
import { useTour } from '../hooks/useTourData'
import styles from './TourDetailsPage.module.css'

export default function TourDetailsPage() {
  const id = Number(useParams().id)
  const { data: tour, isPending, error } = useTour(id)
  // The stop chosen in the booking panel, lifted up here so the route on the left can highlight it too.
  const [selectedStopId, setSelectedStopId] = useState<number>()
  // Live (not once): the mobile booking bar shows only while the booking card itself is off screen.
  const [asideRef, asideVisible] = useInView<HTMLElement>({ once: false })
  useDocumentTitle(tour ? `הסעה אל ${tour.destinationName}` : 'פרטי הסעה')

  if (error) {
    const apiError = toApiError(error)
    return apiError.status === 404 ? <TourNotFound /> : <div className="container"><ApiErrorAlert error={apiError} /></div>
  }

  if (isPending || !tour) return <TourDetailsSkeleton />

  return (
    <article className={styles.page}>
      <header className={styles.hero}>
        <Blob shape={0} tone={0} style={{ top: -160, insetInlineStart: -160, width: 480 }} />
        <Dust count={14} seed={10} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <Link to="/tours" viewTransition className={styles.back}>
              <ArrowRight aria-hidden="true" />
              לכל ההסעות
            </Link>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{tour.destinationName}</h1>
              <StatusBadge status={tour.displayStatus} availableSeats={tour.availableSeats} />
            </div>
            <p className={styles.subtitle}>
              {tour.city} · {formatDay(tour.departureAt)}
            </p>
            {tour.destinationDescription && <p className={styles.description}>{tour.destinationDescription}</p>}
            {tour.displayStatus === 'Scheduled' && <DepartureCountdown departureAt={tour.departureAt} className={styles.countdown} />}
          </div>
          <div className={styles.heroArt}>
            <Parallax>
              <SiteIllustration kind={siteKindFor(tour.destinationName, tour.city)} />
            </Parallax>
          </div>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <div className={styles.main}>
          <Reveal as="section" aria-labelledby="facts-title">
            <h2 id="facts-title" className={styles.sectionTitle}>
              פרטי ההסעה
            </h2>
            <dl className={styles.facts}>
              <Fact icon={<CalendarDays />} label="תאריך" value={formatDay(tour.departureAt)} />
              <Fact icon={<Clock />} label="יציאה מהתחנה הראשונה" value={formatTime(tour.departureAt)} />
              <Fact icon={<Timer />} label="חזרה משוערת" value={formatTime(tour.returnAt)} />
              {tour.driverName && <Fact icon={<UserRound />} label="נהג" value={tour.driverName} />}
            </dl>
          </Reveal>

          <Reveal as="section" variant="scale" delay={120} aria-labelledby="route-title">
            <h2 id="route-title" className={styles.sectionTitle}>
              המסלול ותחנות האיסוף
            </h2>
            <Alert tone="info" className={styles.notice}>
              זמני האיסוף משוערים בלבד, ומחושבים לפי שעת היציאה והעומס הצפוי בכבישים. מומלץ להגיע לתחנה כמה דקות
              מוקדם יותר.
              {tour.customMinutesBetweenPickupPoints !== null && (
                <> בהסעה זו נקבע מרווח של {tour.customMinutesBetweenPickupPoints} דקות בין תחנה לתחנה.</>
              )}
            </Alert>
            <Card padding="lg">
              <RouteTimeline
                stops={tour.pickupPoints}
                destinationName={tour.destinationName}
                destinationCity={tour.city}
                selectedStopId={selectedStopId}
              />
            </Card>
          </Reveal>
        </div>

        <aside className={styles.aside} aria-label="הזמנה" id="booking" ref={asideRef} tabIndex={-1}>
          <BookingSummary tour={tour} onStopSelected={setSelectedStopId} />
        </aside>
      </div>

      <MobileBookingBar tour={tour} hidden={asideVisible} />
    </article>
  )
}

/**
 * Phones only (CSS): the booking card sits below the route, so a bar at the bottom of the screen keeps the price
 * and the way to it at hand. It slides away while the card itself is on screen.
 */
function MobileBookingBar({ tour, hidden }: { tour: TourDetails; hidden: boolean }) {
  const open = tour.displayStatus === 'Scheduled' && tour.availableSeats > 0
  const goToBooking = () => {
    const aside = document.getElementById('booking')
    aside?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Move keyboard and screen-reader focus there too, without a second jump.
    aside?.focus({ preventScroll: true })
  }

  return (
    <div className={styles.mobileBar} data-hidden={hidden} aria-hidden={hidden || undefined} inert={hidden}>
      <p className={styles.mobilePrice}>
        {formatPrice(tour.price)}
        <span className={styles.perSeat}> למקום</span>
      </p>
      <Button icon={<Ticket />} onClick={goToBooking}>
        {open ? 'להזמנת מקום' : 'פרטי ההזמנה'}
      </Button>
    </div>
  )
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className={styles.fact}>
      <span className={styles.factIcon} aria-hidden="true">
        {icon}
      </span>
      <dt className={styles.factLabel}>{label}</dt>
      <dd className={styles.factValue}>{value}</dd>
    </div>
  )
}

/** Price, seats, and the next step for whoever is looking: a guest signs in, a customer books. */
function BookingSummary({ tour, onStopSelected }: { tour: TourDetails; onStopSelected: (pickupPointId: number) => void }) {
  const { user } = useAuth()
  const location = useLocation()
  const open = tour.displayStatus === 'Scheduled' && tour.availableSeats > 0

  return (
    <Card padding="lg" className={styles.summary}>
      <p className={styles.price}>
        {formatPrice(tour.price)}
        <span className={styles.perSeat}> למקום</span>
      </p>
      <SeatsMeter capacity={tour.capacity} availableSeats={tour.availableSeats} />
      <p className={styles.limit}>עד {tour.maxSeatsPerBooking} מקומות בהזמנה אחת</p>

      {/* A customer always gets the panel: it also shows a booking just made, or one made earlier, on a full tour. */}
      {user?.role === 'Customer' ? (
        <BookingPanel tour={tour} onStopSelected={onStopSelected} />
      ) : !open ? (
        <TourClosedNotice availableSeats={tour.availableSeats} />
      ) : !user ? (
        <ButtonLink
          to="/login"
          state={{ from: location.pathname } satisfies LoginRedirectState}
          size="lg"
          fullWidth
          icon={<LogIn />}
        >
          התחברו כדי להזמין
        </ButtonLink>
      ) : (
        <Alert tone="info" title="ההזמנה מיועדת ללקוחות">
          חשבון {user.role === 'Admin' ? 'מנהל' : 'נהג'} אינו מזמין מקומות.
        </Alert>
      )}
    </Card>
  )
}

function TourDetailsSkeleton() {
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-7)' }} aria-busy="true" aria-label="טוען את פרטי ההסעה">
      <Skeleton width="40%" height="2.5rem" />
      <div style={{ height: 'var(--space-4)' }} />
      <Skeleton width="25%" />
      <div style={{ height: 'var(--space-6)' }} />
      <Skeleton height="16rem" radius="22px" />
    </div>
  )
}

function TourNotFound() {
  return (
    <div className="container">
      <EmptyState
        visual={<LostPath className={styles.lostArt} />}
        title="ההסעה הזו לא נמצאה"
        description="ייתכן שהקישור שגוי, או שההסעה הוסרה מלוח ההסעות."
        action={<ButtonLink to="/tours">לכל ההסעות</ButtonLink>}
      />
    </div>
  )
}
