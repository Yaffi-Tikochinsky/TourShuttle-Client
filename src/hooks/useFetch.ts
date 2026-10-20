import { useEffect, useState } from 'react'
import { toApiError, type ApiError } from '@/lib/errors'

type FetchState<T> =
  | { status: 'loading'; data: undefined; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: undefined; error: ApiError }

/**
 * Loading data by hand, to see what useQuery does for us. Written once, on purpose, for a small list
 * (the cities); everything else in the app uses TanStack Query's useQuery.
 *
 * What this handles:
 * - a status union, so "data" exists only when status is "success" (TypeScript enforces it),
 * - AbortController: when the component unmounts, or `load` changes, the old request is cancelled,
 *   so a slow, stale answer can never overwrite a newer one.
 * What useQuery adds on top: a shared cache (two components asking for the same data make one request),
 * retries, refetching when the window regains focus, deduplication, and invalidation after a change.
 *
 * `load` must be stable (defined outside the component or wrapped in useCallback), or the effect re-runs every render.
 */
export function useFetch<T>(load: (signal: AbortSignal) => Promise<T>): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: 'loading', data: undefined, error: null })

  useEffect(() => {
    const controller = new AbortController()

    load(controller.signal)
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return // cancelled on purpose: not an error
        setState({ status: 'error', data: undefined, error: toApiError(error) })
      })

    // Cleanup runs before the next effect and on unmount: the in-flight request is abandoned.
    return () => controller.abort()
  }, [load])

  return state
}
