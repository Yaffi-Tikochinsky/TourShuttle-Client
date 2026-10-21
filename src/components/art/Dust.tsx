import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import styles from './art.module.css'

interface DustProps {
  /** How many specks. */
  count?: number
  /** A different seed scatters the specks differently, so two sections never look alike. */
  seed?: number
  className?: string
}

/** A repeatable "random" number between 0 and 1: the same index and salt always give the same value. */
function scatter(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Specks of dust in the light, like the motes in the gate on the home page: each rises and drifts slowly,
 * glows, and fades, on its own timing. Placed behind a section's content; purely decorative.
 * The positions come from `scatter`, not Math.random, so every render gives the same picture (a pure component).
 */
export function Dust({ count = 14, seed = 1, className }: DustProps) {
  return (
    <div className={cx(styles.dust, className)} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const r = (salt: number) => scatter(i + seed * 37, salt)
        const style = {
          left: `${(r(1) * 100).toFixed(1)}%`,
          top: `${(10 + r(2) * 80).toFixed(1)}%`,
          '--size': `${(2 + r(3) * 3).toFixed(1)}px`,
          '--duration': `${(13 + r(4) * 11).toFixed(1)}s`,
          '--delay': `${(-r(5) * 24).toFixed(1)}s`,
          '--dx': `${((r(6) - 0.5) * 60).toFixed(0)}px`,
          '--dy': `${(-(40 + r(7) * 70)).toFixed(0)}px`,
        } as CSSProperties
        return <span key={i} style={style} />
      })}
    </div>
  )
}
