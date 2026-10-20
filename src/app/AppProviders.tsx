import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/components/ui'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { queryClient } from './queryClient'
import { ThemeProvider } from './theme/ThemeProvider'

/**
 * Every app-wide context, in dependency order: an inner provider may use the outer ones
 * (AuthProvider shows toasts and clears the query cache, so it sits inside both).
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
