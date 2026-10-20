import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { Alert, Button } from '@/components/ui'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Catches errors thrown while rendering its children, so a bug in one page shows a message
 * instead of a blank screen. Error boundaries are the one thing that still needs a class component in React.
 * To clear the error when the user navigates, give it a `key` (see AppLayout): a new key mounts a fresh boundary.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Render error caught by ErrorBoundary', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="container" style={{ paddingBlock: 'var(--space-7)' }}>
        <Alert
          tone="danger"
          title="משהו השתבש בתצוגת הדף"
          action={
            <Button variant="secondary" icon={<RotateCcw />} onClick={() => this.setState({ error: null })}>
              נסו שוב
            </Button>
          }
        >
          אפשר לנסות שוב, או לעבור לדף אחר מהתפריט.
        </Alert>
      </div>
    )
  }
}
