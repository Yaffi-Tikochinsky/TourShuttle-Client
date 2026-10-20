import { Link } from 'react-router'
import type { User } from '@/api/types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { AuthLayout } from '../components/AuthLayout'
import { RegisterForm } from '../components/RegisterForm'
import { useAuthRedirect } from '../useAuthRedirect'

const greet = (user: User) => `ברוכים הבאים, ${user.fullName.split(' ')[0]}! החשבון נוצר`

export default function RegisterPage() {
  useDocumentTitle('הרשמה')
  const onSuccess = useAuthRedirect(greet)

  return (
    <AuthLayout
      title="פתיחת חשבון"
      subtitle="דקה אחת, ואפשר להזמין מקום בהסעה הקרובה."
      footer={
        <>
          כבר יש לך חשבון? <Link to="/login">להתחברות</Link>
        </>
      }
    >
      <RegisterForm onSuccess={onSuccess} />
    </AuthLayout>
  )
}
