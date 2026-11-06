import { Link } from 'react-router-dom';
import { DEPARTMENTS } from '../data/departments.js';

export function AboutSection() {
  return (
    <section id="gioi-thieu" className="section about container">
      <div className="about-heading">
        <p className="eyebrow">01 / VỀ CHÚNG MÌNH</p>
        <h2>
          Chung một mái nhà.
          <br />
          <span>Chung một khát vọng.</span>
        </h2>
        <div className="about-milestone">
          <img
            src="/images/logo-mmt.png"
            alt=""
            width="42"
            height="42"
            className="about-milestone__logo"
            loading="lazy"
          />
          <div className="about-milestone__text">
            <strong>Đoàn cơ sở · 11/11/2014</strong>
            <span>Hơn một thập kỷ đồng hành cùng tuổi trẻ Nhà Mạng</span>
          </div>
        </div>
      </div>

      <div className="about-content">
        <p className="lead">
          Chúng mình là Đoàn TNCS Hồ Chí Minh Khoa Mạng máy tính và Truyền thông.
        </p>
        <p>
          Trực thuộc Đoàn Trường Đại học Công nghệ Thông tin – ĐHQG-HCM, Đoàn Khoa là mái nhà chung của những sinh viên mang trong mình tinh thần sáng tạo, nhiệt huyết và khát vọng cống hiến.
        </p>
        <p>
          Chính thức trở thành Đoàn cơ sở ngày <strong>11/11/2014</strong>, chúng mình luôn lấy đoàn viên, sinh viên làm trung tâm: kết nối học tập với trải nghiệm, đồng hành trên hành trình rèn luyện và trưởng thành.
        </p>
        <div className="values">
          <span>Đoàn kết</span>
          <span>Tiên phong</span>
          <span>Trách nhiệm</span>
          <span>Đổi mới</span>
        </div>
      </div>

      <div className="teams" aria-labelledby="teams-title">
        <div className="teams-intro">
          <p className="eyebrow">BA BAN · MỘT TINH THẦN</p>
          <h3 id="teams-title">
            Tìm nơi bạn
            <br />
            có thể góp sức.
          </h3>
          <p>
            Từ kiến thức đến câu chuyện và hình ảnh, mỗi thế mạnh đều có một nơi để phát huy.
          </p>
        </div>
        <div className="team-list">
          {DEPARTMENTS.map(dept => (
            <article key={dept.slug} className="team-card">
              <span className="team-number" aria-hidden="true">
                {dept.number}
              </span>
              <div>
                <h3>
                  <Link className="team-card-link" to={`/${dept.slug}`}>
                    {dept.name}
                  </Link>
                </h3>
                <p>{dept.shortDesc}</p>
                <span className="team-card-cta" aria-hidden="true">
                  Tìm hiểu về ban →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
