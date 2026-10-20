import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import styles from './Skeleton.module.css'

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  className?: string
}

/** A shimmering placeholder in the shape of content that is still loading, so the layout does not jump. */
export function Skeleton({ width = '100%', height = '1em', radius, className }: SkeletonProps) {
  return <span className={cx(styles.skeleton, className)} style={{ width, height, borderRadius: radius }} aria-hidden="true" />
}
