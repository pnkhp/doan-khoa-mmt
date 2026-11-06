import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { COMMUNITY_MOMENTS } from '../data/activities.js';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons.jsx';

const CARD_SPRING = {
  type: 'spring',
  stiffness: 280,
  damping: 26,
  mass: 0.85,
};

const CAPTION_EASE = [0.23, 1, 0.32, 1];

export function CommunityPhotoDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const total = COMMUNITY_MOMENTS.length;

  const nextCard = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % total);
  }, [total]);

  const prevCard = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (shouldReduceMotion || isHovered || isDragging) return undefined;
    const timer = window.setInterval(nextCard, 4400);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion, isHovered, isDragging, nextCard]);

  // Build visible stack ordered back-to-front so front card renders on top cleanly
  const visibleCount = Math.min(4, total);
  const stackItems = [];
  for (let depth = visibleCount - 1; depth >= 0; depth--) {
    const itemIndex = (activeIndex + depth) % total;
    stackItems.push({
      moment: COMMUNITY_MOMENTS[itemIndex],
      depth,
      itemIndex,
    });
  }

  const activeMoment = COMMUNITY_MOMENTS[activeIndex];

  return (
    <div
      className="photo-deck"
      onPointerEnter={e => {
        if (e.pointerType === 'mouse') setIsHovered(true);
      }}
      onPointerLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
      aria-label="Khoảnh khắc hoạt động Nhà Mạng"
    >
      <div className="photo-deck__stage">
        {stackItems.map(({ moment, depth }) => {
          const isFront = depth === 0;
          const fanSign = depth % 2 === 1 ? 1 : -1;
          const targetX = shouldReduceMotion
            ? 0
            : isFront
            ? 0
            : isHovered
            ? fanSign * (depth * 18 + 6)
            : fanSign * (depth * 7);
          const targetY = shouldReduceMotion
            ? 0
            : isFront
            ? 0
            : isHovered
            ? depth * 12
            : depth * 10;
          const targetScale = shouldReduceMotion ? 1 : 1 - depth * 0.048;
          const targetRotate = shouldReduceMotion
            ? 0
            : isFront
            ? moment.tilt * 0.45
            : moment.tilt + (isHovered ? fanSign * depth * 3.8 : fanSign * depth * 1.8);
          const targetOpacity = shouldReduceMotion
            ? isFront
              ? 1
              : 0
            : 1 - depth * 0.18;

          return (
            <motion.figure
              key={moment.id}
              className={`photo-deck__card${isFront ? ' photo-deck__card--front' : ''}`}
              style={{ zIndex: 10 - depth }}
              initial={false}
              animate={{
                x: targetX,
                y: targetY,
                scale: targetScale,
                rotate: targetRotate,
                opacity: targetOpacity,
              }}
              transition={shouldReduceMotion ? { duration: 0.2 } : CARD_SPRING}
              drag={isFront && !shouldReduceMotion ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.62}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(_, info) => {
                setIsDragging(false);
                if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 300) {
                  if (info.offset.x < 0) nextCard();
                  else prevCard();
                }
              }}
              whileTap={isFront && !shouldReduceMotion ? { scale: 0.985 } : undefined}
              onClick={() => {
                if (isFront && !isDragging) nextCard();
              }}
              aria-hidden={!isFront}
            >
              <div className="photo-deck__media">
                <img
                  src={moment.image}
                  alt={moment.title}
                  draggable="false"
                  loading="lazy"
                />
                <span className="photo-deck__badge">{moment.tag}</span>
              </div>
              <figcaption className="photo-deck__card-footer">
                <strong>{moment.title}</strong>
                <span>Chạm hoặc kéo để xem tiếp ↻</span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      <div className="photo-deck__bar">
        <div className="photo-deck__info" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={activeMoment.id}
              className="photo-deck__caption"
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
              transition={{ duration: 0.18, ease: CAPTION_EASE }}
            >
              {activeMoment.caption}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="photo-deck__controls">
          <button
            type="button"
            className="photo-deck__nav-btn"
            aria-label="Khoảnh khắc trước"
            onClick={prevCard}
          >
            <ArrowLeftIcon />
          </button>
          <div className="photo-deck__dots" role="tablist" aria-label="Chọn khoảnh khắc">
            {COMMUNITY_MOMENTS.map((item, idx) => {
              const selected = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Khoảnh khắc ${idx + 1}: ${item.title}`}
                  className={`photo-deck__dot${selected ? ' is-active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                />
              );
            })}
          </div>
          <button
            type="button"
            className="photo-deck__nav-btn"
            aria-label="Khoảnh khắc tiếp theo"
            onClick={nextCard}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
