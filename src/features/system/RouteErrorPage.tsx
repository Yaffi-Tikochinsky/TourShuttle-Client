import { isRouteErrorResponse, useRouteError } from 'react-router'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'
import NotFoundPage from './NotFoundPage'
import { StatusPage } from './StatusPage'

/**
 * The router's last line of defence: an error outside the page's own ErrorBoundary
 * (for example the layout itself failed, or a lazy page's code could not be downloaded).
 */
export function RouteErrorPage() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />

  return (
    <StatusPage
      code="אופס"
      title="משהו השתבש"
      description="לא הצלחנו לטעון את הדף. ייתכן שיצאה גרסה חדשה של האתר; רענון של הדף בדרך כלל פותר את זה."
      actions={
        <Button icon={<RotateCcw />} onClick={() => window.location.reload()}>
          רענון הדף
        </Button>
      }
    />
  )
}
