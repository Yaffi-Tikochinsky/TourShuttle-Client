import { useCallback, useSyncExternalStore } from 'react'

/**
 * True while a CSS media query matches, updated live (window resized, system theme switched).
 * The browser is an "external store" React does not own, so this uses useSyncExternalStore
 * instead of useState + useEffect, which could show a stale value for one render.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}
