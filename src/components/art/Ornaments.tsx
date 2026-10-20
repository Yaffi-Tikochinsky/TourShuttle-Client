import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import { OliveSprig } from './OliveSprig'
import styles from './art.module.css'

/** A thin rule with an olive sprig in the middle, between sections. The stem draws itself once; the leaves stir. */
export function OliveDivider({ className }: { className?: string }) {
  const leaf = (d: string, side: 'left' | 'right', duration: number, delay: number) => (
    <path
      d={d}
      className={cx(styles.olive, styles.leaf, side === 'left' ? styles.leafLeft : styles.leafRight)}
      style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` } as CSSProperties}
    />
  )
  return (
    <svg viewBox="0 0 240 40" className={cx(styles.svg, className)} aria-hidden="true" focusable="false">
      <path d="M20 20h78M142 20h78" className={styles.soft} />
      <path className={cx(styles.olive, styles.drawIn)} d="M98 20c14-2 30 0 44 0" />
      {leaf('M110 20c-6-8-6-15 0-21 5 7 6 14 0 21z', 'left', 10, 0)}
      {leaf('M126 20c6-8 14-11 22-9-4 8-12 11-22 9z', 'right', 12, -4)}
      {leaf('M118 20c-8 7-16 8-23 4 6-6 14-7 23-4z', 'left', 11, -7)}
      <circle cx="120" cy="20" r="2.2" className={styles.accentFill} />
    </svg>
  )
}

/** The skyline of the Old City walls, as a quiet band above the footer. */
export function WallSkyline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 960 70" preserveAspectRatio="none" className={cx(styles.svg, className)} aria-hidden="true" focusable="false">
      <path
        className={styles.lineThin}
        d="M0 60h60V46h14v14h26V32a16 16 0 0 1 32 0v28h40V48h12v12h46V22h10v-6h8v6h10v38h40V40a12 12 0 0 1 24 0v20h52V50h10v10h34V28a20 20 0 0 1 40 0v32h56V44h12v16h40V36h8v-8h6v8h8v24h46V48a10 10 0 0 1 20 0v12h60V40h14v20h58V30a14 14 0 0 1 28 0v30h40"
      />
    </svg>
  )
}

/** "No bookings yet": a stone bench under an olive tree. */
export function EmptyBench({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 140" className={cx(styles.svg, className)} aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="74" rx="62" ry="56" className={styles.hillFar} />
      <OliveSprig x={124} y={124} scale={0.62} phase={1} />
      <g className={styles.line}>
        <path d="M56 112h54M62 112v12M104 112v12M58 104h50" />
      </g>
      <path d="M36 124h128" className={styles.soft} />
    </svg>
  )
}

/** The 404 drawing: a path that fades away between the hills, mist drifting over them. */
export function LostPath({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" className={cx(styles.svg, className)} aria-hidden="true" focusable="false">
      <path d="M0 98c40-20 80-24 120-14s80 8 120-6v72H0z" className={styles.hillFar} />
      <path d="M0 118c50-14 90-12 130-4s70 4 110-8v44H0z" className={styles.hillNear} />
      <path d="M120 150c-4-16 2-28 14-36s12-20 4-30" className={styles.path} />
      <path className={styles.mist} d="M20 86c30-8 70-10 110-3s70 5 100-2v9c-30 7-60 9-100 2S50 88 20 95z" />
      <g className={styles.soft}>
        <path d="M30 56c20-8 40-8 60 0M150 46c20-8 40-8 60 0" />
      </g>
      <circle cx="138" cy="82" r="2" className={styles.accentFill} />
    </svg>
  )
}
