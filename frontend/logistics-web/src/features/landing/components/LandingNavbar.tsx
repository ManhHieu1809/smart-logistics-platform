import { ArrowRightOutlined, GlobalOutlined, TruckOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '../../../app/router/paths';

interface LandingNavbarProps {
  onScrollTo: (sectionId: string) => void;
}

export function LandingNavbar({ onScrollTo }: LandingNavbarProps) {
  return (
    <header className="landing-navbar">
      <div className="landing-navbar-container">
        <Link className="landing-brand" to={paths.landing}>
          <div className="landing-brand-badge">
            <TruckOutlined className="landing-brand-icon" />
          </div>
          <div className="landing-brand-text">
            <span className="brand-title">Smart Logistics</span>
            <span className="brand-subtitle">Platform Enterprise</span>
          </div>
        </Link>

        <nav className="landing-nav-links" aria-label="Main landing navigation">
          <button type="button" onClick={() => onScrollTo('features')} className="nav-link-btn">
            Tính Năng
          </button>
          <button type="button" onClick={() => onScrollTo('stats')} className="nav-link-btn">
            Chỉ Số
          </button>
          <button type="button" onClick={() => onScrollTo('architecture')} className="nav-link-btn">
            Kiến Trúc Microservices
          </button>
          <button type="button" onClick={() => onScrollTo('roadmap')} className="nav-link-btn">
            Lộ Trình V0-V12
          </button>
        </nav>

        <div className="landing-navbar-actions">
          <Link to={paths.dashboard}>
            <Button className="btn-secondary-glass" icon={<GlobalOutlined />}>
              Live Demo
            </Button>
          </Link>
          <Link to={paths.login}>
            <Button className="btn-primary-neon" iconPosition="end" icon={<ArrowRightOutlined />}>
              Đăng Nhập
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
