import { useEffect, useState } from 'react'

/**
 * The current time, refreshed every `intervalMs` (a minute by default), for countdowns like "leaves in 40 minutes".
 * One timer per component; the cleanup stops it when the component leaves the screen.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])

  return now
}
