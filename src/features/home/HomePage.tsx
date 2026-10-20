import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import styles from './HomePage.module.css'
import { AboutSection } from './sections/AboutSection'
import { CallToAction, QuoteSection } from './sections/ClosingSections'
import { DestinationsSection } from './sections/DestinationsSection'
import { HeroSection } from './sections/HeroSection'
import { HowItWorks } from './sections/HowItWorks'
import { StatsStrip } from './sections/StatsStrip'
import { UpcomingTours } from './sections/UpcomingTours'

/** The landing page: composed of independent sections, each loading its own data. */
export default function HomePage() {
  useDocumentTitle()

  return (
    <div className={styles.page}>
      <HeroSection />
      <StatsStrip />
      <DestinationsSection />
      <HowItWorks />
      <UpcomingTours />
      <AboutSection />
      <QuoteSection />
      <CallToAction />
    </div>
  )
}
