import { useDeferredValue, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, Plus, Search, X } from 'lucide-react'
import type { PickupPoint } from '@/api/types'
import { cx } from '@/lib/cx'
import styles from './RouteBuilder.module.css'

interface RouteBuilderProps {
  /** Every stop that exists. */
  points: PickupPoint[]
  /** The route: pickup point ids, first picked up first. */
  value: number[]
  onChange: (route: number[]) => void
  disabled?: boolean
  error?: string
}

/**
 * Builds the route: the chosen stops in order on one side (move up, move down, remove),
 * and the stops still available on the other, searchable by name or city.
 * Controlled: the form owns the list; this only reports the new list.
 */
export function RouteBuilder({ points, value, onChange, disabled = false, error }: RouteBuilderProps) {
  const [search, setSearch] = useState('')
  // useDeferredValue: typing stays instant, and the filtered list catches up a moment later (low priority render).
  const deferredSearch = useDeferredValue(search.trim())

  const byId = new Map(points.map((p) => [p.id, p]))
  const available = points
    .filter((p) => !value.includes(p.id))
    .filter((p) => !deferredSearch || `${p.name} ${p.city} ${p.address}`.includes(deferredSearch))

  const move = (index: number, by: -1 | 1) => {
    const next = [...value]
    const [item] = next.splice(index, 1)
    if (item === undefined) return
    next.splice(index + by, 0, item)
    onChange(next)
  }

  return (
    <div className={styles.builder}>
      <div className={styles.column}>
        <h3 className={styles.heading}>
          המסלול <span className={styles.count}>{value.length}</span>
        </h3>
        {value.length === 0 ? (
          <p className={cx(styles.empty, error && styles.emptyError)}>{error ?? 'בחרו תחנות מהרשימה. התחנה הראשונה היא נקודת היציאה.'}</p>
        ) : (
          <ol className={styles.route}>
            {value.map((id, index) => {
              const point = byId.get(id)
              return (
                <li key={id} className={styles.stop}>
                  <span className={styles.order} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className={styles.text}>
                    <span className={styles.name}>{point?.name ?? `תחנה ${id}`}</span>
                    <span className={styles.sub}>{point?.city}</span>
                  </span>
                  <span className={styles.buttons}>
                    <IconButton label={`הקדמת ${point?.name}`} disabled={disabled || index === 0} onClick={() => move(index, -1)}>
                      <ArrowUp />
                    </IconButton>
                    <IconButton label={`איחור ${point?.name}`} disabled={disabled || index === value.length - 1} onClick={() => move(index, 1)}>
                      <ArrowDown />
                    </IconButton>
                    <IconButton label={`הסרת ${point?.name} מהמסלול`} disabled={disabled} onClick={() => onChange(value.filter((x) => x !== id))}>
                      <X />
                    </IconButton>
                  </span>
                </li>
              )
            })}
          </ol>
        )}
      </div>

      <div className={styles.column}>
        <h3 className={styles.heading}>תחנות זמינות</h3>
        <label className={styles.search}>
          <Search aria-hidden="true" />
          <span className="visually-hidden">חיפוש תחנה</span>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="חיפוש לפי שם או עיר" disabled={disabled} />
        </label>
        <ul className={styles.available}>
          {available.map((point) => (
            <li key={point.id}>
              <button type="button" className={styles.add} disabled={disabled} onClick={() => onChange([...value, point.id])}>
                <Plus aria-hidden="true" />
                <span className={styles.text}>
                  <span className={styles.name}>{point.name}</span>
                  <span className={styles.sub}>{point.address}</span>
                </span>
              </button>
            </li>
          ))}
          {available.length === 0 && <li className={styles.empty}>{deferredSearch ? 'אין תחנה כזו' : 'כל התחנות כבר במסלול'}</li>}
        </ul>
      </div>
    </div>
  )
}

function IconButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={styles.iconButton} aria-label={label} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}
