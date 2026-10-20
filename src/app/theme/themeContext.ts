import { createContext } from 'react'

/** "system" follows the operating system's light/dark setting. */
export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
