/*
  The dynamic imports of the lazy pages, in one place. The router wraps each in React.lazy; anything else
  can call the same function early to download a page before it is opened (a preload). The browser keeps
  one copy of each module, so calling a loader twice downloads the file once.
*/
export const pageLoaders = {
  home: () => import('@/features/home/HomePage'),
  login: () => import('@/features/auth/pages/LoginPage'),
  register: () => import('@/features/auth/pages/RegisterPage'),
  tours: () => import('@/features/tours/pages/ToursPage'),
  tourDetails: () => import('@/features/tours/pages/TourDetailsPage'),
  myBookings: () => import('@/features/bookings/pages/MyBookingsPage'),
  driverTours: () => import('@/features/driver/pages/DriverToursPage'),
  passengers: () => import('@/features/driver/pages/PassengersPage'),
  adminTours: () => import('@/features/admin/pages/AdminToursPage'),
  tourForm: () => import('@/features/admin/pages/TourFormPage'),
  adminDestinations: () => import('@/features/admin/pages/DestinationsPage'),
  adminPickupPoints: () => import('@/features/admin/pages/PickupPointsPage'),
  adminDrivers: () => import('@/features/admin/pages/DriversPage'),
}

/**
 * Once the first page has loaded and the browser is idle, download the pages most visits go to next
 * (the tours list and a tour's page), so opening them later shows no spinner.
 */
export function preloadLikelyPages() {
  const run = () => {
    void pageLoaders.tours()
    void pageLoaders.tourDetails()
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 2000)
}
