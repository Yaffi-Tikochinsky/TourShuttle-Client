import { useEffect, useRef, useState } from 'react'

/**
 * True once the element has scrolled into view (and stays true: content is revealed once, not on every pass).
 * IntersectionObserver lets the browser report visibility, instead of measuring on every scroll event.
 */
export function useInView<T extends Element>(options: IntersectionObserverInit = { rootMargin: '0px 0px -8% 0px' }) {
  const ref = useRef<T>(null)
  // Very old browsers or test environments have no IntersectionObserver: start visible (lazy initial state),
  // rather than setting state inside the effect, which would cost an extra render.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')
  const { root, rootMargin, threshold } = options

  useEffect(() => {
    const element = ref.current
    if (!element || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { root, rootMargin, threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [inView, root, rootMargin, threshold])

  return [ref, inView] as const
}
