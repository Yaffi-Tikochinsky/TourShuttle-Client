import { useEffect } from 'react'

const SITE_NAME = 'שבילי קדם'

/** Sets the browser tab title for the current page, and restores the previous one when the page unmounts. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · הסעות למקומות הקדושים`
    return () => {
      document.title = previous
    }
  }, [title])
}
