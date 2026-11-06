import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AboutSection } from './components/AboutSection.jsx';
import { AchievementsSection } from './components/AchievementsSection.jsx';
import { ActivitiesSection } from './components/ActivitiesSection.jsx';
import { ChatWidget } from './components/ChatWidget.jsx';
import { ContactSection } from './components/ContactSection.jsx';
import { DepartmentPage } from './components/DepartmentPage.jsx';
import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { HeroSection } from './components/HeroSection.jsx';

function ScrollHashManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

function AssetDownloadGuard() {
  useEffect(() => {
    const preventMediaSave = e => {
      if (e.target instanceof Element && e.target.closest('img')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', preventMediaSave);
    document.addEventListener('dragstart', preventMediaSave);
    return () => {
      document.removeEventListener('contextmenu', preventMediaSave);
      document.removeEventListener('dragstart', preventMediaSave);
    };
  }, []);

  return null;
}

function HomePage() {
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

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollHashManager />
        <AssetDownloadGuard />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/ban-hoc-tap" element={<DepartmentPage slug="ban-hoc-tap" />} />
          <Route path="/ban-hoc-tap.html" element={<Navigate to="/ban-hoc-tap" replace />} />
          <Route
            path="/ban-truyen-thong-su-kien"
            element={<DepartmentPage slug="ban-truyen-thong-su-kien" />}
          />
          <Route
            path="/ban-truyen-thong-su-kien.html"
            element={<Navigate to="/ban-truyen-thong-su-kien" replace />}
          />
          <Route path="/ban-thiet-ke" element={<DepartmentPage slug="ban-thiet-ke" />} />
          <Route path="/ban-thiet-ke.html" element={<Navigate to="/ban-thiet-ke" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </MotionConfig>
  );
}
