import { keepPreviousData, useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { adminApi } from '@/api/admin.api'
import { toursApi } from '@/api/tours.api'
import type { TourQuery } from '@/api/types'
import { tourKeys } from '@/features/tours/hooks/useTourData'

export const adminKeys = {
  pickupPoints: ['pickup-points'] as const,
  drivers: ['users', 'Driver'] as const,
}

/** The tours table: like the public list, plus cancelled tours (the server honors this for admins only). */
export function useAdminTours(query: TourQuery) {
  const withCancelled = { ...query, includeCancelled: true }
  return useQuery({
    queryKey: tourKeys.list(withCancelled),
    queryFn: ({ signal }) => toursApi.list(withCancelled, signal),
    placeholderData: keepPreviousData,
  })
}

export function usePickupPoints() {
  return useQuery({
    queryKey: adminKeys.pickupPoints,
    queryFn: ({ signal }) => adminApi.pickupPoints(signal),
  })
}

/** The drivers a tour can be assigned to. */
export function useDrivers() {
  return useQuery({
    queryKey: adminKeys.drivers,
    queryFn: ({ signal }) => adminApi.users('Driver', signal),
    staleTime: 5 * 60_000,
  })
}

/**
 * One shape for every admin write: run the request, then mark the given caches stale so every list that
 * shows this data refetches. A custom hook built on useMutation, so each screen only says what changes.
 */
export function useAdminMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>,
  invalidates: QueryKey[],
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => Promise.all(invalidates.map((queryKey) => queryClient.invalidateQueries({ queryKey }))),
  })
}
