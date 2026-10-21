import { NavLink, Outlet } from 'react-router'
import { Bus, IdCard, Landmark, MapPin } from 'lucide-react'
import { Blob } from '@/components/art/Blob'
import { Dust } from '@/components/art/Dust'
import { cx } from '@/lib/cx'
import styles from './AdminLayout.module.css'

const sections = [
  { to: 'tours', label: 'הסעות', icon: <Bus aria-hidden="true" /> },
  { to: 'destinations', label: 'יעדים', icon: <Landmark aria-hidden="true" /> },
  { to: 'pickup-points', label: 'תחנות איסוף', icon: <MapPin aria-hidden="true" /> },
  { to: 'drivers', label: 'נהגים', icon: <IdCard aria-hidden="true" /> },
]

/**
 * The frame of the admin area: a title and section tabs, with the current section rendered into <Outlet />.
 * A layout route: /admin/tours, /admin/destinations and /admin/pickup-points are its children, so the frame
 * stays mounted while only the inside changes.
 */
export function AdminLayout() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <Blob shape={2} tone={2} style={{ top: -170, insetInlineEnd: -150, width: 440 }} />
        <Dust count={12} seed={2} />
        <div className="container">
          <p className="eyebrow">אזור הניהול</p>
          <h1 className={styles.title}>ניהול שבילי קדם</h1>
          <nav aria-label="אזורי ניהול" className={styles.tabs}>
            {sections.map((section) => (
              <NavLink
                key={section.to}
                to={section.to}
                viewTransition
                className={({ isActive }) => cx(styles.tab, isActive && styles.active)}
              >
                {section.icon}
                {section.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </section>
      <div className="container">
        <Outlet />
      </div>
    </div>
  )
}
