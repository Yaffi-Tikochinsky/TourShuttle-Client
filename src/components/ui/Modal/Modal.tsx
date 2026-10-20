import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  /** Called for Escape, a click on the backdrop, and the close button. */
  onClose: () => void
  title: ReactNode
  children?: ReactNode
  /** Buttons at the bottom, such as "cancel" and "confirm". */
  footer?: ReactNode
  /** An illustration above the title. */
  visual?: ReactNode
  className?: string
}

/**
 * A modal built on the native <dialog>. showModal() gives what a hand-made modal needs a lot of code for:
 * it renders in the browser's top layer (above everything, so no portal and no z-index), makes the rest
 * of the page inert, keeps Tab inside the dialog (focus trap), closes on Escape, and returns focus to the
 * button that opened it. React only syncs the `open` prop to the element.
 */
export function Modal({ open, onClose, title, children, footer, visual, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // An effect is right here: it synchronizes React state with something outside React (the DOM element's own state).
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={cx(styles.dialog, className)}
      aria-labelledby={titleId}
      // Escape closes the dialog by itself; onClose tells React, so the `open` prop stays in step.
      onClose={onClose}
      // A click whose target is the <dialog> itself landed on the backdrop (the content is inside .panel).
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.panel}>
        <button type="button" className={styles.close} aria-label="סגירה" onClick={onClose}>
          <X aria-hidden="true" />
        </button>
        {visual && <div className={styles.visual}>{visual}</div>}
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {children && <div className={styles.body}>{children}</div>}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  )
}
