import { useEffect, useState } from 'react'

interface InViewOptions extends IntersectionObserverInit {
  /** True (default): becomes true once and stays, for reveal-on-scroll. False: follows the element in and out. */
  once?: boolean
}

/**
 * Whether the element is on screen. By default it turns true once and stays true (content is revealed once,
 * not on every pass); with `once: false` it tracks the element live, for things that react to it scrolling away.
 * IntersectionObserver lets the browser report visibility, instead of measuring on every scroll event.
 *
 * The returned ref is a callback ref (a setter React calls with the element): the effect re-runs when the element
 * actually appears, even if it mounts later than the component (for example after a loading skeleton).
 * A useRef would not tell the effect that its .current changed.
 */
export function useInView<T extends Element>({ once = true, ...options }: InViewOptions = { rootMargin: '0px 0px -8% 0px' }) {
  const [element, setElement] = useState<T | null>(null)
  // Very old browsers or test environments have no IntersectionObserver: start visible (lazy initial state),
  // rather than setting state inside the effect, which would cost an extra render.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  const { root, rootMargin, threshold } = options
  const done = once && inView

  useEffect(() => {
    if (!element || done) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (once) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        } else {
          setInView(entry.isIntersecting)
        }
      },
      { root, rootMargin, threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [element, done, once, root, rootMargin, threshold])

  return [setElement, inView] as const
}
