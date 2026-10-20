import { useId } from 'react'
import { cx } from '@/lib/cx'
import { OliveSprig } from './OliveSprig'
import styles from './art.module.css'

/**
 * The hero drawing: a gate of the Old City set in a wall of Jerusalem stone that fades into the page.
 * Through the arch: layered hills, a path winding away, warm light that slowly brightens and dims,
 * and specks of dust drifting in it. Olive sprigs at the foot of the wall stir leaf by leaf.
 * useId keeps the gradient and clip ids unique if the scene appears twice on a page.
 */
export function ArchScene({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const clip = `arch-clip-${id}`
  const fog = `arch-fog-${id}`
  const light = `arch-light-${id}`
  const wallShade = `arch-shade-${id}`

  return (
    <svg viewBox="0 0 420 390" className={cx(styles.svg, className)} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <path d="M140 380V168a70 70 0 0 1 140 0v212z" />
        </clipPath>
        {/* A mask, not a page-colored overlay: the wall itself turns transparent toward its edges,
            so it fades cleanly over whatever is behind it (a green blob, or the night background). */}
        <linearGradient id={`${fog}-gradient`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="black" />
          <stop offset="0.18" stopColor="white" />
          <stop offset="0.82" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={fog} maskUnits="userSpaceOnUse" x="0" y="0" width="420" height="390">
          <rect width="420" height="390" fill={`url(#${fog}-gradient)`} />
        </mask>
        <linearGradient id={wallShade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--art-hill-far)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--art-hill-far)" stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={light} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="var(--art-glow)" stopOpacity="1" />
          <stop offset="0.7" stopColor="var(--art-glow)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--art-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The wall: a soft shade rising from the ground, then courses of stone offset like real masonry */}
      <g mask={`url(#${fog})`}>
        <rect x="0" y="100" width="420" height="280" fill={`url(#${wallShade})`} />
        <g className={styles.soft}>
          <path d="M0 100h420M0 140h420M0 180h420M0 220h420M0 260h420M0 300h420M0 340h420M0 380h420" />
          <path d="M30 100v40M100 100v40M320 100v40M390 100v40M65 140v40M355 140v40M30 180v40M100 180v40M320 180v40M390 180v40M65 220v40M355 220v40M30 260v40M100 260v40M320 260v40M390 260v40M65 300v40M355 300v40M30 340v40M100 340v40M320 340v40M390 340v40" />
        </g>
      </g>

      {/* Inside the gate */}
      <g clipPath={`url(#${clip})`}>
        <rect x="140" y="90" width="140" height="290" className={styles.paper} />
        <ellipse className={styles.breathe} cx="210" cy="210" rx="120" ry="125" fill={`url(#${light})`} />
        <path d="M120 286c34-26 66-30 98-18s54 8 82-6v120H120z" className={styles.hillFar} />
        <path d="M120 320c38-20 76-18 108-8s44 6 72-4v72H120z" className={styles.hillNear} />
        <path d="M178 380c8-26 20-40 38-44s28-14 22-32" className={styles.path} />
      </g>

      {/* The gate: inner and outer arch, the voussoir joints of the outer arch, and a keystone */}
      <path d="M140 380V168a70 70 0 0 1 140 0v212" className={styles.line} style={{ strokeWidth: 2.6 }} />
      <path d="M120 380V168a90 90 0 0 1 180 0v212" className={styles.line} />
      <g className={styles.lineThin}>
        <path d="M130 140l12 6M150 104l9 10M178 82l4 13M242 82l-4 13M270 104l-9 10M290 140l-12 6" />
      </g>
      <path d="M200 72h20v14h-20z" className={styles.line} />
      <path d="M96 380h228" className={styles.line} />

      {/* Olive sprigs at the foot of the wall: a large one, and a smaller one opposite */}
      <OliveSprig x={346} y={380} scale={1.05} />
      <OliveSprig x={74} y={380} scale={0.72} mirror phase={2.5} />

      {/* Dust in the light */}
      <g>
        <circle className={styles.mote} cx="188" cy="184" r="1.8" />
        <circle className={styles.mote} cx="232" cy="164" r="1.4" />
        <circle className={styles.mote} cx="214" cy="204" r="1.2" />
        <circle className={styles.mote} cx="176" cy="216" r="1.5" />
        <circle className={styles.mote} cx="246" cy="206" r="1.6" />
        <circle className={styles.mote} cx="206" cy="146" r="1.2" />
        <circle className={styles.mote} cx="222" cy="236" r="1.3" />
      </g>
    </svg>
  )
}
