import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/errors'

/**
 * The cache for server data (TanStack Query, the library behind useQuery).
 * - staleTime: data younger than 30 seconds is used as-is, without asking the server again.
 * - retry: network hiccups and 5xx are retried twice; 4xx are not (asking again gives the same answer).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})
