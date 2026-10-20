import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { cx } from '@/lib/cx'

interface RevealProps {
  children: ReactNode
  /** Milliseconds to wait, so items in a row appear one after another. */
  delay?: number
  as?: ElementType
  className?: string
}

/**
 * Fades its content in and up a little when it first scrolls into view (.reveal in global.css).
 * With reduced motion the transition is instant, so the content simply appears.
 */
export function Reveal({ children, delay = 0, as: Component = 'div', className }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Component
      ref={ref}
      className={cx('reveal', className)}
      data-visible={inView}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Component>
  )
}
