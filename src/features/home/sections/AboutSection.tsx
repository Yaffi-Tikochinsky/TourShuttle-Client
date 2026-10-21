import { Clock3, HeartHandshake, ShieldCheck } from 'lucide-react'
import { Dust } from '@/components/art/Dust'
import { SiteIllustration } from '@/components/art/SiteIllustration'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'
import styles from '../HomePage.module.css'

const values = [
  {
    icon: <Clock3 aria-hidden="true" />,
    title: 'בזמן, בכל תחנה',
    text: 'זמני האיסוף מחושבים לפי שעת היציאה והעומס הצפוי, והנהג יודע בדיוק את מי לאסוף ואיפה.',
  },
  {
    icon: <ShieldCheck aria-hidden="true" />,
    title: 'המקום שלכם שמור',
    text: 'מקום שהוזמן הוא מקום שלכם: המערכת לא מאפשרת למכור את אותו מושב פעמיים, גם כשרבים מזמינים יחד.',
  },
  {
    icon: <HeartHandshake aria-hidden="true" />,
    title: 'בכבוד ובשקט',
    text: 'הסעות קטנות ומסודרות, שמביאות אתכם אל המקום בנחת, ומשאירות את הזמן למה שחשוב באמת.',
  },
]

export function AboutSection() {
  return (
    <section className={styles.section} aria-labelledby="about-title">
      <Dust count={12} seed={15} />
      <div className={`container ${styles.about}`}>
        <Reveal className={styles.aboutText}>
          <span className="eyebrow">מי אנחנו</span>
          <h2 id="about-title" className={styles.sectionTitle}>
            דרך ארוכה של אבן, אור ותפילה
          </h2>
          <p className={styles.aboutLead}>
            שבילי קדם מפעילה הסעות מאורגנות מערי המרכז אל המקומות הקדושים בירושלים ובגליל. אנחנו מאמינים שהדרך היא
            חלק מהביקור: נסיעה נוחה, תחנה קרובה לבית, ושעה ידועה מראש, כדי שתגיעו אל הכותל או אל סמטאות צפת פנויים
            לרגע עצמו.
          </p>
          <Parallax speed="normal" className={styles.aboutArt}>
            <SiteIllustration kind="default" />
          </Parallax>
        </Reveal>

        <ul className={styles.values}>
          {values.map((value, index) => (
            <Reveal as="li" key={value.title} delay={index * 140} variant="side" className={styles.value}>
              <span className={styles.valueIcon}>{value.icon}</span>
              <div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueText}>{value.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
