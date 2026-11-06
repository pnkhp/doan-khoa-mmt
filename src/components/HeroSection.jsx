import { ArrowRightIcon, ArrowUpRightIcon, SparkleIcon } from './Icons.jsx';

export function HeroSection() {
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
            <span className="mini-network" aria-hidden="true">
              ⌘
            </span>
            <span>Đoàn kết · Tiên phong · Trách nhiệm · Đổi mới</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="photo-frame">
            <img
              src="/NEWBIE TO CREWBIE/ẢNH/NTC1.jpg"
              alt="Đại gia đình Khoa Mạng chào đón tân sinh viên tại Newbie to Crewbie"
              fetchPriority="high"
              draggable="false"
            />
            <div className="photo-caption">
              <span>WE ARE ONE. WE ARE NETSEC.</span>
              <span>01 / NHÀ MẠNG</span>
            </div>
          </div>
          <div className="floating-label">
            <span className="sparkle">
              <SparkleIcon />
            </span>
            <div>
              Một tập thể.
              <br />
              <strong>Ngàn kết nối.</strong>
            </div>
          </div>
          <span className="visual-coordinates" aria-hidden="true">
            CONNECT / CREATE / CONTRIBUTE
          </span>
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
