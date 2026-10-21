import type { CSSProperties, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import type { SiteKind } from '@/lib/sites'
import { OliveSprig } from './OliveSprig'
import styles from './art.module.css'

/** One small line drawing per kind of site, for destination cards and the top of a tour page. Each has a quiet living detail. */
export function SiteIllustration({ kind, className }: { kind: SiteKind; className?: string }) {
  return (
    <svg viewBox="0 0 240 150" className={cx(styles.svg, className)} aria-hidden="true" focusable="false">
      {drawings[kind]}
      {/* Dust in the air above the site, as in the gate on the home page. */}
      <g>
        <circle className={styles.mote} cx="58" cy="52" r="1.5" />
        <circle className={styles.mote} cx="112" cy="34" r="1.2" />
        <circle className={styles.mote} cx="168" cy="46" r="1.6" />
        <circle className={styles.mote} cx="196" cy="70" r="1.2" />
        <circle className={styles.mote} cx="84" cy="78" r="1.1" />
      </g>
    </svg>
  )
}

/** A tiny plant growing between stones; its two leaves stir on their own timing. */
function Sprout({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  const leaf = (d: string, side: 'left' | 'right', duration: number) => (
    <path
      d={d}
      className={cx(styles.olive, styles.leaf, side === 'left' ? styles.leafLeft : styles.leafRight)}
      style={{ animationDuration: `${duration}s`, animationDelay: `${-delay}s` } as CSSProperties}
    />
  )
  return (
    <g transform={`translate(${x} ${y})`}>
      {leaf('M0 0c-4-6-2-12 4-14', 'left', 9)}
      {leaf('M0 0c5-5 11-5 14-1', 'right', 12)}
    </g>
  )
}

const drawings: Record<SiteKind, ReactNode> = {
  // Herodian courses, plants growing between the stones, folded notes in the cracks
  wall: (
    <>
      <path d="M0 140h240" className={styles.soft} />
      <g className={styles.line}>
        <path d="M24 140V30h192v110M24 52h192M24 74h192M24 96h192M24 118h192" />
        <path d="M74 30v22M140 30v22M196 30v22M48 52v22M112 52v22M176 52v22M86 74v22M152 74v22M206 74v22M54 96v22M122 96v22M186 96v22M92 118v22M160 118v22" />
      </g>
      <Sprout x={100} y={52} />
      <Sprout x={166} y={96} delay={4} />
      <Sprout x={60} y={74} delay={7} />
      <g className={styles.accentFill}>
        <rect x="126" y="82" width="3" height="6" rx="1" />
        <rect x="70" y="104" width="3" height="6" rx="1" />
        <rect x="190" y="60" width="3" height="6" rx="1" />
      </g>
    </>
  ),
  // Ancient steps going down to the Pool of Siloam, rings spreading on the water, an olive tree above
  cityOfDavid: (
    <>
      <path d="M0 140h240" className={styles.soft} />
      <g className={styles.line}>
        <path d="M24 34h56v22h40v22h40v22h40v22h20" />
        <path d="M24 34v106M80 56v84M120 78v62M160 100v40M200 122v18" />
      </g>
      <g className={styles.soft}>
        <path d="M24 46h56M80 68h40M120 90h40M160 112h40" />
      </g>
      <path d="M150 140c0-10 12-16 34-16s34 6 34 16z" className={styles.waterStroke} />
      <ellipse className={styles.ripple} cx="184" cy="134" rx="22" ry="4" />
      <ellipse className={styles.ripple} cx="184" cy="134" rx="22" ry="4" />
      <OliveSprig x={44} y={34} scale={0.38} phase={1} />
    </>
  ),
  // The old cemetery of Safed on the hillside, graves painted pale blue, mist drifting over the Galilee
  safed: (
    <>
      <path d="M0 112c40-30 82-58 132-62s78 20 108 40v60H0z" className={styles.hillFar} />
      <path d="M0 112c40-30 82-58 132-62s78 20 108 40" className={styles.line} />
      <g className={styles.waterStroke}>
        <rect x="58" y="94" width="22" height="10" rx="2" />
        <rect x="90" y="84" width="22" height="10" rx="2" />
        <rect x="122" y="78" width="22" height="10" rx="2" />
        <rect x="154" y="82" width="22" height="10" rx="2" />
        <rect x="72" y="114" width="22" height="10" rx="2" />
        <rect x="106" y="106" width="22" height="10" rx="2" />
        <rect x="140" y="102" width="22" height="10" rx="2" />
        <rect x="176" y="106" width="22" height="10" rx="2" />
      </g>
      <path className={styles.mist} d="M10 60c30-10 70-12 110-4s70 6 100-2v10c-30 8-60 10-100 2S40 62 10 70z" />
      <g className={styles.soft}>
        <path d="M20 36c20-10 40-10 60 0M150 26c20-8 40-8 60 0" />
      </g>
      <OliveSprig x={212} y={100} scale={0.34} phase={3} />
    </>
  ),
  // Walls and the tower of the citadel, warm light flickering softly in the openings
  tower: (
    <>
      <path d="M0 140h240" className={styles.soft} />
      <path d="M150 140v-24a6 6 0 0 1 12 0v24z" className={cx(styles.glow, styles.flicker)} />
      <path d="M60 140v-28a10 10 0 0 1 20 0v28z" className={cx(styles.glow, styles.flicker)} />
      <g className={styles.line}>
        <path d="M40 140V76h20v-8h8v8h12v-8h8v8h12v-8h8v8h12v64" />
        <path d="M128 140V46h8v-6h6v6h8v-6h6v6h8v94" />
        <path d="M146 46V28a6 6 0 0 1 12 0v18" />
        <path d="M164 140V92h40v48" />
        <path d="M150 140v-24a6 6 0 0 1 12 0v24M60 140v-28a10 10 0 0 1 20 0v28" />
      </g>
    </>
  ),
  // Any other site: a gate opening onto hills, with light inside
  default: (
    <>
      <path d="M0 140h240" className={styles.soft} />
      <path d="M86 140V72a34 34 0 0 1 68 0v68z" className={cx(styles.glow, styles.breathe)} />
      <path d="M86 118c14-8 30-10 44-6s22 2 24-2v30H86z" className={styles.hillNear} />
      <path d="M86 140V72a34 34 0 0 1 68 0v68" className={styles.line} />
      <path d="M74 140V72a46 46 0 0 1 92 0v68" className={styles.lineThin} />
      <OliveSprig x={186} y={140} scale={0.55} phase={2} />
    </>
  ),
}
