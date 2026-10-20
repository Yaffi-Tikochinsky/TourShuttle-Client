import { LogIn, UserPlus } from 'lucide-react'
import { ButtonLink } from '@/components/ui'
import { useAuth } from '@/features/auth/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './HomePage.module.css'

/** A temporary home page for stage 9a. Stage 9b replaces it with the full landing page and its watercolor images. */
export default function HomePage() {
  useDocumentTitle()
  const { user } = useAuth()

  return (
    <section className={styles.hero}>
      <div className="container">
        <p className={styles.eyebrow}>הסעות מאורגנות · ירושלים · צפת · הגליל</p>
        <h1 className={styles.title}>
          בדרך אל
          <br />
          המקומות הקדושים
        </h1>
        <p className={styles.lead}>
          {user
            ? `שלום ${user.fullName}, טוב לראות אותך. בשלב הבא נוסיף כאן את ההסעות הקרובות.`
            : 'מזמינים מקום בהסעה, בוחרים תחנת איסוף קרובה, ויוצאים לדרך בלב שקט.'}
        </p>
        {!user && (
          <div className={styles.actions}>
            <ButtonLink to="/register" size="lg" icon={<UserPlus />}>
              פתיחת חשבון
            </ButtonLink>
            <ButtonLink to="/login" size="lg" variant="secondary" icon={<LogIn />}>
              התחברות
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  )
}
