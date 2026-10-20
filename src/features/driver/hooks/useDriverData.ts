import { useQuery } from '@tanstack/react-query'
import { driversApi } from '@/api/drivers.api'

export const driverKeys = {
  tours: ['driver', 'tours'] as const,
  passengers: (tourId: number) => ['driver', 'passengers', tourId] as const,
}

export function useDriverTours() {
  return useQuery({
    queryKey: driverKeys.tours,
    queryFn: ({ signal }) => driversApi.myTours(signal),
  })
}

/**
 * The passenger list changes while customers book and cancel, so on the morning of the tour the driver
 * wants it fresh: refetched every minute while the page is open, and whenever the window regains focus.
 */
export function usePassengers(tourId: number) {
  return useQuery({
    queryKey: driverKeys.passengers(tourId),
    queryFn: ({ signal }) => driversApi.passengers(tourId, signal),
    enabled: Number.isInteger(tourId) && tourId > 0,
    refetchInterval: 60_000,
  })
}
