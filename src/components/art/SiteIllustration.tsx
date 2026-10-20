import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import type { SiteKind } from '@/lib/sites'
import styles from './art.module.css'

/** One small line drawing per kind of site, for destination cards and the top of a tour page. */
export function SiteIllustration({ kind, className }: { kind: SiteKind; className?: string }) {
  return (
    <svg viewBox="0 0 240 150" className={cx(styles.svg, className)} aria-hidden="true" focusable="false">
      {drawings[kind]}
    </svg>
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
      <g className={styles.olive}>
        <path d="M100 52c-4-7-2-13 4-15M100 52c5-5 11-5 14-1M166 96c-3-7 0-13 6-14M166 96c5-4 11-3 14 2M60 74c-3-6-1-11 4-12" />
      </g>
      <g className={styles.accentFill}>
        <rect x="126" y="82" width="3" height="6" rx="1" />
        <rect x="70" y="104" width="3" height="6" rx="1" />
        <rect x="190" y="60" width="3" height="6" rx="1" />
      </g>
    </>
  ),
  // Ancient steps going down to the Pool of Siloam, an olive tree above
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
      <g className={styles.olive}>
        <path d="M50 34c-2-18 4-30 16-38" />
        <path d="M52 20c-10-1-16-7-17-15 9 0 15 6 17 15zM56 10c9-3 14-10 14-18-9 2-13 9-14 18z" />
      </g>
    </>
  ),
  // The old cemetery of Safed on the hillside, graves painted pale blue, the Galilee beyond
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
      <g className={styles.soft}>
        <path d="M20 36c20-10 40-10 60 0M150 26c20-8 40-8 60 0" />
      </g>
      <g className={styles.olive}>
        <path d="M214 96c-2-16 2-28 12-36" />
        <path d="M216 80c-8-1-13-6-14-12 8 0 12 5 14 12zM220 70c7-3 11-9 11-15-7 2-11 8-11 15z" />
      </g>
    </>
  ),
  // Walls and the tower of the citadel, warm light in the openings
  tower: (
    <>
      <path d="M0 140h240" className={styles.soft} />
      <path d="M150 140v-24a6 6 0 0 1 12 0v24zM60 140v-28a10 10 0 0 1 20 0v28z" className={styles.glow} />
      <g className={styles.line}>
        <path d="M40 140V76h20v-8h8v8h12v-8h8v8h12v-8h8v8h12v64" />
        <path d="M128 140V46h8v-6h6v6h8v-6h6v6h8v94" />
        <path d="M146 46V28a6 6 0 0 1 12 0v18" />
        <path d="M164 140V92h40v48" />
        <path d="M150 140v-24a6 6 0 0 1 12 0v24M60 140v-28a10 10 0 0 1 20 0v28" />
      </g>
    </>
  ),
  // Any other site: a gate opening onto hills
  default: (
    <>
      <path d="M0 140h240" className={styles.soft} />
      <path d="M86 140V72a34 34 0 0 1 68 0v68z" className={styles.glow} />
      <path d="M86 118c14-8 30-10 44-6s22 2 24-2v30H86z" className={styles.hillNear} />
      <path d="M86 140V72a34 34 0 0 1 68 0v68" className={styles.line} />
      <path d="M74 140V72a46 46 0 0 1 92 0v68" className={styles.lineThin} />
      <g className={styles.olive}>
        <path d="M186 140c-3-22 3-40 16-54" />
        <path d="M189 122c-11-2-17-9-18-17 9 0 16 6 18 17zM194 104c9-4 14-11 14-20-9 2-14 9-14 20z" />
      </g>
    </>
  ),
}
