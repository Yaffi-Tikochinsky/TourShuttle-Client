import { act, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useInView } from './useInView'

/** A stand-in IntersectionObserver the test drives by hand: report(true) means "the element is on screen". */
let report: (visible: boolean) => void = () => {}

class FakeObserver {
  constructor(callback: IntersectionObserverCallback) {
    report = (visible) => callback([{ isIntersecting: visible } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
  observe() {}
  disconnect() {}
}

afterEach(() => vi.unstubAllGlobals())

function Probe({ once }: { once: boolean }) {
  // The element appears only after a click, like a page that first shows a loading skeleton.
  const [loaded, setLoaded] = useState(false)
  const [ref, inView] = useInView<HTMLDivElement>({ once })
  return (
    <>
      <button onClick={() => setLoaded(true)}>load</button>
      {loaded && <div ref={ref}>target</div>}
      <p>{inView ? 'visible' : 'hidden'}</p>
    </>
  )
}

describe('useInView', () => {
  it('observes an element that mounts after the component (callback ref)', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    render(<Probe once />)

    act(() => screen.getByText('load').click())
    act(() => report(true))

    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('with once: false, follows the element in and out of view', () => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    render(<Probe once={false} />)
    act(() => screen.getByText('load').click())

    act(() => report(true))
    expect(screen.getByText('visible')).toBeInTheDocument()

    act(() => report(false))
    expect(screen.getByText('hidden')).toBeInTheDocument()
  })
})
