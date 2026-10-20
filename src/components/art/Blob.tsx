import type { CSSProperties } from 'react'
import styles from './art.module.css'

// Hand-drawn organic outlines in a 200x200 box. All four have exactly the same commands and segment counts
// (M, c, s, s, S, S, z): SVG can morph between two paths only when their structure matches;
// otherwise the animation jumps from one shape to the other instead of flowing.
const shapes = [
  'M44 30c30-24 86-28 116 2s30 82 4 112-78 46-112 24S-4 106 6 72 14 54 44 30z',
  'M60 20c34-14 92 4 112 40s4 94-34 112-92 10-118-24S-2 86 18 56 26 34 60 20z',
  'M50 26c40-20 104-6 122 34s-6 98-48 114-94-6-112-44S16 62 30 46 38 32 50 26z',
  'M30 60c18-34 82-50 122-24s46 84 14 112-96 22-122-6S6 112 12 96 20 72 30 60z',
] as const

const fills = ['var(--blob-1)', 'var(--blob-2)', 'var(--blob-3)'] as const

interface BlobProps {
  /** Which outline (0-3). */
  shape?: number
  /** Which of the three sage tones (0-2). */
  tone?: number
  /** Position and size, for example { top: -40, insetInlineStart: -80, width: 360 }. */
  style: CSSProperties
}

/**
 * A soft sage-green wash behind the content. Purely decorative: hidden from screen readers and the mouse.
 * It drifts (CSS) and slowly changes shape into the next outline and back (SMIL <animate>, with spline easing),
 * on a 30-second cycle, so the change is felt more than seen.
 */
export function Blob({ shape = 0, tone = 0, style }: BlobProps) {
  const from = shapes[shape % shapes.length]
  const to = shapes[(shape + 1) % shapes.length]
  return (
    <svg className={styles.blob} style={style} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <path d={from} fill={fills[tone % fills.length]}>
        <animate
          attributeName="d"
          dur="30s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.37 0 0.63 1;0.37 0 0.63 1"
          values={`${from};${to};${from}`}
        />
      </path>
    </svg>
  )
}
