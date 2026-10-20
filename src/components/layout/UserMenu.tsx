import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import type { User } from '@/api/types'
import { Badge } from '@/components/ui'
import { roleLabels } from '@/lib/roles'
import styles from './Header.module.css'

interface UserMenuProps {
  user: User
  onLogout: () => void
}

/** A dropdown: opens on click, closes on a click outside, on Escape, or after choosing an item. */
export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    // Cleanup: the listeners exist only while the menu is open.
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const firstName = user.fullName.split(' ')[0]

  return (
    <div className={styles.userMenu} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.userButton}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.avatar} aria-hidden="true">
          {user.fullName.charAt(0)}
        </span>
        <span className={styles.userName}>{firstName}</span>
        <ChevronDown aria-hidden="true" className={styles.chevron} data-open={open} />
      </button>

      {open && (
        <div id={menuId} className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <UserRound aria-hidden="true" />
            <div>
              <p className={styles.dropdownName}>{user.fullName}</p>
              <p className={styles.dropdownEmail}>{user.email}</p>
            </div>
          </div>
          <Badge tone="info">{roleLabels[user.role]}</Badge>
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
          >
            <LogOut aria-hidden="true" />
            התנתקות
          </button>
        </div>
      )}
    </div>
  )
}
