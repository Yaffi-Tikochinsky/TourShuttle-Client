import { describe, expect, it } from 'vitest'
import { pageList } from './pagination'

describe('pageList', () => {
  it('shows every page when there are few', () => {
    expect(pageList(2, 3)).toEqual([1, 2, 3])
  })

  it('keeps the first, last and neighbours, with gaps between', () => {
    expect(pageList(6, 12)).toEqual([1, 'gap', 5, 6, 7, 'gap', 12])
  })

  it('has no gap when the neighbour touches the edge', () => {
    expect(pageList(2, 12)).toEqual([1, 2, 3, 'gap', 12])
  })
})
