import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '@/api/bookings.api'
import type { BookingRequest } from '@/api/types'
import { useAuth } from '@/features/auth/useAuth'
import { tourKeys } from '@/features/tours/hooks/useTourData'

export const bookingKeys = {
  mine: ['bookings', 'mine'] as const,
}

/**
 * The signed-in customer's bookings. Only customers have such a list, so for anyone else the query
 * stays switched off (`enabled`) and never reaches the server.
 */
export function useMyBookings() {
  const { user } = useAuth()
  return useQuery({
    queryKey: bookingKeys.mine,
    queryFn: ({ signal }) => bookingsApi.mine(signal),
    enabled: user?.role === 'Customer',
  })
}

/**
 * useMutation is TanStack Query's tool for requests that change data. After a booking, the seat counts
 * shown everywhere are stale, so the tours and the booking list are marked stale and refetched (invalidate).
 */
export function useCreateBooking(tourId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: BookingRequest) => bookingsApi.create(tourId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tourKeys.all })
      void queryClient.invalidateQueries({ queryKey: bookingKeys.mine })
    },
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingId: number) => bookingsApi.cancel(bookingId),
    // Returning the promise keeps the mutation "pending" until the fresh list has arrived,
    // so the optimistic view on the page hands over to real data without a flicker.
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: bookingKeys.mine }),
        queryClient.invalidateQueries({ queryKey: tourKeys.all }),
      ]),
  })
}
