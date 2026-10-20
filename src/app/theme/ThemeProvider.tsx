import { useEffect, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ThemeContext, type ResolvedTheme, type ThemePreference } from './themeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useLocalStorage<ThemePreference>('tourshuttle.theme', 'system')
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  // Derived during render, not stored: there is nothing to keep in sync.
  const resolved: ResolvedTheme = preference === 'system' ? (systemPrefersDark ? 'dark' : 'light') : preference

  // The one side effect: tokens.css switches every color by the data-theme attribute on <html>.
  useEffect(() => {
    document.documentElement.dataset.theme = resolved
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#161e27' : '#f5eee0')
  }, [resolved])

  const value = useMemo(
    () => ({
      preference,
      resolved,
      setPreference,
      toggle: () => setPreference(resolved === 'dark' ? 'light' : 'dark'),
    }),
    [preference, resolved, setPreference],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
