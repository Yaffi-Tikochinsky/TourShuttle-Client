import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { adminApi, type DestinationRequest } from '@/api/admin.api'
import type { Destination } from '@/api/types'
import { SiteIllustration } from '@/components/art/SiteIllustration'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, Card, Modal, Skeleton, useToast } from '@/components/ui'
import { useDestinations } from '@/features/tours/hooks/useTourData'
import { tourKeys } from '@/features/tours/hooks/useTourData'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { toApiError } from '@/lib/errors'
import { siteKindFor } from '@/lib/sites'
import { DestinationForm } from '../components/CatalogForms'
import { ConfirmDelete } from '../components/ConfirmDelete'
import { useAdminMutation } from '../hooks/useAdminData'
import styles from './AdminPages.module.css'

/** Which dialog is open: none, a new destination, or editing one. */
type Editing = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; destination: Destination }

export default function DestinationsPage() {
  useDocumentTitle('ניהול יעדים')
  const { data: destinations, isPending, error } = useDestinations()
  const toast = useToast()
  const [editing, setEditing] = useState<Editing>({ mode: 'closed' })
  const [toDelete, setToDelete] = useState<Destination | null>(null)

  // Destinations appear inside tours (name and city), so tours are refreshed too.
  const invalidates = [['destinations'], tourKeys.all]
  const create = useAdminMutation(adminApi.createDestination, invalidates)
  const update = useAdminMutation(({ id, request }: { id: number; request: DestinationRequest }) => adminApi.updateDestination(id, request), invalidates)
  const remove = useAdminMutation(adminApi.deleteDestination, invalidates)

  const close = () => setEditing({ mode: 'closed' })

  async function save(request: DestinationRequest) {
    if (editing.mode === 'edit') await update.mutateAsync({ id: editing.destination.id, request })
    else await create.mutateAsync(request)
    toast.success(editing.mode === 'edit' ? 'היעד עודכן' : 'היעד נוסף', request.name)
    close()
  }

  function confirmDelete() {
    if (!toDelete) return
    remove.mutate(toDelete.id, {
      onSuccess: () => toast.success('היעד נמחק', toDelete.name),
      onError: (cause) => {
        const apiError = toApiError(cause)
        toast.error('היעד לא נמחק', apiError.status === 409 ? 'יש הסעות ליעד הזה. אפשר למחוק יעד רק כשאין אליו הסעות.' : apiError.headline)
      },
      onSettled: () => setToDelete(null),
    })
  }

  return (
    <section aria-labelledby="destinations-title">
      <div className={styles.toolbar}>
        <div>
          <h2 id="destinations-title" className={styles.title}>
            יעדים
          </h2>
          <p className={styles.lead}>המקומות שאליהם יוצאות ההסעות. כל יעד מקבל ציור לפי שמו.</p>
        </div>
        <Button icon={<Plus />} onClick={() => setEditing({ mode: 'create' })}>
          יעד חדש
        </Button>
      </div>

      {error ? (
        <ApiErrorAlert error={toApiError(error)} />
      ) : isPending ? (
        <div className={styles.cards}>
          <Skeleton height="14rem" radius="22px" />
          <Skeleton height="14rem" radius="22px" />
          <Skeleton height="14rem" radius="22px" />
        </div>
      ) : (
        <ul className={styles.cards}>
          {destinations.map((destination, index) => (
            <li key={destination.id} className={styles.item} style={{ animationDelay: `${index * 110}ms` }}>
              <Card padding="none" className={styles.destination}>
                <div className={styles.destinationArt}>
                  <SiteIllustration kind={siteKindFor(destination.name, destination.city)} />
                </div>
                <div className={styles.destinationBody}>
                  <h3 className={styles.cardTitle}>{destination.name}</h3>
                  <p className={styles.city}>{destination.city}</p>
                  {destination.description && <p className={styles.description}>{destination.description}</p>}
                  <div className={styles.rowActions}>
                    <Button variant="ghost" size="sm" icon={<Pencil />} onClick={() => setEditing({ mode: 'edit', destination })}>
                      עריכה
                    </Button>
                    <Button variant="ghost" size="sm" icon={<Trash2 />} className={styles.danger} onClick={() => setToDelete(destination)}>
                      מחיקה
                    </Button>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing.mode !== 'closed'} onClose={close} title={editing.mode === 'edit' ? 'עריכת יעד' : 'יעד חדש'}>
        {/* key: a fresh form for each destination, so its default values are the right ones. */}
        {editing.mode !== 'closed' && (
          <DestinationForm
            key={editing.mode === 'edit' ? editing.destination.id : 'new'}
            initial={editing.mode === 'edit' ? editing.destination : undefined}
            onSubmit={save}
            onCancel={close}
          />
        )}
      </Modal>

      <ConfirmDelete itemName={toDelete?.name ?? null} isDeleting={remove.isPending} onConfirm={confirmDelete} onClose={() => setToDelete(null)}>
        <p>אפשר למחוק רק יעד שאין אליו הסעות.</p>
      </ConfirmDelete>
    </section>
  )
}
