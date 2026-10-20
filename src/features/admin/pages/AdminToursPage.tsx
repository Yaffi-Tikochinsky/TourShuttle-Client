import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import type { TourSummary } from '@/api/types'
import { EmptyBench } from '@/components/art/Ornaments'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Badge, Button, ButtonLink, EmptyState, Pagination, Skeleton, useToast } from '@/components/ui'
import { StatusBadge } from '@/features/tours/components/TourBits'
import { tourKeys } from '@/features/tours/hooks/useTourData'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cx } from '@/lib/cx'
import { toApiError } from '@/lib/errors'
import { formatCities, formatPrice, formatShortDay, formatTime } from '@/lib/format'
import { ConfirmDelete } from '../components/ConfirmDelete'
import { useAdminMutation, useAdminTours } from '../hooks/useAdminData'
import shared from './AdminPages.module.css'
import styles from './AdminToursPage.module.css'

const PAGE_SIZE = 15
const PAST_DAYS = 60

export default function AdminToursPage() {
  useDocumentTitle('ניהול הסעות')
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const withPast = params.get('past') === '1'

  // Fixed once (lazy initial state): a "from" that moved with every render would make a new query key each time.
  const [pastFrom] = useState(() => new Date(Date.now() - PAST_DAYS * 86_400_000).toISOString())
  const { data, isPending, isPlaceholderData, error } = useAdminTours({
    page,
    pageSize: PAGE_SIZE,
    sortBy: 'Departure',
    sortDirection: 'Asc',
    from: withPast ? pastFrom : undefined,
  })

  const [toDelete, setToDelete] = useState<TourSummary | null>(null)
  const remove = useAdminMutation(adminApi.deleteTour, [tourKeys.all])

  function confirmDelete() {
    if (!toDelete) return
    remove.mutate(toDelete.id, {
      onSuccess: () => toast.success('ההסעה נמחקה', `${toDelete.destinationName}, ${formatShortDay(toDelete.departureAt)}`),
      onError: (cause) => {
        const apiError = toApiError(cause)
        toast.error('ההסעה לא נמחקה', apiError.status === 409 ? 'יש בה הזמנות, ולכן אי אפשר למחוק אותה.' : apiError.headline)
      },
      onSettled: () => setToDelete(null),
    })
  }

  const setPage = (next: number) => setParams((current) => withParam(current, 'page', next === 1 ? null : String(next)))
  const togglePast = () => setParams((current) => withParam(withParam(current, 'page', null), 'past', withPast ? null : '1'))

  return (
    <section aria-labelledby="admin-tours-title">
      <div className={shared.toolbar}>
        <div>
          <h2 id="admin-tours-title" className={shared.title}>
            הסעות
          </h2>
          <p className={shared.lead}>{data ? `${data.totalCount} הסעות` : 'כל ההסעות, כולל אלה שבוטלו.'}</p>
        </div>
        <div className={styles.actions}>
          <label className={styles.toggle}>
            <input type="checkbox" checked={withPast} onChange={togglePast} />
            {PAST_DAYS} הימים האחרונים
          </label>
          <ButtonLink to="/admin/tours/new" icon={<Plus />}>
            הסעה חדשה
          </ButtonLink>
        </div>
      </div>

      {error ? (
        <ApiErrorAlert error={toApiError(error)} />
      ) : isPending ? (
        <Skeleton height="20rem" radius="22px" />
      ) : data.items.length === 0 ? (
        <EmptyState
          visual={<EmptyBench className={styles.emptyArt} />}
          title="אין הסעות מתוכננות"
          action={
            <ButtonLink to="/admin/tours/new" icon={<Plus />}>
              הסעה ראשונה
            </ButtonLink>
          }
        />
      ) : (
        <>
          {/* A real table: screen readers announce each cell with its column header. It scrolls sideways on phones. */}
          <div className={cx(styles.tableWrap, isPlaceholderData && styles.busy)}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">מועד</th>
                  <th scope="col">יעד ומסלול</th>
                  <th scope="col">נהג</th>
                  <th scope="col">תפוסה</th>
                  <th scope="col">מחיר</th>
                  <th scope="col">מצב</th>
                  <th scope="col">
                    <span className="visually-hidden">פעולות</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((tour, index) => (
                  <tr key={tour.id} className={shared.item} style={{ animationDelay: `${index * 60}ms` }}>
                    <td className={styles.when}>
                      <span className={styles.day}>{formatShortDay(tour.departureAt)}</span>
                      <bdi dir="ltr" className={styles.time}>
                        {formatTime(tour.departureAt)}–{formatTime(tour.returnAt)}
                      </bdi>
                    </td>
                    <td>
                      <Link to={`/tours/${tour.id}`} className={styles.destination}>
                        {tour.destinationName}
                      </Link>
                      <span className={styles.route}>{formatCities(tour.cities)}</span>
                    </td>
                    <td>{tour.driverName ?? <Badge tone="warning">ללא נהג</Badge>}</td>
                    <td className={styles.load}>
                      <bdi dir="ltr">
                        {tour.capacity - tour.availableSeats}/{tour.capacity}
                      </bdi>
                    </td>
                    <td>{formatPrice(tour.price)}</td>
                    <td>
                      <StatusBadge status={tour.displayStatus} availableSeats={tour.availableSeats} />
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <ButtonLink to={`/admin/tours/${tour.id}/edit`} variant="ghost" size="sm" icon={<Pencil />} aria-label={`עריכת ההסעה אל ${tour.destinationName}`} />
                        <ButtonLink to={`/driver/tours/${tour.id}`} variant="ghost" size="sm" icon={<Users />} aria-label={`נוסעי ההסעה אל ${tour.destinationName}`} />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 />}
                          className={shared.danger}
                          aria-label={`מחיקת ההסעה אל ${tour.destinationName}`}
                          onClick={() => setToDelete(tour)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data.totalPages} isBusy={isPlaceholderData} onChange={setPage} />
        </>
      )}

      <ConfirmDelete
        itemName={toDelete ? `ההסעה אל ${toDelete.destinationName}` : null}
        isDeleting={remove.isPending}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      >
        {toDelete && (
          <p>
            {formatShortDay(toDelete.departureAt)} בשעה {formatTime(toDelete.departureAt)}. אפשר למחוק רק הסעה שעוד לא הוזמנו בה מקומות.
          </p>
        )}
      </ConfirmDelete>
    </section>
  )
}

function withParam(params: URLSearchParams, key: string, value: string | null): URLSearchParams {
  const next = new URLSearchParams(params)
  if (value === null) next.delete(key)
  else next.set(key, value)
  return next
}
