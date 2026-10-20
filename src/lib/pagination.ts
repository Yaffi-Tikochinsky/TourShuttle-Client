/** First, last, and the pages around the current one; "gap" where pages are skipped: 1 … 4 5 6 … 12. */
export function pageList(page: number, totalPages: number): Array<number | 'gap'> {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages))
  const sorted = [...wanted].sort((a, b) => a - b)
  const result: Array<number | 'gap'> = []
  sorted.forEach((p, i) => {
    const previous = sorted[i - 1]
    if (previous !== undefined && p - previous > 1) result.push('gap')
    result.push(p)
  })
  return result
}
