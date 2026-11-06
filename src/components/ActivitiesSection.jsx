import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ACTIVITIES, ACTIVITY_FILTERS } from '../data/activities.js';
import { ArrowDownIcon, ArrowUpRightIcon } from './Icons.jsx';

const EASE_OUT = [0.23, 1, 0.32, 1];

export function ActivitiesSection() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [lightboxState, setLightboxState] = useState(null);
  const detailDialogRef = useRef(null);
  const lightboxDialogRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const lastImageTriggerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const matches = ACTIVITIES.filter(
    item => currentFilter === 'all' || item.category === currentFilter
  );
  const visible = expanded ? matches : matches.slice(0, 6);

  useEffect(() => {
    const dialog = detailDialogRef.current;
    if (!dialog) return;
    if (selectedActivity) {
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('fe-overlay-open');
    } else {
      if (dialog.open) dialog.close();
      if (!lightboxState) document.body.classList.remove('fe-overlay-open');
    }
  }, [selectedActivity, lightboxState]);

  useEffect(() => {
    const lb = lightboxDialogRef.current;
    if (!lb) return;
    if (lightboxState) {
      if (!lb.open) lb.showModal();
      document.body.classList.add('fe-overlay-open');
    } else {
      if (lb.open) lb.close();
      if (!selectedActivity) document.body.classList.remove('fe-overlay-open');
    }
  }, [lightboxState, selectedActivity]);

  const closeDetail = () => {
    setLightboxState(null);
    setSelectedActivity(null);
    requestAnimationFrame(() => {
      lastTriggerRef.current?.focus({ preventScroll: true });
    });
  };

  const closeLightbox = () => {
    setLightboxState(null);
    requestAnimationFrame(() => {
      lastImageTriggerRef.current?.focus({ preventScroll: true });
    });
  };

  const stepLightbox = delta => {
    setLightboxState(prev => {
      if (!prev) return null;
      const total = prev.item.images.length;
      return {
        ...prev,
        index: (prev.index + delta + total) % total,
      };
    });
  };

  const handleFilterSelect = filterId => {
    setCurrentFilter(filterId);
    setExpanded(false);
  };

  return (
    <section id="hoat-dong" className="section activity-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / NHỊP SỐNG NHÀ MẠNG</p>
            <h2>
              Thanh xuân là <span>hành động.</span>
            </h2>
          </div>
          <p>
            Mỗi hoạt động, một trải nghiệm.
            <br />
            Mỗi hành trình, một phiên bản tốt hơn.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Lọc hoạt động">
          {ACTIVITY_FILTERS.map(filter => {
            const isSelected = currentFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                className={isSelected ? 'selected' : undefined}
                aria-pressed={isSelected}
                onClick={() => handleFilterSelect(filter.id)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <p id="filter-status" className="sr-only" aria-live="polite">
          Hiển thị {visible.length} trong {matches.length} hoạt động.
        </p>

        <div id="activities" className="activity-grid">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item, idx) => (
              <motion.article
                key={item.id}
                layout={!shouldReduceMotion}
                className="activity-card"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
                animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.22,
                  delay: Math.min(idx * 0.035, 0.18),
                  ease: EASE_OUT,
                }}
              >
                <div className="card-image">
                  <img src={item.images[0]} alt={item.title} loading="lazy" />
                  <span className="card-tag">{item.label}</span>
                </div>
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <button
                    type="button"
                    aria-label={`Khám phá ${item.title}`}
                    onClick={e => {
                      lastTriggerRef.current = e.currentTarget;
                      setSelectedActivity(item);
                    }}
                  >
                    Khám phá hoạt động
                    <ArrowUpRightIcon />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {!expanded && matches.length > 6 ? (
          <button
            id="show-more"
            type="button"
            className="button secondary"
            onClick={() => setExpanded(true)}
          >
            Xem thêm hoạt động{' '}
            <span>
              <ArrowDownIcon />
            </span>
          </button>
        ) : null}
      </div>

      <dialog
        id="activity-dialog"
        ref={detailDialogRef}
        aria-labelledby="dialog-title"
        onCancel={e => {
          e.preventDefault();
          closeDetail();
        }}
        onClick={e => {
          if (e.target === detailDialogRef.current) closeDetail();
        }}
      >
        <button
          type="button"
          className="dialog-close"
          aria-label="Đóng chi tiết hoạt động"
          onClick={closeDetail}
        >
          ×
        </button>
        {selectedActivity ? (
          <div className="dialog-content">
            <p id="dialog-category" className="eyebrow">
              {selectedActivity.label}
            </p>
            <h2 id="dialog-title">{selectedActivity.title}</h2>
            <p id="dialog-description">{selectedActivity.description}</p>
            <div id="dialog-gallery">
              {selectedActivity.images.map((imgSrc, i) => (
                <button
                  key={imgSrc}
                  type="button"
                  className="gallery-image"
                  aria-label={`Phóng to ${selectedActivity.title} – hình ảnh ${i + 1}`}
                  aria-haspopup="dialog"
                  onClick={e => {
                    lastImageTriggerRef.current = e.currentTarget;
                    setLightboxState({ item: selectedActivity, index: i });
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={`${selectedActivity.title} – hình ảnh ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </dialog>

      <dialog
        id="lightbox-dialog"
        ref={lightboxDialogRef}
        aria-label="Xem ảnh hoạt động"
        onCancel={e => {
          e.preventDefault();
          closeLightbox();
        }}
        onClick={e => {
          if (e.target === lightboxDialogRef.current) closeLightbox();
        }}
        onKeyDown={e => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stepLightbox(-1);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            stepLightbox(1);
          }
        }}
      >
        <button
          type="button"
          className="lightbox-close"
          aria-label="Đóng ảnh"
          onClick={closeLightbox}
        >
          ×
        </button>
        {lightboxState ? (
          <>
            <img
              id="lightbox-image"
              src={lightboxState.item.images[lightboxState.index]}
              alt={`${lightboxState.item.title} – hình ảnh ${lightboxState.index + 1}`}
            />
            <div className="lightbox-controls">
              <button
                type="button"
                className="lightbox-prev"
                aria-label="Ảnh trước"
                disabled={lightboxState.item.images.length < 2}
                onClick={() => stepLightbox(-1)}
              >
                ←
              </button>
              <p id="lightbox-caption" aria-live="polite" aria-atomic="true">
                {lightboxState.item.title} · {lightboxState.index + 1} /{' '}
                {lightboxState.item.images.length}
              </p>
              <button
                type="button"
                className="lightbox-next"
                aria-label="Ảnh tiếp theo"
                disabled={lightboxState.item.images.length < 2}
                onClick={() => stepLightbox(1)}
              >
                →
              </button>
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
