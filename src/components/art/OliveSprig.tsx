import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import styles from './art.module.css'

/*
  An olive sprig drawn in its own coordinates: the stem starts at (0,0) and grows up to about (32,-110).
  Each leaf is its own path, pivoting on its base, so leaves stir one by one rather than as one block.
*/
const leaves = [
  { d: 'M6 -32c-20-3-32-15-35-30 17 0 31 11 35 30z', side: 'left', duration: 9, offset: 0 },
  { d: 'M13 -60c18-7 28-21 28-37-17 4-27 18-28 37z', side: 'right', duration: 11, offset: -3.5 },
  { d: 'M20 -88c-18-4-28-17-28-31 17 4 26 17 28 31z', side: 'left', duration: 10, offset: -6 },
  { d: 'M28 -110c15-9 22-23 20-38-15 7-21 21-20 38z', side: 'right', duration: 12, offset: -1.5 },
] as const

interface OliveSprigProps {
  /** Where the foot of the stem sits, in the parent drawing's coordinates. */
  x: number
  y: number
  scale?: number
  /** Grow toward the other side. */
  mirror?: boolean
  /** Shifts every leaf's timing, so two sprigs on one drawing never move in step. */
  phase?: number
}

export function OliveSprig({ x, y, scale = 1, mirror = false, phase = 0 }: OliveSprigProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${mirror ? -scale : scale} ${scale})`}>
      {/* The whole sprig sways slowly from its foot; the leaves add their own small movement on top. */}
      <g className={styles.sway} style={{ animationDelay: `${-phase * 2}s` } as CSSProperties}>
        <path className={styles.olive} d="M0 0c-7-42 5-78 32-110" />
        {leaves.map((leaf) => (
          <path
            key={leaf.d}
            className={cx(styles.olive, styles.leaf, leaf.side === 'left' ? styles.leafLeft : styles.leafRight)}
            style={{ animationDuration: `${leaf.duration}s`, animationDelay: `${leaf.offset - phase}s` } as CSSProperties}
            d={leaf.d}
          />
        ))}
      </g>
    </g>
  )
}
