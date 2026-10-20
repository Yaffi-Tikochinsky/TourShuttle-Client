import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X, XOctagon } from 'lucide-react'
import { cx } from '@/lib/cx'
import type { Tone } from '../Alert/Alert'
import { ToastContext, type ToastApi, type ToastItem, type ToastOptions } from './toastContext'
import styles from './Toast.module.css'

type Action = { type: 'add'; toast: ToastItem } | { type: 'remove'; id: number }

// A reducer: the toast list changes only through these two named actions, which keeps the logic in one place.
function reducer(toasts: ToastItem[], action: Action): ToastItem[] {
  switch (action.type) {
    case 'add':
      // Newest on top, at most four on screen.
      return [action.toast, ...toasts].slice(0, 4)
    case 'remove':
      return toasts.filter((toast) => toast.id !== action.id)
  }
}

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, [])

  // The API object is created once (dispatch never changes), so components that depend on it do not re-run effects.
  const api = useMemo<ToastApi>(() => {
    const show = ({ tone = 'info', title, message, durationMs = 5000 }: ToastOptions) =>
      dispatch({ type: 'add', toast: { id: nextId++, tone, title, message, durationMs } })
    return {
      show,
      success: (title, message) => show({ tone: 'success', title, message }),
      error: (title, message) => show({ tone: 'danger', title, message, durationMs: 8000 }),
      info: (title, message) => show({ tone: 'info', title, message }),
      dismiss: (id) => dispatch({ type: 'remove', id }),
    }
  }, [])

  return (
    <ToastContext value={api}>
      {children}
      {/* A portal: rendered at the end of <body>, outside every container, so no overflow or z-index can hide it. */}
      {createPortal(
        <section className={styles.region} aria-label="הודעות" aria-live="polite">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} dismiss={api.dismiss} />
          ))}
        </section>,
        document.body,
      )}
    </ToastContext>
  )
}

const icons: Record<Tone, ReactNode> = {
  info: <Info aria-hidden="true" />,
  success: <CheckCircle2 aria-hidden="true" />,
  warning: <AlertTriangle aria-hidden="true" />,
  danger: <XOctagon aria-hidden="true" />,
}

function Toast({ toast, dismiss }: { toast: ToastItem; dismiss: (id: number) => void }) {
  // Each toast closes itself. The cleanup clears the timer if it is closed by hand first.
  // Every dependency is stable (dismiss comes from the memoized API), so a new toast does not restart this timer.
  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(toast.id), toast.durationMs)
    return () => window.clearTimeout(timer)
  }, [toast.id, toast.durationMs, dismiss])

  const onDismiss = () => dismiss(toast.id)

  return (
    <div className={cx(styles.toast, styles[toast.tone])} role={toast.tone === 'danger' ? 'alert' : 'status'}>
      <span className={styles.icon}>{icons[toast.tone]}</span>
      <div className={styles.content}>
        <p className={styles.title}>{toast.title}</p>
        {toast.message && <p className={styles.message}>{toast.message}</p>}
      </div>
      <button type="button" className={styles.close} onClick={onDismiss} aria-label="סגירת ההודעה">
        <X aria-hidden="true" />
      </button>
      <span className={styles.timer} style={{ animationDuration: `${toast.durationMs}ms` }} aria-hidden="true" />
    </div>
  )
}
