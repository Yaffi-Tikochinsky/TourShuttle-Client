import { use } from 'react'
import { ToastContext, type ToastApi } from './toastContext'

/** Shows short messages ("Booking confirmed") from anywhere under <ToastProvider>. */
export function useToast(): ToastApi {
  // React 19's `use` reads a context like useContext (and, unlike hooks, may also be called conditionally).
  const api = use(ToastContext)
  if (!api) throw new Error('useToast must be used inside <ToastProvider>.')
  return api
}
