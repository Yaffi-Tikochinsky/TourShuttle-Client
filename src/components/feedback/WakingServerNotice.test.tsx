import { act, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WakingServerNotice } from './WakingServerNotice'

/** A request that resolves only when the test says so, like an API that is still waking up. */
let finish: () => void = () => {}

function SlowQuery() {
  useQuery({ queryKey: ['slow'], queryFn: () => new Promise<string>((resolve) => (finish = () => resolve('ok'))) })
  return null
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('WakingServerNotice', () => {
  it('appears only after six seconds of loading, and leaves when the data arrives', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <SlowQuery />
        <WakingServerNotice />
      </QueryClientProvider>,
    )

    await act(() => vi.advanceTimersByTimeAsync(5000))
    expect(screen.queryByText(/השרת מתעורר/)).not.toBeInTheDocument()

    await act(() => vi.advanceTimersByTimeAsync(1500))
    expect(screen.getByText(/השרת מתעורר/)).toBeInTheDocument()

    // TanStack Query hands results to React on a zero-length timer, which fake timers must let through.
    await act(async () => {
      finish()
      await vi.advanceTimersByTimeAsync(10)
    })
    expect(screen.queryByText(/השרת מתעורר/)).not.toBeInTheDocument()
  })
})
