import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { GuestOnly, RequireRole } from '@/features/auth/RouteGuards'
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
const ToursPage = lazy(() => import('@/features/tours/pages/ToursPage'))
const TourDetailsPage = lazy(() => import('@/features/tours/pages/TourDetailsPage'))
const MyBookingsPage = lazy(() => import('@/features/bookings/pages/MyBookingsPage'))
const DriverToursPage = lazy(() => import('@/features/driver/pages/DriverToursPage'))
const PassengersPage = lazy(() => import('@/features/driver/pages/PassengersPage'))

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
      { path: 'tours', element: <ToursPage /> },
      { path: 'tours/:id', element: <TourDetailsPage /> },
      {
        path: 'my-bookings',
        element: (
          <RequireRole roles={['Customer']}>
            <MyBookingsPage />
          </RequireRole>
        ),
      },
      {
        path: 'driver',
        element: <RequireRole roles={['Driver']} />,
        children: [{ index: true, element: <DriverToursPage /> }],
      },
      {
        // The passenger list: the tour's driver, or an admin (the server checks which driver).
        path: 'driver/tours/:id',
        element: (
          <RequireRole roles={['Driver', 'Admin']}>
            <PassengersPage />
          </RequireRole>
        ),
      },
      // Stage 9f adds: admin (Admin).
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
