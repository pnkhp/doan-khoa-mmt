/**
 * Shared <dialog> lightbox for viewing single or multiple images in-page.
 */
export function LightboxDialog({
  id = 'lightbox-dialog',
  dialogRef,
  isOpen,
  title,
  images = [],
  activeIndex = 0,
  onClose,
  onStep,
}) {
  const hasMultiple = images.length > 1 && typeof onStep === 'function';
  const currentSrc = images[activeIndex] || images[0];

  return (
    <dialog
      id={id}
      className="award-dialog"
      ref={dialogRef}
      aria-label={title || 'Xem hình ảnh'}
      onCancel={e => {
        e.preventDefault();
        onClose();
      }}
      onClick={e => {
        if (e.target === dialogRef.current) onClose();
      }}
      onKeyDown={e => {
        if (!hasMultiple) return;
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onStep(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          onStep(1);
        }
      }}
    >
      <button
        type="button"
        className="lightbox-close"
        aria-label="Đóng ảnh"
        onClick={onClose}
      >
        ×
      </button>

      {isOpen && currentSrc ? (
        <>
          <img
            id="lightbox-image"
            src={currentSrc}
            alt={
              images.length > 1
                ? `${title} – hình ảnh ${activeIndex + 1}`
                : title
            }
            draggable="false"
          />
          <div
            className={`lightbox-controls${
              hasMultiple ? '' : ' lightbox-controls--center'
            }`}
          >
            {hasMultiple ? (
              <button
                type="button"
                className="lightbox-prev"
                aria-label="Ảnh trước"
                onClick={() => onStep(-1)}
              >
                ←
              </button>
            ) : null}

            <p id="lightbox-caption" aria-live="polite" aria-atomic="true">
              {images.length > 1
                ? `${title} · ${activeIndex + 1} / ${images.length}`
                : title}
            </p>

            {hasMultiple ? (
              <button
                type="button"
                className="lightbox-next"
                aria-label="Ảnh tiếp theo"
                onClick={() => onStep(1)}
              >
                →
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </dialog>
  );
}
