import { useCallback, useMemo, useTransition } from 'react'
import { useSearchParams } from 'react-router'
import type { SortDirection, TourQuery, TourSortBy } from '@/api/types'

export const PAGE_SIZE = 9

export type SortOption = `${TourSortBy}-${SortDirection}`

export const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'Departure-Asc', label: 'היציאה הקרובה ביותר' },
  { value: 'Departure-Desc', label: 'היציאה המאוחרת ביותר' },
  { value: 'Price-Asc', label: 'מחיר: מהזול ליקר' },
  { value: 'Price-Desc', label: 'מחיר: מהיקר לזול' },
]

/**
 * The tours list's filters live in the URL (?city=...&destinationId=...&sort=...&page=...), not in useState:
 * a search can be bookmarked and shared, a reload keeps it, and Back returns to the previous search.
 * Changes run inside a transition, so React keeps showing the current results until the new ones are ready.
 */
export function useTourFilters() {
  const [params, setParams] = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const city = params.get('city') ?? ''
  const destinationId = toPositiveInt(params.get('destinationId'))
  const sort = (sortOptions.some((o) => o.value === params.get('sort')) ? params.get('sort') : 'Departure-Asc') as SortOption
  const page = toPositiveInt(params.get('page')) ?? 1

  const query = useMemo<TourQuery>(() => {
    const [sortBy, sortDirection] = sort.split('-') as [TourSortBy, SortDirection]
    return { city: city || undefined, destinationId, sortBy, sortDirection, page, pageSize: PAGE_SIZE }
  }, [city, destinationId, sort, page])

  /** Sets or clears parameters. Any change other than the page itself starts again from page 1. */
  const update = useCallback(
    (changes: Partial<Record<'city' | 'destinationId' | 'sort' | 'page', string | number | null>>) => {
      startTransition(() => {
        setParams((current) => {
          const next = new URLSearchParams(current)
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === '' || value === undefined) next.delete(key)
            else next.set(key, String(value))
          }
          if (!('page' in changes)) next.delete('page')
          return next
        })
      })
    },
    [setParams],
  )

  return { city, destinationId, sort, page, query, update, isPending }
}

function toPositiveInt(value: string | null): number | undefined {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : undefined
}
