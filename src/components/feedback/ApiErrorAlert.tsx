import type { ReactNode } from 'react'
import { Alert } from '@/components/ui'
import type { ApiError } from '@/lib/errors'

interface ApiErrorAlertProps {
  error: ApiError
  /** Replaces the default Hebrew headline for this status. */
  title?: string
  action?: ReactNode
  className?: string
}

/**
 * Any API error, one look: a Hebrew headline by status, the server's own detail, and the correlation id
 * the user can quote (it matches the server's log lines for that request).
 */
export function ApiErrorAlert({ error, title, action, className }: ApiErrorAlertProps) {
  const tone = error.status === 409 || error.status === 400 ? 'warning' : 'danger'
  return (
    <Alert tone={tone} title={title ?? error.headline} action={action} className={className}>
      {/* The server writes in English: dir="auto" lays it out left-to-right, so its final period stays at the end. */}
      {error.detail && <p dir="auto">{error.detail}</p>}
      {error.correlationId && (
        <p style={{ opacity: 0.75, fontSize: 'var(--text-xs)' }}>
          מספר פנייה: <bdi dir="ltr">{error.correlationId}</bdi>
        </p>
      )}
    </Alert>
  )
}
