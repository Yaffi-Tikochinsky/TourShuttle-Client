import { useState, useTransition } from 'react'
import { Sparkles } from 'lucide-react'
import type { User, UserRole } from '@/api/types'
import { ApiErrorAlert } from '@/components/feedback/ApiErrorAlert'
import { Button, Card } from '@/components/ui'
import { toApiError, type ApiError } from '@/lib/errors'
import { roleLabels } from '@/lib/roles'
import { useAuth } from '../useAuth'
import styles from './AuthForms.module.css'

// The demo users the server seeds (DbSeeder). Their passwords are public on purpose: the course asks for them.
const demoAccounts: Array<{ role: UserRole; email: string; password: string }> = [
  { role: 'Customer', email: 'customer1@tourshuttle.demo', password: 'Customer123!' },
  { role: 'Driver', email: 'driver1@tourshuttle.demo', password: 'Driver123!' },
  { role: 'Admin', email: 'admin@tourshuttle.demo', password: 'Admin123!' },
]

/** One-click sign-in as each role, for reviewers. useTransition gives a pending flag without a form. */
export function DemoAccounts({ onSuccess }: { onSuccess: (user: User) => void }) {
  const { login } = useAuth()
  const [isPending, startTransition] = useTransition()
  const [activeRole, setActiveRole] = useState<UserRole | null>(null)
  const [error, setError] = useState<ApiError | null>(null)

  const signIn = (account: (typeof demoAccounts)[number]) => {
    setActiveRole(account.role)
    setError(null)
    startTransition(async () => {
      try {
        onSuccess(await login({ email: account.email, password: account.password }))
      } catch (caught) {
        setError(toApiError(caught))
      }
    })
  }

  return (
    <Card padding="md" className={styles.demo}>
      <p className={styles.demoTitle}>
        <Sparkles aria-hidden="true" />
        כניסה מהירה למשתמשי הדגמה
      </p>
      <p className={styles.demoText}>לבדיקת המערכת מכל נקודת מבט: לקוח שמזמין, נהג שאוסף, ומנהל.</p>
      {error && <ApiErrorAlert error={error} />}
      <div className={styles.demoButtons}>
        {demoAccounts.map((account) => (
          <Button
            key={account.role}
            variant="secondary"
            size="sm"
            isLoading={isPending && activeRole === account.role}
            disabled={isPending}
            onClick={() => signIn(account)}
          >
            {roleLabels[account.role]}
          </Button>
        ))}
      </div>
    </Card>
  )
}
