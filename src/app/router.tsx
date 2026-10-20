import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { GuestOnly } from '@/features/auth/RouteGuards'
import NotFoundPage from '@/features/system/NotFoundPage'
import { RouteErrorPage } from '@/features/system/RouteErrorPage'

// This file defines routes, not UI, so fast refresh (which the lint rule protects) does not apply here.
/* oxlint-disable react/only-export-components */

// Code splitting: each page is its own JavaScript file, downloaded the first time someone opens it.
// While it downloads, <Suspense> in AppLayout shows a spinner. NotFoundPage stays in the main bundle:
// it is tiny, and the error page needs it even when downloading code is what failed.
const HomePage = lazy(() => import('@/features/home/HomePage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'login',
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        ),
      },
      // Stages 9b-9f add: tours, tours/:id, my-bookings (Customer), driver (Driver), admin (Admin).
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
