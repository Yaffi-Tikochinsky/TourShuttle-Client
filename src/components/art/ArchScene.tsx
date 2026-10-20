import { useId } from 'react'
import { cx } from '@/lib/cx'
import styles from './art.module.css'

/**
 * The hero drawing: a gate of the Old City in fine line, set in faded courses of Jerusalem stone.
 * Through the arch: hills, a path winding away, a soft glow of light (no sun disc), and drifting specks of dust.
 * useId keeps the gradient and clip ids unique if the scene appears twice on a page.
 */
export function ArchScene({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const clip = `arch-clip-${id}`
  const fog = `arch-fog-${id}`
  const light = `arch-light-${id}`

  return (
    <svg viewBox="0 0 420 380" className={cx(styles.svg, className)} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <path d="M140 380V170a70 70 0 0 1 140 0v210z" />
        </clipPath>
        {/* Fades the stone courses out at both sides, so the wall dissolves into the page. */}
        <linearGradient id={fog} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-bg)" stopOpacity="1" />
          <stop offset="0.32" stopColor="var(--color-bg)" stopOpacity="0" />
          <stop offset="0.68" stopColor="var(--color-bg)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-bg)" stopOpacity="1" />
        </linearGradient>
        <radialGradient id={light} cx="0.5" cy="0.42" r="0.55">
          <stop offset="0" stopColor="var(--art-glow)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--art-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Courses of stone, offset like a real wall */}
      <g className={styles.soft}>
        <path d="M0 110h420M0 150h420M0 190h420M0 230h420M0 270h420M0 310h420M0 350h420" />
        <path d="M30 110v40M110 110v40M310 110v40M390 110v40M70 150v40M350 150v40M30 190v40M390 190v40M70 230v40M350 230v40M30 270v40M110 270v40M310 270v40M390 270v40M70 310v40M350 310v40" />
      </g>
      <rect width="420" height="380" fill={`url(#${fog})`} />

      {/* Inside the gate */}
      <g clipPath={`url(#${clip})`}>
        <rect x="140" y="90" width="140" height="290" className={styles.paper} />
        <ellipse cx="210" cy="220" rx="120" ry="110" fill={`url(#${light})`} />
        <path d="M120 300c34-24 66-28 98-16s54 8 82-6v110H120z" className={styles.hillFar} />
        <path d="M120 332c38-18 76-16 108-6s44 6 72-4v70H120z" className={styles.hillNear} />
        <path d="M176 380c8-26 20-40 38-44s28-14 22-30" className={styles.path} />
      </g>

      {/* The gate itself: an inner and an outer arch, and a keystone */}
      <path d="M140 380V170a70 70 0 0 1 140 0v210" className={styles.line} />
      <path d="M122 380V170a88 88 0 0 1 176 0v210" className={styles.lineThin} />
      <path d="M201 82h18v12h-18z" className={styles.line} />

      {/* Olive branches at the foot of the wall, swaying slightly */}
      <g className={cx(styles.olive, styles.sway)}>
        <path d="M352 372c-7-42 5-78 32-110" />
        <path d="M358 340c-20-3-32-15-35-30 17 0 31 11 35 30zM365 312c18-7 28-21 28-37-17 4-27 18-28 37zM372 284c-18-4-28-17-28-31 17 4 26 17 28 31zM380 262c15-9 22-23 20-38-15 7-21 21-20 38z" />
      </g>
      <g className={cx(styles.olive, styles.sway)}>
        <path d="M66 372c5-32-2-58-18-80" />
        <path d="M62 344c16-2 25-11 28-24-14 0-24 10-28 24zM55 318c-15-4-23-14-24-27 13 2 22 12 24 27z" />
      </g>

      {/* Dust in the light */}
      <g>
        <circle className={styles.mote} cx="188" cy="186" r="1.6" />
        <circle className={styles.mote} cx="232" cy="168" r="1.2" />
        <circle className={styles.mote} cx="214" cy="204" r="1" />
        <circle className={styles.mote} cx="176" cy="214" r="1.3" />
        <circle className={styles.mote} cx="244" cy="206" r="1.4" />
        <circle className={styles.mote} cx="206" cy="150" r="1" />
      </g>
    </svg>
  )
}
