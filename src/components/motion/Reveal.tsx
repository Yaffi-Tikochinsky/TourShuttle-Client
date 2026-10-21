import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { cx } from '@/lib/cx'

/** Any HTML attribute (aria-labelledby, id...) is passed on to the element. */
interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'> {
  children: ReactNode
  /** Milliseconds to wait, so items in a row appear one after another. */
  delay?: number
  as?: ElementType
  /** rise (default): up from below; scale: grows in from slightly smaller; side: slides in from the reading side. */
  variant?: 'rise' | 'scale' | 'side'
  className?: string
}

/**
 * Fades its content in and up a little when it first scrolls into view (.reveal in global.css).
 * With reduced motion the transition is instant, so the content simply appears.
 */
export function Reveal({ children, delay = 0, as: Component = 'div', variant = 'rise', className, ...rest }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>()
  return (
    <Component
      {...rest}
      ref={ref}
      className={cx('reveal', className)}
      data-visible={inView}
      data-variant={variant}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Component>
  )
}
