import styles from './Footer.module.css'

// Read once when the module loads, not on every render: a component should give the same output for the same input.
const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div>
            <p className={styles.brand}>שבילי קדם</p>
            <p className={styles.text}>הסעות מאורגנות לסיורים במקומות הקדושים: מהכותל המערבי ועד סמטאות צפת.</p>
          </div>
          <p className={styles.text}>פרויקט גמר בקורס ‎.NET · ASP.NET Core ו-React</p>
        </div>
        <p className={styles.copy}>© {currentYear} שבילי קדם. כל הזכויות שמורות.</p>
      </div>
    </footer>
  )
}
