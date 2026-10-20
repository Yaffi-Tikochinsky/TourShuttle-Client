import { Link } from 'react-router'
import styles from './Logo.module.css'

/** An arch (a gate of the Old City) under a rising sun, over a road: the brand mark, drawn as inline SVG. */
export function Logo() {
  return (
    <Link to="/" className={styles.logo} aria-label="שבילי קדם, לדף הבית">
      <svg viewBox="0 0 48 48" className={styles.mark} aria-hidden="true">
        <circle cx="24" cy="20" r="7" className={styles.sun} />
        <path d="M10 40V26a14 14 0 0 1 28 0v14" className={styles.arch} />
        <path d="M6 40h36" className={styles.road} />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>שבילי קדם</span>
        <span className={styles.tagline}>הסעות למקומות הקדושים</span>
      </span>
    </Link>
  )
}
