import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/app/theme/useTheme'
import styles from './Header.module.css'

export function ThemeToggle() {
  const { resolved, toggle } = useTheme()
  const isDark = resolved === 'dark'
  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={toggle}
      aria-label={isDark ? 'מעבר למצב בהיר' : 'מעבר למצב כהה'}
      title={isDark ? 'מצב בהיר' : 'מצב כהה'}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  )
}
