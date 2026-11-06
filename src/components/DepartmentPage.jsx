import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { DEPARTMENTS } from '../data/departments.js';
import { Footer } from './Footer.jsx';
import { Header } from './Header.jsx';

const PAGE_EASE = [0.23, 1, 0.32, 1];

export function DepartmentPage({ slug }) {
  const dept = DEPARTMENTS.find(item => item.slug === slug);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (dept) {
      document.title = `${dept.name} | Đoàn Khoa MMT&TT`;
    }
    return () => {
      document.title = 'Đoàn Khoa MMT&TT | Kết nối đam mê, lan tỏa sức trẻ';
    };
  }, [dept]);

  if (!dept) {
    return <Navigate to="/" replace />;
  }

  const otherDepts = DEPARTMENTS.filter(item => item.slug !== dept.slug);

  return (
    <>
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      <Header variant="department" />
      <motion.main
        id="main"
        tabIndex={-1}
        className="container"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: PAGE_EASE }}
      >
        <section className="department-hero" aria-labelledby="department-title">
          <nav aria-label="Đường dẫn">
            <Link className="text-link" to="/#teams-title">
              Các ban chuyên môn
            </Link>{' '}
            / <span aria-current="page">{dept.name}</span>
          </nav>
          <p className="eyebrow">BA BAN · MỘT TINH THẦN</p>
          <h1 id="department-title">{dept.name}</h1>
          <h2>{dept.subtitle}</h2>
          <p className="lead">{dept.lead}</p>
        </section>

        <div className="department-layout">
          <div className="department-story">
            <section aria-labelledby="duties-title">
              <h2 id="duties-title">Ban làm những gì?</h2>
              <ul>
                {dept.duties.map(duty => (
                  <li key={duty.label}>
                    <strong>{duty.label}</strong> {duty.text}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="practice-title">
              <h2 id="practice-title">Từ vai trò đến hoạt động</h2>
              <p>{dept.practice}</p>
              <Link className="text-link" to="/#hoat-dong">
                Khám phá các hoạt động Đoàn Khoa →
              </Link>
            </section>

            <section aria-labelledby="together-title">
              <h2 id="together-title">Phối hợp để cùng tạo dấu ấn</h2>
              <p>
                Ba ban hỗ trợ lẫn nhau từ nội dung – tổ chức – truyền thông – hình ảnh. Mỗi ban có vai trò riêng, cùng góp phần nâng cao chất lượng chương trình và tạo môi trường để sinh viên thử sức, học hỏi, phát triển kỹ năng.
              </p>
            </section>

            <nav aria-label="Khám phá các ban khác">
              <h2>Tìm hiểu các ban khác</h2>
              <div className="department-other">
                {otherDepts.map(other => (
                  <Link
                    key={other.slug}
                    className="button secondary"
                    to={`/${other.slug}`}
                  >
                    {other.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <aside className="department-aside" aria-labelledby="join-title">
            <p className="eyebrow">TÌM NƠI BẠN CÓ THỂ GÓP SỨC</p>
            <h2 id="join-title">Bạn muốn tìm hiểu thêm?</h2>
            <p>{dept.joinPrompt}</p>
            <p>
              Để biết thông tin tuyển thành viên, thời gian và yêu cầu của từng đợt, hãy theo dõi hoặc liên hệ Facebook Đoàn Khoa. Trang này chưa có lịch tuyển hay biểu mẫu đăng ký được xác nhận.
            </p>
            <a
              className="button primary"
              href="https://www.facebook.com/uit.nc"
              target="_blank"
              rel="noopener noreferrer"
            >
              Liên hệ Đoàn Khoa ↗
            </a>
          </aside>
        </div>
      </motion.main>
      <Footer variant="department" />
    </>
  );
}
