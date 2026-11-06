import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowUpRightIcon } from './Icons.jsx';

export function Footer({ variant = 'home' }) {
  if (variant === 'department') {
    return (
      <footer className="department-footer">
        <div className="container">
          <p>Đoàn TNCS Hồ Chí Minh Khoa Mạng máy tính và Truyền thông · UIT</p>
          <Link className="text-link" to="/#teams-title">
            ← Quay lại các ban chuyên môn
          </Link>
        </div>
      </footer>
    );
  }

  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <a className="brand" href="#trang-chu">
            <img className="brand-logo" src="/images/logo-mmt.png" alt="" width="48" height="48" />
            <span>
              ĐOÀN KHOA MMT&amp;TT
              <small>KẾT NỐI ĐAM MÊ. LAN TỎA SỨC TRẺ.</small>
            </span>
          </a>
          <p>
            Đoàn TNCS Hồ Chí Minh Khoa Mạng máy tính và Truyền thông
            <br />
            Trường Đại học Công nghệ Thông tin – ĐHQG-HCM
          </p>
        </div>
        <div>
          <h3>Khám phá</h3>
          <a href="#gioi-thieu">Về Đoàn Khoa</a>
          <a href="#hoat-dong">Hoạt động nổi bật</a>
          <a href="#thanh-tich">Thành tích</a>
        </div>
        <div>
          <h3>Kết nối</h3>
          <p id="contact-email">Email: Đang cập nhật</p>
          <p id="contact-facebook">
            <a
              href="https://www.facebook.com/uit.nc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Đoàn Khoa <ArrowUpRightIcon />
            </a>
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Đoàn Khoa Mạng máy tính và Truyền thông.</span>
        <a href="#trang-chu">
          Về đầu trang <ArrowUpIcon />
        </a>
      </div>
    </footer>
  );
}
