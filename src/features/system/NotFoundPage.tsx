import { Home } from 'lucide-react'
import { ButtonLink } from '@/components/ui'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { StatusPage } from './StatusPage'

export default function NotFoundPage() {
  useDocumentTitle('הדף לא נמצא')
  return (
    <StatusPage
      code="404"
      title="השביל הזה לא מוביל לשום מקום"
      description="ייתכן שהקישור שגוי או שהדף הוסר. אפשר לחזור לדף הבית ולהמשיך משם."
      actions={
        <ButtonLink to="/" icon={<Home />}>
          לדף הבית
        </ButtonLink>
      }
    />
  )
}
