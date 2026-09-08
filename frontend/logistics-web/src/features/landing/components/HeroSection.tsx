import {
  ArrowRightOutlined,
  CompassOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '../../../app/router/paths';
import { GlobeScene } from './GlobeScene';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left text column */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulsing-dot" />
            <span>SMART LOGISTICS PLATFORM • ENTERPRISE READY</span>
          </div>

          <h1 className="hero-title">
            Vận Hành Chuỗi Cung Ứng & Vận Tải{' '}
            <span className="gradient-text">Thời Gian Thực</span>
          </h1>

          <p className="hero-description">
            Nền tảng quản trị vòng đời đơn hàng, điều phối giao vận thông minh và kiểm soát tồn kho đa kho.
            Xây dựng trên nền tảng kiến trúc <strong>Spring Boot Microservices</strong>, <strong>Kafka Event-Driven</strong>, 
            và giao diện <strong>React 19 Realtime</strong> hiện đại.
          </p>

          <div className="hero-actions">
            <Link to={paths.login}>
              <Button className="btn-hero-primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end">
                Đăng Nhập Hệ Thống
              </Button>
            </Link>

            <Link to={paths.dashboard}>
              <Button className="btn-hero-secondary" size="large" icon={<DashboardOutlined />}>
                Xem Dashboard Demo
              </Button>
            </Link>

            <Button className="btn-hero-ghost" size="large" onClick={onExploreClick} icon={<CompassOutlined />}>
              Khám Phá Tính Năng
            </Button>
          </div>

          {/* Micro metrics bar */}
          <div className="hero-feature-tags">
            <div className="feature-tag">
              <ThunderboltOutlined className="tag-icon" />
              <span>Saga Distributed Transactions</span>
            </div>
            <div className="feature-tag">
              <span className="tag-code-badge">CDC</span>
              <span>Debezium + Kafka Outbox</span>
            </div>
            <div className="feature-tag">
              <span className="tag-pulse-badge">GPS</span>
              <span>Realtime Driver Tracking</span>
            </div>
          </div>
        </div>

        {/* Right 3D Globe Visual */}
        <div className="hero-visual">
          <div className="globe-wrapper">
            <GlobeScene />

            {/* Floating Glass Badges overlaying the 3D globe */}
            <div className="floating-card top-right-card">
              <div className="card-indicator green" />
              <div>
                <div className="card-label">Global Fleet Active</div>
                <div className="card-value">1,482 Phương Tiện</div>
              </div>
            </div>

            <div className="floating-card bottom-left-card">
              <div className="card-indicator cyan" />
              <div>
                <div className="card-label">SLA Giao Hàng Đúng Hạn</div>
                <div className="card-value">99.85% On-Time</div>
              </div>
            </div>

            <div className="floating-card bottom-right-hint">
              <span>✦ Kéo xoay 3D tương tác</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
