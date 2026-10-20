import { Link } from 'react-router'
import type { User } from '@/api/types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { AuthLayout } from '../components/AuthLayout'
import { DemoAccounts } from '../components/DemoAccounts'
import { LoginForm } from '../components/LoginForm'
import { useAuthRedirect } from '../useAuthRedirect'

// Defined outside the component, so its identity never changes between renders.
const greet = (user: User) => `שלום ${user.fullName.split(' ')[0]}, התחברת בהצלחה`

export default function LoginPage() {
  useDocumentTitle('התחברות')
  const onSuccess = useAuthRedirect(greet)

  return (
    <AuthLayout
      title="ברוכים השבים"
      subtitle="התחברו כדי להזמין מקומות ולראות את ההזמנות שלכם."
      footer={
        <>
          עדיין אין לך חשבון? <Link to="/register">להרשמה</Link>
        </>
      }
      aside={<DemoAccounts onSuccess={onSuccess} />}
    >
      <LoginForm onSuccess={onSuccess} />
    </AuthLayout>
  )
}
