import { useEffect, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Starts fast and settles slowly into the final number (ease-out cubic). */
const easeOut = (t: number) => 1 - (1 - t) ** 3

/**
 * Counts from 0 up to `target` once `start` is true, over `durationMs`.
 * requestAnimationFrame draws one step per screen frame; the cleanup cancels the next frame
 * if the component leaves the screen or the target changes mid-count.
 */
export function useCountUp(target: number | undefined, start: boolean, durationMs = 1600): number | undefined {
  const [value, setValue] = useState<number | undefined>(undefined)
  // With reduced motion there is nothing to animate: the final number is derived during render, no effect needed.
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (target === undefined || !start || reduced) return

    let frame = 0
    const begin = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - begin) / durationMs, 1)
      setValue(Math.round(easeOut(progress) * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, start, durationMs, reduced])

  if (target === undefined) return undefined
  return reduced ? target : value
}
