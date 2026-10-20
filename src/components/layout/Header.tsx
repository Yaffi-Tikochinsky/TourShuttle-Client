import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import type { UserRole } from '@/api/types'
import { ButtonLink } from '@/components/ui'
import { useAuth } from '@/features/auth/useAuth'
import { cx } from '@/lib/cx'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'
import styles from './Header.module.css'

interface NavItem {
  to: string
  label: string
  /** Shown only to these roles; omit for everyone. */
  roles?: UserRole[]
}

// Links to pages that exist so far. Stage 9f adds admin.
const navItems: NavItem[] = [
  { to: '/', label: 'דף הבית' },
  { to: '/tours', label: 'הסעות' },
  { to: '/my-bookings', label: 'ההזמנות שלי', roles: ['Customer'] },
  { to: '/driver', label: 'ההסעות שלי', roles: ['Driver'] },
]

export function Header() {
  const { user, hasRole, logout } = useAuth()
  const { pathname } = useLocation()

  // The mobile menu remembers on which page it was opened. Moving to another page closes it,
  // derived during render: no effect that sets state after the fact (which would cost an extra render).
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null)
  const menuOpen = openedOnPath === pathname
  const setMenuOpen = (update: (open: boolean) => boolean) => setOpenedOnPath(update(menuOpen) ? pathname : null)

  // Escape closes the open menu and puts focus back on the button that opened it.
  // An effect, because it listens to the whole document (outside React's tree) only while the menu is open.
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpenedOnPath(null)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const visibleItems = navItems.filter((item) => !item.roles || hasRole(...item.roles))

  return (
    <header className={styles.header}>
      <div className={cx('container', styles.inner)}>
        <Logo />

        <nav id="main-nav" className={cx(styles.nav, menuOpen && styles.navOpen)} aria-label="ניווט ראשי">
          <ul className={styles.navList}>
            {visibleItems.map((item) => (
              <li key={item.to}>
                {/* NavLink knows whether its route is the current one and styles itself as active. */}
                <NavLink to={item.to} end viewTransition className={({ isActive }) => cx(styles.navLink, isActive && styles.active)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} onLogout={logout} />
          ) : (
            <>
              <ButtonLink to="/login" variant="ghost" size="sm">
                התחברות
              </ButtonLink>
              <ButtonLink to="/register" size="sm" className={styles.registerButton}>
                הרשמה
              </ButtonLink>
            </>
          )}
          <button
            type="button"
            className={cx(styles.iconButton, styles.menuButton)}
            aria-label={menuOpen ? 'סגירת התפריט' : 'פתיחת התפריט'}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            ref={menuButtonRef}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  )
}
