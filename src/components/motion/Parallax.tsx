import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Parallax.module.css'

interface ParallaxProps {
  children: ReactNode
  /** How far the content travels while it crosses the screen: 'slow' a little, 'normal' a bit more. */
  speed?: 'slow' | 'normal'
  className?: string
}

/**
 * Moves decorative content a little against the scroll, so the page feels deep. Pure CSS: a scroll-driven
 * animation tied to the element's position in the viewport (animation-timeline: view()), so no scroll listener
 * runs in JavaScript. Browsers without it, and people who prefer less motion, see the content still.
 */
export function Parallax({ children, speed = 'slow', className }: ParallaxProps) {
  return <div className={cx(styles[speed], className)}>{children}</div>
}
