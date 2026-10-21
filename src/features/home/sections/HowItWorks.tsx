import { Bus, MapPinned, Ticket } from 'lucide-react'
import { Dust } from '@/components/art/Dust'
import { Reveal } from '@/components/motion/Reveal'
import styles from '../HomePage.module.css'
import { SectionHeading } from './SectionHeading'

const steps = [
  {
    icon: <MapPinned aria-hidden="true" />,
    title: 'בוחרים הסעה',
    text: 'מסננים לפי העיר שלכם והאתר, ורואים מיד כמה מקומות נשארו בכל הסעה.',
  },
  {
    icon: <Ticket aria-hidden="true" />,
    title: 'בוחרים תחנה ומקומות',
    text: 'תחנת איסוף קרובה, עם שעת איסוף משוערת שמחושבת לפי העומס בכבישים.',
  },
  {
    icon: <Bus aria-hidden="true" />,
    title: 'יוצאים לדרך',
    text: 'הנהג מקבל את רשימת הנוסעים לפי תחנות, ומחכה לכם במקום ובזמן.',
  },
]

export function HowItWorks() {
  return (
    <section className={styles.section} aria-labelledby="how-title">
      <Dust count={10} seed={14} />
      <div className="container">
        <SectionHeading id="how-title" title="איך זה עובד" subtitle="שלושה צעדים, ואתם בדרך" />
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 160} variant="scale" className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.stepIcon}>{step.icon}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
