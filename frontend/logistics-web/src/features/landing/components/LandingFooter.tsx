import { ArrowUpOutlined, GithubOutlined, TruckOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '../../../app/router/paths';

export function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="landing-footer">
      <div className="footer-container">
        {/* Top CTA Bar */}
        <div className="footer-cta-card">
          <div className="cta-content">
            <h3 className="cta-heading">Sẵn Sàng Trải Nghiệm Nền Tảng Smart Logistics?</h3>
            <p className="cta-subheading">
              Khám phá toàn bộ năng lực vận hành, bản đồ định vị chuyến xe và hệ thống quản trị kho thông minh.
            </p>
          </div>
          <div className="cta-buttons">
            <Link to={paths.login}>
              <Button size="large" className="btn-footer-primary">
                Đăng Nhập Vào Hệ Thống
              </Button>
            </Link>
            <Link to={paths.dashboard}>
              <Button size="large" className="btn-footer-secondary">
                Xem Trực Tiếp Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-main-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="brand-badge-small">
                <TruckOutlined />
              </div>
              <span className="brand-name">Smart Logistics Platform</span>
            </div>
            <p className="footer-about">
              Hệ thống quản lý chuỗi cung ứng và vận tải phân tán thế hệ mới, tối ưu hóa toàn diện vòng đời đơn hàng
              từ kho bãi tới tận tay khách hàng.
            </p>
            <div className="footer-status-pill">
              <span className="status-indicator-green" />
              <span>All Systems Operational (60 FPS WebGL)</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Hệ Thống</h4>
            <ul>
              <li>
                <Link to={paths.dashboard}>Dashboard Vận Hành</Link>
              </li>
              <li>
                <Link to={paths.login}>Cổng Đăng Nhập (RBAC)</Link>
              </li>
              <li>
                <a href="#features">Tính Năng Cốt Lõi</a>
              </li>
              <li>
                <a href="#stats">Chỉ Số Hiệu Năng</a>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Kiến Trúc Kỹ Thuật</h4>
            <ul>
              <li>
                <a href="#architecture">Spring Cloud Gateway</a>
              </li>
              <li>
                <a href="#architecture">Kafka Event-Driven</a>
              </li>
              <li>
                <a href="#architecture">Three.js 3D Globe</a>
              </li>
              <li>
                <a href="#architecture">Saga & Outbox Pattern</a>
              </li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Tài Nguyên</h4>
            <ul>
              <li>
                <a
                  href="https://github.com/ManhHieu1809/smart-logistics-platform"
                  target="_blank"
                  rel="noreferrer"
                  className="github-link"
                >
                  <GithubOutlined style={{ marginRight: '6px' }} />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#roadmap">Lộ Trình V0 – V12</a>
              </li>
              <li>
                <span className="text-muted">Tài liệu nghiep_vu.docx (v1.0)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="copyright-text">
            © {new Date().getFullYear()} Smart Logistics Platform. Thiết kế theo chuẩn Master Technical Blueprint.
          </div>
          <button type="button" onClick={scrollToTop} className="scroll-top-btn" title="Về đầu trang">
            <ArrowUpOutlined />
          </button>
        </div>
      </div>
    </footer>
  );
}
