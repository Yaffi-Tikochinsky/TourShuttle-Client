import { useEffect, useState } from 'react'

/**
 * useState that survives a reload: the value is read from localStorage once (lazy initial state)
 * and written back whenever it changes. Falls back to the initial value if storage is blocked or corrupt.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? initialValue : (JSON.parse(stored) as T)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Private mode or a full quota: the value still works for this visit.
    }
  }, [key, value])

  return [value, setValue] as const
}
