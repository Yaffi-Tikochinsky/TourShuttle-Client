import { useState } from 'react'
import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { adminApi, type PickupPointRequest } from '@/api/admin.api'
import type { PickupPoint } from '@/api/types'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, Card, Modal, Skeleton, useToast } from '@/components/ui'
import { tourKeys } from '@/features/tours/hooks/useTourData'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toApiError } from '@/lib/errors'
import { PickupPointForm } from '../components/CatalogForms'
import { ConfirmDelete } from '../components/ConfirmDelete'
import { adminKeys, useAdminMutation, usePickupPoints } from '../hooks/useAdminData'
import styles from './AdminPages.module.css'

type Editing = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; point: PickupPoint }

/** Stops grouped by city, in Hebrew alphabetical order, since customers search by city. */
function groupByCity(points: PickupPoint[]): Array<[string, PickupPoint[]]> {
  const groups = new Map<string, PickupPoint[]>()
  for (const point of points) groups.set(point.city, [...(groups.get(point.city) ?? []), point])
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, 'he'))
}

export default function PickupPointsPage() {
  useDocumentTitle('ניהול תחנות איסוף')
  const { data: points, isPending, error } = usePickupPoints()
  const toast = useToast()
  const [editing, setEditing] = useState<Editing>({ mode: 'closed' })
  const [toDelete, setToDelete] = useState<PickupPoint | null>(null)

  // A stop's name and city appear in tours, so tours are refreshed too.
  const invalidates = [adminKeys.pickupPoints, tourKeys.all]
  const create = useAdminMutation(adminApi.createPickupPoint, invalidates)
  const update = useAdminMutation(({ id, request }: { id: number; request: PickupPointRequest }) => adminApi.updatePickupPoint(id, request), invalidates)
  const remove = useAdminMutation(adminApi.deletePickupPoint, invalidates)

  const groups = groupByCity(points ?? [])
  const close = () => setEditing({ mode: 'closed' })

  async function save(request: PickupPointRequest) {
    if (editing.mode === 'edit') await update.mutateAsync({ id: editing.point.id, request })
    else await create.mutateAsync(request)
    toast.success(editing.mode === 'edit' ? 'התחנה עודכנה' : 'התחנה נוספה', request.name)
    close()
  }

  function confirmDelete() {
    if (!toDelete) return
    remove.mutate(toDelete.id, {
      onSuccess: () => toast.success('התחנה נמחקה', toDelete.name),
      onError: (cause) => {
        const apiError = toApiError(cause)
        toast.error('התחנה לא נמחקה', apiError.status === 409 ? 'התחנה נמצאת במסלול של הסעות. קודם יש להוציא אותה מהמסלולים.' : apiError.headline)
      },
      onSettled: () => setToDelete(null),
    })
  }

  return (
    <section aria-labelledby="points-title">
      <div className={styles.toolbar}>
        <div>
          <h2 id="points-title" className={styles.title}>
            תחנות איסוף
          </h2>
          <p className={styles.lead}>התחנות שמהן אפשר לבנות מסלול, לפי עיר.</p>
        </div>
        <Button icon={<Plus />} onClick={() => setEditing({ mode: 'create' })}>
          תחנה חדשה
        </Button>
      </div>

      {error ? (
        <ApiErrorAlert error={toApiError(error)} />
      ) : isPending ? (
        <Skeleton height="16rem" radius="22px" />
      ) : (
        <div className={styles.cityGroups}>
          {groups.map(([city, cityPoints], index) => (
            <Card as="section" key={city} padding="md" className={styles.item} style={{ animationDelay: `${index * 110}ms` }} aria-labelledby={`city-${index}`}>
              <h3 id={`city-${index}`} className={styles.cityTitle}>
                <MapPin aria-hidden="true" />
                {city}
                <span className={styles.count}>{cityPoints.length}</span>
              </h3>
              <ul className={styles.rows}>
                {cityPoints.map((point) => (
                  <li key={point.id} className={styles.row}>
                    <span className={styles.rowText}>
                      <span className={styles.rowName}>{point.name}</span>
                      <span className={styles.rowSub}>{point.address}</span>
                    </span>
                    <span className={styles.rowActions}>
                      <Button variant="ghost" size="sm" icon={<Pencil />} aria-label={`עריכת ${point.name}`} onClick={() => setEditing({ mode: 'edit', point })} />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 />}
                        className={styles.danger}
                        aria-label={`מחיקת ${point.name}`}
                        onClick={() => setToDelete(point)}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <Modal open={editing.mode !== 'closed'} onClose={close} title={editing.mode === 'edit' ? 'עריכת תחנה' : 'תחנה חדשה'}>
        {editing.mode !== 'closed' && (
          <PickupPointForm
            key={editing.mode === 'edit' ? editing.point.id : 'new'}
            initial={editing.mode === 'edit' ? editing.point : undefined}
            cities={groups.map(([city]) => city)}
            onSubmit={save}
            onCancel={close}
          />
        )}
      </Modal>

      <ConfirmDelete itemName={toDelete?.name ?? null} isDeleting={remove.isPending} onConfirm={confirmDelete} onClose={() => setToDelete(null)}>
        <p>אפשר למחוק רק תחנה שאינה במסלול של אף הסעה.</p>
      </ConfirmDelete>
    </section>
  )
}
