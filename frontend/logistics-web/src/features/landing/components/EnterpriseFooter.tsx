import { ArrowUpOutlined, GithubOutlined, SafetyCertificateOutlined, TruckOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { paths } from '../../../app/router/paths';

export function EnterpriseFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="enterprise-footer">
      <div className="footer-inner-container">
        {/* Top Banner Box */}
        <div className="footer-conversion-box">
          <div className="conversion-text">
            <h3 className="conversion-title">Sẵn Sàng Trải Nghiệm Hệ Thống Vận Hành?</h3>
            <p className="conversion-desc">
              Khám phá trực tiếp Dashboard giám sát chuyến giao, quản lý đơn hàng và cấu hình mạng lưới kho bãi.
            </p>
          </div>
          <div className="conversion-actions">
            <Link to={paths.dashboard} className="btn-footer-demo">
              Khám Phá Live Dashboard
            </Link>
            <Link to={paths.login} className="btn-footer-login">
              Đăng Nhập Quản Trị
            </Link>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="footer-columns-grid">
          <div className="footer-col-brand">
            <div className="footer-brand-title">
              <div className="footer-brand-icon">
                <TruckOutlined />
              </div>
              <span>Smart Logistics Platform</span>
            </div>
            <p className="footer-brand-desc">
              Nền tảng quản trị chuỗi cung ứng và vận tải phân tán thế hệ mới, xây dựng theo chuẩn tài liệu Master Product & Technical Blueprint.
            </p>
            <div className="system-health-pill">
              <span className="health-dot" />
              <span>Hạ Tầng Sẵn Sàng (60 FPS WebGL • React 19)</span>
            </div>
          </div>

          <div className="footer-col-nav">
            <h5 className="footer-col-header">Chức Năng Chính</h5>
            <ul>
              <li>
                <Link to={paths.dashboard}>Bảng Điều Khiển (Dashboard)</Link>
              </li>
              <li>
                <Link to={paths.login}>Cổng Đăng Nhập (RBAC Login)</Link>
              </li>
              <li>
                <a href="#tracking">Tra Cứu Tiến Độ Vận Đơn</a>
              </li>
              <li>
                <a href="#solutions">Giải Pháp Theo Vai Trò</a>
              </li>
            </ul>
          </div>

          <div className="footer-col-nav">
            <h5 className="footer-col-header">Kiến Trúc Microservices</h5>
            <ul>
              <li>
                <a href="#architecture">Spring Cloud Gateway</a>
              </li>
              <li>
                <a href="#architecture">Optimistic Locking (BR-01)</a>
              </li>
              <li>
                <a href="#architecture">Transactional Outbox & CDC</a>
              </li>
              <li>
                <a href="#architecture">Saga Compensation Pattern</a>
              </li>
            </ul>
          </div>

          <div className="footer-col-nav">
            <h5 className="footer-col-header">Tài Liệu & Mã Nguồn</h5>
            <ul>
              <li>
                <a
                  href="https://github.com/ManhHieu1809/smart-logistics-platform"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-repo-link"
                >
                  <GithubOutlined style={{ marginRight: '6px' }} />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#roadmap">Lộ Trình Tiến Hóa V0–V12</a>
              </li>
              <li>
                <span className="footer-text-dim">
                  <SafetyCertificateOutlined style={{ marginRight: '4px' }} />
                  Quy chuẩn nghiep_vu.docx (v1.0)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-copyright">
          <span className="copyright-label">
            © {new Date().getFullYear()} Smart Logistics Platform. Tuân thủ chuẩn thiết kế Enterprise Gateway UI/UX Pro Max.
          </span>
          <button type="button" onClick={scrollToTop} className="btn-back-to-top" title="Lên đầu trang">
            <ArrowUpOutlined />
          </button>
        </div>
      </div>
    </footer>
  );
}
