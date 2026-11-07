import { Footer } from '../components/layout/Footer.jsx';
import { Header } from '../components/layout/Header.jsx';
import { AboutSection } from '../components/sections/AboutSection.jsx';
import { AchievementsSection } from '../components/sections/AchievementsSection.jsx';
import { ActivitiesSection } from '../components/sections/ActivitiesSection.jsx';
import { ContactSection } from '../components/sections/ContactSection.jsx';
import { HeroSection } from '../components/sections/HeroSection.jsx';

export function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      <Header variant="home" />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <AboutSection />
        <ActivitiesSection />
        <AchievementsSection />
        <ContactSection />
      </main>
      <Footer variant="home" />
    </>
  );
}
