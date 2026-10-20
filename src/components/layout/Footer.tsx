import { Link } from 'react-router'
import { WallSkyline } from '@/components/art/Ornaments'
import styles from './Footer.module.css'

// Read once when the module loads, not on every render: a component should give the same output for the same input.
const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={styles.footer}>
      <WallSkyline className={styles.skyline} />
      <div className="container">
        <div className={styles.inner}>
          <div>
            <p className={styles.brand}>שבילי קדם</p>
            <p className={styles.text}>הסעות מאורגנות לסיורים במקומות הקדושים: מהכותל המערבי ועד סמטאות צפת.</p>
          </div>
          <nav aria-label="קישורים בתחתית הדף" className={styles.links}>
            <Link to="/tours" viewTransition>כל ההסעות</Link>
            <Link to="/login">התחברות</Link>
            <Link to="/register">פתיחת חשבון</Link>
          </nav>
        </div>
        <p className={styles.copy}>
          © {currentYear} שבילי קדם · פרויקט גמר בקורס <bdi>.NET</bdi>, עם <bdi>ASP.NET Core</bdi> ו-<bdi>React</bdi>
        </p>
      </div>
    </footer>
  )
}
