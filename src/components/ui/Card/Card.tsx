import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cx } from '@/lib/cx'
import styles from './Card.module.css'

type CardProps<T extends ElementType> = {
  /** Render as another element (section, article, li) while keeping the card look: polymorphic component. */
  as?: T
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Lifts on hover; for cards that are links or buttons. */
  interactive?: boolean
} & Omit<ComponentPropsWithoutRef<T>, 'as'>

export function Card<T extends ElementType = 'div'>({
  as,
  padding = 'md',
  interactive = false,
  className,
  ...rest
}: CardProps<T>) {
  const Component: ElementType = as ?? 'div'
  return (
    <Component
      className={cx(styles.card, styles[`padding-${padding}`], interactive && styles.interactive, className)}
      {...rest}
    />
  )
}
