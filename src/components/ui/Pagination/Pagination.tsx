import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cx } from '@/lib/cx'
import { pageList } from '@/lib/pagination'
import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  /** Dims the control while the next page loads. */
  isBusy?: boolean
}

/** Page numbers with "…" gaps: 1 … 4 5 6 … 12. Shows nothing when there is only one page. */
export function Pagination({ page, totalPages, onChange, isBusy = false }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav className={cx(styles.pagination, isBusy && styles.busy)} aria-label="מעבר בין עמודים">
      {/* In RTL "previous" points right */}
      <button type="button" className={styles.arrow} onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="לעמוד הקודם">
        <ChevronRight aria-hidden="true" />
      </button>
      <ol className={styles.pages}>
        {pageList(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={cx(styles.page, item === page && styles.current)}
                onClick={() => onChange(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`עמוד ${item}`}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ol>
      <button type="button" className={styles.arrow} onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="לעמוד הבא">
        <ChevronLeft aria-hidden="true" />
      </button>
    </nav>
  )
}
