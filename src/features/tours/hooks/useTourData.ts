import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { pageLoaders } from '@/app/pageLoaders'
import { destinationsApi, pickupPointsApi, toursApi } from '@/api/tours.api'
import type { TourQuery } from '@/api/types'
import { useFetch } from '@/hooks/useFetch'

/*
  Server data for the tours area. Query keys name what is cached: ['tours', query] is a different cache entry
  for every filter combination, so going back to a previous filter shows it instantly from the cache.
*/

export const tourKeys = {
  all: ['tours'] as const,
  list: (query: TourQuery) => ['tours', 'list', query] as const,
  detail: (id: number) => ['tours', 'detail', id] as const,
}

/** One page of tours. While the next filter loads, the previous results stay on screen (keepPreviousData). */
export function useTours(query: TourQuery) {
  return useQuery({
    queryKey: tourKeys.list(query),
    queryFn: ({ signal }) => toursApi.list(query, signal),
    placeholderData: keepPreviousData,
  })
}

export function useTour(id: number) {
  return useQuery({
    queryKey: tourKeys.detail(id),
    queryFn: ({ signal }) => toursApi.get(id, signal),
    enabled: Number.isInteger(id) && id > 0,
  })
}

/**
 * Returns a function that starts loading a tour's page before it is opened: its code and its data.
 * Called on hover or focus, it usually finishes in the moment between pointing and clicking.
 * prefetchQuery does nothing if fresh data is already cached (staleTime), so repeated hovers are free.
 */
export function usePrefetchTour(id: number) {
  const queryClient = useQueryClient()
  return () => {
    void pageLoaders.tourDetails()
    void queryClient.prefetchQuery({
      queryKey: tourKeys.detail(id),
      queryFn: ({ signal }) => toursApi.get(id, signal),
      staleTime: 30_000,
    })
  }
}

/** Destinations change rarely: cached for ten minutes. */
export function useDestinations() {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: ({ signal }) => destinationsApi.list(signal),
    staleTime: 10 * 60_000,
  })
}

/** The cities with stops, loaded with the hand-written useFetch (see hooks/useFetch for the comparison). */
export function useCities() {
  return useFetch(pickupPointsApi.cities)
}
