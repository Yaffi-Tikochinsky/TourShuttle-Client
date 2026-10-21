import { Suspense } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { WakingServerNotice } from '@/components/feedback/WakingServerNotice'
import { Spinner } from '@/components/ui'
import { Footer } from './Footer'
import { Header } from './Header'
import styles from './AppLayout.module.css'

/** The frame of every page: header, the current page (<Outlet />), footer. */
export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <div className={styles.layout}>
      <a href="#main" className={styles.skipLink}>
        דילוג לתוכן הראשי
      </a>
      <Header />
      <main id="main" className={styles.main} tabIndex={-1}>
        {/* A render error in one page stays in that page. key={pathname}: another page mounts a fresh boundary,
            so the error does not follow the user around. */}
        <ErrorBoundary key={pathname}>
          {/* Pages are lazy-loaded: while a page's code downloads, this fallback is shown. */}
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <WakingServerNotice />
      <ScrollRestoration />
    </div>
  )
}

function PageLoader() {
  return (
    <div className={styles.loader}>
      <Spinner size="lg" label="טוען את הדף…" />
    </div>
  )
}
