import { useEffect, useRef, useState } from 'react';
import { ArrowUpRightIcon } from './Icons.jsx';

export function AchievementsSection() {
  const [previewAward, setPreviewAward] = useState(null);
  const dialogRef = useRef(null);
  const lastTriggerRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (previewAward) {
      if (!dialog.open) dialog.showModal();
      document.body.classList.add('fe-overlay-open');
    } else {
      if (dialog.open) dialog.close();
      document.body.classList.remove('fe-overlay-open');
    }
  }, [previewAward]);

  const closePreview = () => {
    setPreviewAward(null);
    requestAnimationFrame(() => {
      lastTriggerRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <section id="thanh-tich" className="section container">
      <div className="section-heading">
        <div>
          <p className="eyebrow">03 / NHỮNG DẤU ẤN TỰ HÀO</p>
          <h2>
            Nỗ lực hôm nay.
            <br />
            <span>Tự hào mai sau.</span>
          </h2>
        </div>
        <p>
          Sự ghi nhận cho hành trình bền bỉ,
          <br />
          đoàn kết và không ngừng vươn lên.
        </p>
      </div>

      <div className="achievement-layout">
        <button
          type="button"
          className="achievement-feature achievement-feature--btn"
          onClick={e => {
            lastTriggerRef.current = e.currentTarget;
            setPreviewAward({
              src: '/Thanh Tich/CoThiDua-2017-2018.jpeg',
              title: 'Cờ thi đua đơn vị xuất sắc dẫn đầu năm học 2017–2018',
            });
          }}
        >
          <div className="award-image">
            <img
              src="/Thanh Tich/CoThiDua-2017-2018.jpeg"
              alt="Cờ thi đua đơn vị xuất sắc dẫn đầu năm học 2017–2018"
              loading="lazy"
              draggable="false"
            />
          </div>
          <div>
            <p className="eyebrow">DẤU ẤN TẬP THỂ</p>
            <h3>Đơn vị xuất sắc dẫn đầu</h3>
            <p>
              Cờ thi đua của Đoàn Trường Đại học Công nghệ Thông tin, năm học 2017–2018.
            </p>
            <span className="text-link">
              Xem tư liệu{' '}
              <span>
                <ArrowUpRightIcon />
              </span>
            </span>
          </div>
        </button>

        <div className="timeline">
          <article>
            <span>2024 — 2025</span>
            <h3>Đóng góp tích cực vì cộng đồng</h3>
            <p>
              Giấy khen của Ban Cán sự Đoàn ĐHQG-HCM trong công tác Đoàn và phong trào thanh niên.
            </p>
          </article>
          <article>
            <span>2023 — 2024</span>
            <h3>Tiếp nối tinh thần tiên phong</h3>
            <p>
              Cờ khen của BCH Đoàn trường UIT ghi nhận những đóng góp tích cực trong công tác Đoàn và phong trào thanh niên.
            </p>
          </article>
          <article>
            <span>2018 — 2019</span>
            <h3>Dấu ấn tuổi trẻ trên hành trình cống hiến</h3>
            <p>
              Bằng khen của Trung ương Đoàn vì đóng góp tích cực trong công tác Đoàn và phong trào thanh niên trường học.
            </p>
            <button
              type="button"
              className="timeline-preview-btn"
              onClick={e => {
                lastTriggerRef.current = e.currentTarget;
                setPreviewAward({
                  src: '/Thanh Tich/2019-BK-TWĐ.jpeg',
                  title: 'Bằng khen của Trung ương Đoàn năm học 2018–2019',
                });
              }}
            >
              Xem bằng khen <ArrowUpRightIcon />
            </button>
          </article>
        </div>
      </div>

      <dialog
        id="award-dialog"
        className="award-dialog"
        ref={dialogRef}
        aria-label={previewAward ? previewAward.title : 'Xem tư liệu thành tích'}
        onCancel={e => {
          e.preventDefault();
          closePreview();
        }}
        onClick={e => {
          if (e.target === dialogRef.current) closePreview();
        }}
      >
        <button
          type="button"
          className="lightbox-close"
          aria-label="Đóng tư liệu"
          onClick={closePreview}
        >
          ×
        </button>
        {previewAward ? (
          <>
            <img
              id="lightbox-image"
              src={previewAward.src}
              alt={previewAward.title}
              draggable="false"
            />
            <div className="lightbox-controls lightbox-controls--center">
              <p id="lightbox-caption">{previewAward.title}</p>
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
