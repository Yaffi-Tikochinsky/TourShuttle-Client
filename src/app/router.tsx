import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { AdminLayout } from '@/features/admin/components/AdminLayout'
import { GuestOnly, RequireRole } from '@/features/auth/RouteGuards'
import NotFoundPage from '@/features/system/NotFoundPage'
import { RouteErrorPage } from '@/features/system/RouteErrorPage'
import { pageLoaders } from './pageLoaders'

// This file defines routes, not UI, so fast refresh (which the lint rule protects) does not apply here.
/* oxlint-disable react/only-export-components */

// Code splitting: each page is its own JavaScript file, downloaded the first time someone opens it.
// While it downloads, <Suspense> in AppLayout shows a spinner. NotFoundPage stays in the main bundle:
// it is tiny, and the error page needs it even when downloading code is what failed.
// The import functions live in pageLoaders, so other code can preload a page before it is opened.
const HomePage = lazy(pageLoaders.home)
const LoginPage = lazy(pageLoaders.login)
const RegisterPage = lazy(pageLoaders.register)
const ToursPage = lazy(pageLoaders.tours)
const TourDetailsPage = lazy(pageLoaders.tourDetails)
const MyBookingsPage = lazy(pageLoaders.myBookings)
const DriverToursPage = lazy(pageLoaders.driverTours)
const PassengersPage = lazy(pageLoaders.passengers)
const AdminToursPage = lazy(pageLoaders.adminTours)
const TourFormPage = lazy(pageLoaders.tourForm)
const DestinationsPage = lazy(pageLoaders.adminDestinations)
const PickupPointsPage = lazy(pageLoaders.adminPickupPoints)

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
      {
        // Nested routes: the guard, then the admin frame, then the section. Each level renders the next in <Outlet />.
        path: 'admin',
        element: <RequireRole roles={['Admin']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="tours" replace /> },
              { path: 'tours', element: <AdminToursPage /> },
              { path: 'destinations', element: <DestinationsPage /> },
              { path: 'pickup-points', element: <PickupPointsPage /> },
            ],
          },
          // The tour form is a full page of its own, outside the tabs frame.
          { path: 'tours/new', element: <TourFormPage /> },
          { path: 'tours/:id/edit', element: <TourFormPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
