import { useEffect, useState } from 'react'
import { useIsFetching } from '@tanstack/react-query'
import { Coffee } from 'lucide-react'
import styles from './WakingServerNotice.module.css'

/** How long loading may take before it is worth explaining. */
const PATIENCE_MS = 6000

/**
 * The free Render plan puts the API to sleep after 15 quiet minutes, and the first request then waits up to a
 * minute while it wakes. Instead of a loader that seems stuck, a quiet note explains it, only when any request
 * has been running for more than six seconds. useIsFetching counts every TanStack Query request in flight.
 */
export function WakingServerNotice() {
  const fetching = useIsFetching() > 0
  const [slow, setSlow] = useState(false)

  // A timer is something outside React, so an effect: start it when loading starts, cancel it when loading ends.
  // State is set only inside the timer's callback, never directly in the effect.
  useEffect(() => {
    if (!fetching) return
    const timer = window.setTimeout(() => setSlow(true), PATIENCE_MS)
    return () => {
      window.clearTimeout(timer)
      setSlow(false)
    }
  }, [fetching])

  if (!fetching || !slow) return null

  return (
    <div className={styles.notice} role="status">
      <Coffee aria-hidden="true" />
      <p>
        <strong>השרת מתעורר משינה.</strong> בפעם הראשונה אחרי הפסקה זה לוקח עד דקה, ומשם הכול מהיר.
      </p>
    </div>
  )
}
