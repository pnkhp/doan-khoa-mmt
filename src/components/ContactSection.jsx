import { CommunityPhotoDeck } from './CommunityPhotoDeck.jsx';
import { ArrowUpRightIcon } from './Icons.jsx';

export function ContactSection() {
  return (
    <section id="lien-he" className="contact-section">
      <div className="container contact-inner contact-layout">
        <div className="contact-copy">
          <p className="eyebrow">KẾT NỐI ĐỂ CÙNG ĐI XA HƠN</p>
          <h2>
            Bạn là một phần
            <br />
            của <span>Nhà Mạng.</span>
          </h2>
          <p>
            Cùng học hỏi. Cùng trải nghiệm. Cùng tạo nên những điều ý nghĩa.
          </p>
          <div className="contact-actions">
            <a className="button primary" href="#hoat-dong">
              Tìm hoạt động dành cho bạn{' '}
              <span>
                <ArrowUpRightIcon />
              </span>
            </a>
            <a
              className="button secondary contact-fb-btn"
              href="https://www.facebook.com/uit.nc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fanpage Đoàn Khoa{' '}
              <span>
                <ArrowUpRightIcon />
              </span>
            </a>
          </div>
        </div>

        <CommunityPhotoDeck />
      </div>
    </section>
  );
}
