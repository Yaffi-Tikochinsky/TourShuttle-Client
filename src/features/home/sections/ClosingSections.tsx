import { ArrowLeft } from 'lucide-react'
import { Blob } from '@/components/art/Blob'
import { OliveDivider } from '@/components/art/Ornaments'
import { Reveal } from '@/components/motion/Reveal'
import { ButtonLink } from '@/components/ui'
import styles from '../HomePage.module.css'

/** A traveller's words, quietly set between two olive rules. */
export function QuoteSection() {
  return (
    <section className={styles.section} aria-label="מה אומרים הנוסעים">
      <Reveal className={`container ${styles.quote}`}>
        <OliveDivider className={styles.quoteOrnament} />
        <blockquote className={styles.quoteText}>
          ״יצאנו בשש בבוקר מבית שמש, והגענו לצפת כשהערפל עוד שכב על ההרים. הנהג חיכה לנו בתחנה בדיוק בזמן, וכל
          הדרך הייתה שקטה ונעימה.״
        </blockquote>
        <p className={styles.quoteAuthor}>רחל, ירושלים</p>
      </Reveal>
    </section>
  )
}

/** The last nudge before the footer. */
export function CallToAction() {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <Reveal className="container">
        <div className={styles.cta}>
          <Blob shape={2} tone={1} style={{ top: -80, insetInlineStart: -60, width: 260 }} />
          <div className={styles.ctaText}>
            <h2 id="cta-title" className={styles.ctaTitle}>
              המקום הבא שלכם כבר מחכה
            </h2>
            <p className={styles.ctaLead}>בחרו עיר ואתר, ותוך דקה המקום שמור.</p>
          </div>
          <ButtonLink to="/tours" size="lg" variant="secondary" icon={<ArrowLeft />} className={styles.ctaButton}>
            לכל ההסעות
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}
