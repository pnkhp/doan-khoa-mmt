import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from './Icons.jsx';

const NAV_ITEMS = [
  { id: 'trang-chu', label: 'Trang chủ' },
  { id: 'gioi-thieu', label: 'Giới thiệu' },
  { id: 'hoat-dong', label: 'Hoạt động' },
  { id: 'thanh-tich', label: 'Thành tích' },
];

export function Header({ variant = 'home' }) {
  const [activeSection, setActiveSection] = useState('trang-chu');
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const swipeStartRef = useRef(null);

  useEffect(() => {
    if (variant !== 'home') return undefined;
    if (!('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0 }
    );

    const sections = document.querySelectorAll('main section[id]');
    sections.forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, [variant]);

  useEffect(() => {
    const dialog = drawerRef.current;
    if (!dialog) return undefined;

    if (menuOpen) {
      if (!dialog.open) dialog.showModal();
      document.body.classList.add('fe-overlay-open');
    } else {
      if (dialog.open) dialog.close();
      document.body.classList.remove('fe-overlay-open');
    }

    const mq = window.matchMedia('(min-width: 821px)');
    const handleMq = e => {
      if (e.matches && menuOpen) setMenuOpen(false);
    };
    mq.addEventListener('change', handleMq);
    return () => {
      mq.removeEventListener('change', handleMq);
      document.body.classList.remove('fe-overlay-open');
    };
  }, [menuOpen]);

  const closeDrawer = () => {
    setMenuOpen(false);
    requestAnimationFrame(() => {
      toggleBtnRef.current?.focus({ preventScroll: true });
    });
  };

  const handleNavClick = targetId => {
    setActiveSection(targetId);
    if (menuOpen) setMenuOpen(false);
  };

  if (variant === 'department') {
    return (
      <header className="header department-header">
        <div className="container nav-wrap">
          <Link className="brand" to="/" aria-label="Đoàn Khoa MMT và TT – Trang chủ">
            <img className="brand-logo" src="/images/logo-mmt.png" alt="" width="48" height="48" />
            <span>
              ĐOÀN KHOA MMT&amp;TT
              <small>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN</small>
            </span>
          </Link>
          <Link className="text-link" to="/#gioi-thieu">
            ← Về trang giới thiệu
          </Link>
        </div>
      </header>
    );
  }

  const renderLinks = () => (
    <>
      {NAV_ITEMS.map(item => {
        const isActive = activeSection === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={isActive ? 'active' : undefined}
            aria-current={isActive ? 'location' : undefined}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
          </a>
        );
      })}
      <a
        className="nav-contact"
        href="#lien-he"
        onClick={() => handleNavClick('lien-he')}
      >
        Kết nối với chúng mình{' '}
        <span>
          <ArrowUpRightIcon />
        </span>
      </a>
    </>
  );

  return (
    <>
      <header className="header">
        <div className="container nav-wrap">
          <a
            className="brand"
            href="#trang-chu"
            aria-label="Đoàn Khoa MMT&TT – Trang chủ"
            onClick={() => handleNavClick('trang-chu')}
          >
            <img className="brand-logo" src="/images/logo-mmt.png" alt="" width="48" height="48" />
            <span>
              ĐOÀN KHOA MMT&amp;TT
              <small>TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN</small>
            </span>
          </a>
          <button
            ref={toggleBtnRef}
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            aria-controls="menu-drawer"
            aria-haspopup="dialog"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            ☰
          </button>
          <nav id="navigation" aria-label="Điều hướng chính">
            {renderLinks()}
          </nav>
        </div>
      </header>

      <dialog
        id="menu-drawer"
        ref={drawerRef}
        aria-label="Điều hướng chính"
        onCancel={e => {
          e.preventDefault();
          closeDrawer();
        }}
        onClick={e => {
          if (e.target === drawerRef.current) closeDrawer();
        }}
        onTouchStart={e => {
          swipeStartRef.current =
            e.touches.length === 1
              ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
              : null;
        }}
        onTouchEnd={e => {
          if (!swipeStartRef.current) return;
          const touch = e.changedTouches[0];
          const dx = touch.clientX - swipeStartRef.current.x;
          const dy = touch.clientY - swipeStartRef.current.y;
          if (dx > 60 && dx > Math.abs(dy) * 1.5) closeDrawer();
          swipeStartRef.current = null;
        }}
      >
        <button type="button" className="drawer-close" aria-label="Đóng menu" onClick={closeDrawer}>
          ×
        </button>
        <nav className="drawer-nav" aria-label="Điều hướng di động">
          {renderLinks()}
        </nav>
      </dialog>
    </>
  );
}
