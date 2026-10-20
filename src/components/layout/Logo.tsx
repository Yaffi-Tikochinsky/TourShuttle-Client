import { Link } from 'react-router'
import styles from './Logo.module.css'

/** A gate of the Old City in fine line over a road, with an olive leaf: the brand mark, drawn as inline SVG. */
export function Logo() {
  return (
    <Link to="/" viewTransition className={styles.logo} aria-label="שבילי קדם, לדף הבית">
      <svg viewBox="0 0 48 48" className={styles.mark} aria-hidden="true">
        <path d="M11 40V24a13 13 0 0 1 26 0v16" className={styles.arch} />
        <path d="M17 40V25a7 7 0 0 1 14 0v15" className={styles.inner} />
        <path d="M24 9c-4 3-5 7-3 11 3-2 5-6 3-11z" className={styles.leaf} />
        <path d="M6 40h36" className={styles.road} />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>שבילי קדם</span>
        <span className={styles.tagline}>הסעות למקומות הקדושים</span>
      </span>
    </Link>
  )
}
