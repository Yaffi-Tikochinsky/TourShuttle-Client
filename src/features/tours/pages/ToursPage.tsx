import { ArrowUpDown, X } from 'lucide-react'
import { Blob } from '@/components/art/Blob'
import { EmptyBench } from '@/components/art/Ornaments'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, EmptyState, Pagination, Select } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cx } from '@/lib/cx'
import { toApiError } from '@/lib/errors'
import { TourCard, TourCardSkeleton } from '../components/TourCard'
import { TourSearch } from '../components/TourSearch'
import { useDestinations, useTours } from '../hooks/useTourData'
import { sortOptions, useTourFilters, type SortOption } from '../hooks/useTourFilters'
import styles from './ToursPage.module.css'

export default function ToursPage() {
  useDocumentTitle('הסעות')
  const { city, destinationId, sort, page, query, update, isPending } = useTourFilters()
  const { data, isPending: isLoading, isPlaceholderData, error } = useTours(query)
  const destinations = useDestinations()

  const destinationName = destinations.data?.find((d) => d.id === destinationId)?.name
  const hasFilters = Boolean(city || destinationId)
  // While a new page or filter loads, the old results stay, slightly faded: no flash of an empty list.
  const isRefreshing = isPending || isPlaceholderData

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <Blob shape={1} tone={0} style={{ top: -140, insetInlineEnd: -120, width: 420 }} />
        <div className="container">
          <h1 className={styles.title}>הסעות קרובות</h1>
          <p className={styles.lead}>בחרו את העיר שלכם, ונראה לכם כל הסעה שיש בה תחנה קרובה.</p>
          {/* key: a new search from the URL (for example, from the home page) refreshes the selects' defaults */}
          <TourSearch
            key={`${city}-${destinationId ?? ''}`}
            variant="bar"
            defaultCity={city}
            defaultDestinationId={destinationId}
            className={styles.search}
          />
        </div>
      </section>

      <div className="container">
        <div className={styles.toolbar}>
          <p className={styles.summary} aria-live="polite">
            {data ? summaryText(data.totalCount, city, destinationName) : 'מחפשים הסעות…'}
          </p>

          {hasFilters && (
            <div className={styles.chips}>
              {city && (
                <button type="button" className={styles.chip} onClick={() => update({ city: null })}>
                  מ{city}
                  <X aria-label="הסרת הסינון לפי עיר" />
                </button>
              )}
              {destinationName && (
                <button type="button" className={styles.chip} onClick={() => update({ destinationId: null })}>
                  אל {destinationName}
                  <X aria-label="הסרת הסינון לפי אתר" />
                </button>
              )}
            </div>
          )}

          <Select
            label="מיון"
            hideLabel
            icon={<ArrowUpDown />}
            value={sort}
            onChange={(event) => update({ sort: event.target.value as SortOption })}
            className={styles.sort}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {error && <ApiErrorAlert error={toApiError(error)} />}

        {data && data.items.length === 0 ? (
          <EmptyState
            visual={<EmptyBench className={styles.emptyArt} />}
            title="אין כרגע הסעות שמתאימות לחיפוש"
            description="נסו עיר קרובה או אתר אחר. הסעות חדשות נוספות כל שבוע."
            action={
              hasFilters && (
                <Button variant="secondary" onClick={() => update({ city: null, destinationId: null })}>
                  הצגת כל ההסעות
                </Button>
              )
            }
          />
        ) : (
          <div className={cx(styles.grid, isRefreshing && styles.refreshing)} aria-busy={isRefreshing}>
            {isLoading && Array.from({ length: 6 }, (_, i) => <TourCardSkeleton key={i} />)}
            {data?.items.map((tour) => <TourCard key={tour.id} tour={tour} />)}
          </div>
        )}

        {data && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            isBusy={isRefreshing}
            onChange={(next) => {
              update({ page: next })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}
      </div>
    </div>
  )
}

function summaryText(count: number, city: string, destination: string | undefined): string {
  const tours = count === 1 ? 'הסעה אחת' : `${count} הסעות`
  const from = city ? ` מ${city}` : ''
  const to = destination ? ` אל ${destination}` : ''
  return count === 0 ? 'לא נמצאו הסעות' : `נמצאו ${tours}${from}${to}`
}
