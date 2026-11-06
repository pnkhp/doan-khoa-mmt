import { useCallback, useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { ArrowRightIcon, ArrowUpRightIcon } from './Icons.jsx';

const HERO_SLIDES = [
  {
    id: 'ntc',
    code: '01 / NHÀ MẠNG',
    badge: 'Newbie to Crewbie',
    title: 'Chào đón Tân sinh viên gia nhập đại gia đình Khoa Mạng',
    image: '/NEWBIE TO CREWBIE/ẢNH/NTC1.jpg',
    alt: 'Đại gia đình Khoa Mạng chào đón tân sinh viên tại Newbie to Crewbie',
  },
  {
    id: 'netsec',
    code: '02 / HỌC THUẬT',
    badge: 'NETSEC DAY',
    title: 'Kết nối sinh viên, giảng viên và doanh nghiệp công nghệ',
    image: '/NETSECDAY/ẢNH/NSDTL1.jpg',
    alt: 'Hoạt động học thuật và giao lưu doanh nghiệp tại NETSEC DAY',
  },
  {
    id: 'ndx',
    code: '03 / TÌNH NGUYỆN',
    badge: 'Ngọn Đuốc Xanh',
    title: 'Lan tỏa nhiệt huyết sẻ chia “Cho đi là còn mãi”',
    image: '/NGỌN ĐUỐC XANH/NDX2026.jpg',
    alt: 'Chiến dịch tình nguyện Ngọn Đuốc Xanh của Đoàn Khoa MMT&TT',
  },
  {
    id: 'badminton',
    code: '04 / THỂ THAO',
    badge: 'NC Open Badminton',
    title: 'Bùng nổ năng lượng và gắn kết đoàn viên trên sân cầu',
    image: '/NC OPEN BADMINTON 2026/BADMINTON1.jpg',
    alt: 'Giải cầu lông mở rộng NC Open Badminton 2026',
  },
];

const STACK_AVATARS = [
  '/NEWBIE TO CREWBIE/ẢNH/NTC1.jpg',
  '/NGỌN ĐUỐC XANH/NDX2026.jpg',
  '/VNU TOUR/ẢNH/VNUTOUR.jpg',
];

const TILT_SPRING = { stiffness: 220, damping: 24, mass: 0.7 };
const SLIDE_EASE = [0.23, 1, 0.32, 1];

export function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(-2);
  const springRotateX = useSpring(rotateX, TILT_SPRING);
  const springRotateY = useSpring(rotateY, TILT_SPRING);

  const nextSlide = useCallback(() => {
    setActiveIdx(prev => (prev + 1) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion || isHovered) return undefined;
    const timer = window.setInterval(nextSlide, 4800);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion, isHovered, nextSlide]);

  const handlePointerMove = e => {
    if (shouldReduceMotion || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * 7);
    rotateY.set(px * 8);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(-2);
  };

  const activeSlide = HERO_SLIDES[activeIdx];

  return (
    <section id="trang-chu" className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" /> TUỔI TRẺ MMT&amp;TT · UIT
          </p>
          <h1>
            Kết nối đam mê.
            <br />
            <span>Lan tỏa sức trẻ.</span>
          </h1>
          <p className="hero-description">
            Nơi những người trẻ công nghệ cùng học hỏi, tiên phong và cống hiến. Cùng chúng mình viết nên hành trình thanh xuân đầy dấu ấn tại{' '}
            <strong>“Nhà Mạng”.</strong>
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#hoat-dong">
              Khám phá hoạt động{' '}
              <span>
                <ArrowUpRightIcon />
              </span>
            </a>
            <a className="text-link" href="#gioi-thieu">
              Về chúng mình{' '}
              <span>
                <ArrowRightIcon />
              </span>
            </a>
          </div>
          <div className="hero-note">
            <span className="hero-note__dot" aria-hidden="true" />
            <span>Đoàn kết · Tiên phong · Trách nhiệm · Đổi mới</span>
          </div>
        </div>

        <div
          className="hero-visual"
          onPointerEnter={e => {
            if (e.pointerType === 'mouse') setIsHovered(true);
          }}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            className="photo-frame hero-showcase"
            style={
              shouldReduceMotion
                ? undefined
                : {
                    rotateX: springRotateX,
                    rotateY: springRotateY,
                    transformPerspective: 1000,
                  }
            }
          >
            <div
              className="hero-showcase__viewport"
              onClick={nextSlide}
              role="button"
              tabIndex={0}
              aria-label={`Đang hiển thị ${activeSlide.badge}. Nhấn để chuyển sang khoảnh khắc tiếp theo`}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  nextSlide();
                }
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeSlide.id}
                  src={activeSlide.image}
                  alt={activeSlide.alt}
                  fetchPriority={activeIdx === 0 ? 'high' : 'auto'}
                  draggable="false"
                  className="hero-showcase__img"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 1.04 }
                  }
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, scale: 1 }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.985 }
                  }
                  transition={{ duration: 0.28, ease: SLIDE_EASE }}
                />
              </AnimatePresence>

              <div className="hero-showcase__overlay">
                <span className="hero-showcase__pill">{activeSlide.badge}</span>
                <p className="hero-showcase__title">{activeSlide.title}</p>
              </div>
            </div>

            <div className="photo-caption hero-showcase__footer">
              <span>WE ARE ONE. WE ARE NETSEC.</span>
              <span>{activeSlide.code}</span>
            </div>
          </motion.div>

          <div className="floating-label">
            <div className="community-avatar-stack" aria-hidden="true">
              {STACK_AVATARS.map(src => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="community-avatar-stack__img"
                  draggable="false"
                />
              ))}
              <span className="community-avatar-stack__count">1.3K+</span>
            </div>
            <div>
              Một tập thể.
              <br />
              <strong>Ngàn kết nối.</strong>
            </div>
          </div>

          <div
            className="hero-thumb-dock"
            role="tablist"
            aria-label="Chọn khoảnh khắc tiêu biểu"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const selected = idx === activeIdx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={slide.badge}
                  className={`hero-thumb${selected ? ' is-active' : ''}`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <img src={slide.image} alt="" draggable="false" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="container stats"
        role="group"
        aria-label="Đoàn Khoa qua các con số"
      >
        <div>
          <strong>
            2014
            <span>
              <ArrowUpRightIcon />
            </span>
          </strong>
          <p>Dấu mốc trở thành Đoàn cơ sở</p>
        </div>
        <div>
          <strong>18</strong>
          <p>Chi đoàn trực thuộc</p>
        </div>
        <div>
          <strong>1.336+</strong>
          <p>Đoàn viên &amp; sinh viên</p>
        </div>
        <div>
          <strong>03</strong>
          <p>Ban chuyên môn đồng hành</p>
        </div>
      </div>
    </section>
  );
}
