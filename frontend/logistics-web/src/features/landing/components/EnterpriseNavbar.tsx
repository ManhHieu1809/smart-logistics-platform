import { ArrowRightOutlined, DashboardOutlined, TruckOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { paths } from '../../../app/router/paths';

interface EnterpriseNavbarProps {
  onScrollTo: (id: string) => void;
}

export function EnterpriseNavbar({ onScrollTo }: EnterpriseNavbarProps) {
  return (
    <header className="enterprise-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link className="brand-group" to={paths.landing}>
          <div className="brand-icon-box">
            <TruckOutlined />
          </div>
          <div className="brand-text-col">
            <span className="brand-name">Smart Logistics</span>
            <span className="brand-tagline">Enterprise Platform</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="nav-links" aria-label="Main Navigation">
          <button type="button" onClick={() => onScrollTo('tracking')} className="nav-item-btn">
            Tra Cứu Vận Đơn
          </button>
          <button type="button" onClick={() => onScrollTo('solutions')} className="nav-item-btn">
            Giải Pháp Theo Vai Trò
          </button>
          <button type="button" onClick={() => onScrollTo('architecture')} className="nav-item-btn">
            Kiến Trúc Kỹ Thuật
          </button>
          <button type="button" onClick={() => onScrollTo('roadmap')} className="nav-item-btn">
            Lộ Trình V0–V12
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="navbar-actions">
          <Link to={paths.dashboard} className="btn-navbar-secondary">
            <DashboardOutlined style={{ marginRight: '6px' }} />
            Xem Dashboard
          </Link>
          <Link to={paths.login} className="btn-navbar-primary">
            Đăng Nhập
            <ArrowRightOutlined style={{ marginLeft: '6px' }} />
          </Link>
        </div>
      </div>
    </header>
  );
}
