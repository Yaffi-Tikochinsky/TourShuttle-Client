import { Leaf } from 'lucide-react'
import { ArchScene } from '@/components/art/ArchScene'
import { Parallax } from '@/components/motion/Parallax'
import { Blob } from '@/components/art/Blob'
import { Dust } from '@/components/art/Dust'
import { TourSearch } from '@/features/tours/components/TourSearch'
import styles from '../HomePage.module.css'

export function HeroSection() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <Blob shape={0} tone={0} style={{ top: -120, insetInlineStart: -140, width: 520 }} />
      <Dust count={20} seed={8} />
      <Blob shape={1} tone={2} style={{ top: 160, insetInlineEnd: -120, width: 380 }} />

      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroText}>
          <span className="eyebrow">
            <Leaf aria-hidden="true" width={14} height={14} />
            הסעות מאורגנות · ירושלים · צפת · הגליל
          </span>
          <h1 id="hero-title" className={styles.heroTitle}>
            בדרך אל
            <br />
            <span className={styles.heroTitleStrong}>המקומות הקדושים</span>
          </h1>
          <p className={styles.heroLead}>
            אוספים אתכם מתחנה קרובה לבית ומביאים אתכם אל הכותל, עיר דוד וסמטאות צפת. מזמינים מקום ברגע, ויוצאים
            לדרך בלב שקט.
          </p>
          <TourSearch variant="hero" className={styles.heroSearch} />
        </div>

        <div className={styles.heroArt}>
          <Parallax>
            <ArchScene />
          </Parallax>
        </div>
      </div>
    </section>
  )
}
