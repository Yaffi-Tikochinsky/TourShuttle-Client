import { createContext } from 'react'
import type { Tone } from '../Alert/Alert'

export interface ToastOptions {
  tone?: Tone
  title: string
  message?: string
  /** How long it stays, in milliseconds. */
  durationMs?: number
}

export interface ToastItem {
  id: number
  tone: Tone
  title: string
  message?: string
  durationMs: number
}

export interface ToastApi {
  show: (options: ToastOptions) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  dismiss: (id: number) => void
}

/** Kept in its own file so the provider file exports only components (needed for fast refresh in development). */
export const ToastContext = createContext<ToastApi | null>(null)
