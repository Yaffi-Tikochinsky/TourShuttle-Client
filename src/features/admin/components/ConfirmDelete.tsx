import type { ReactNode } from 'react'
import { Trash2 } from 'lucide-react'
import { Button, Modal } from '@/components/ui'

interface ConfirmDeleteProps {
  /** What is about to be deleted; null keeps the dialog closed. */
  itemName: string | null
  /** Why it matters, for example "Tours to this destination will not be possible". */
  children?: ReactNode
  isDeleting: boolean
  onConfirm: () => void
  onClose: () => void
}

/** "Delete X?" with the irreversible button in danger red and "keep" as the safe default. */
export function ConfirmDelete({ itemName, children, isDeleting, onConfirm, onClose }: ConfirmDeleteProps) {
  return (
    <Modal
      open={itemName !== null}
      onClose={onClose}
      title={`למחוק את ${itemName ?? ''}?`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            ביטול
          </Button>
          <Button variant="danger" icon={<Trash2 />} isLoading={isDeleting} onClick={onConfirm}>
            מחיקה
          </Button>
        </>
      }
    >
      {children}
      <p>אי אפשר לבטל את המחיקה.</p>
    </Modal>
  )
}
