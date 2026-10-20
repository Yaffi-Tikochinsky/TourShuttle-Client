import { Home } from 'lucide-react'
import { ButtonLink } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { StatusPage } from './StatusPage'

/** Shown by <RequireRole> when a signed-in user opens a page meant for another role. */
export function ForbiddenPage() {
  useDocumentTitle('אין הרשאה')
  return (
    <StatusPage
      code="403"
      title="הדף הזה שמור לבעלי הרשאה אחרת"
      description="החשבון שלך מחובר, אבל אין לו גישה לאזור הזה. אם לדעתך זו טעות, פנו למנהל המערכת."
      actions={
        <ButtonLink to="/" icon={<Home />}>
          לדף הבית
        </ButtonLink>
      }
    />
  )
}
