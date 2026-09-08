import { useState } from 'react';
import { ArrowRightOutlined, CheckCircleOutlined, DashboardOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { paths } from '../../../app/router/paths';
import { ENTERPRISE_HUBS, type HubTelemetry } from '../types/hubs';
import { EnterpriseGlobe } from './EnterpriseGlobe';
import { TrackingSimulator } from './TrackingSimulator';

export function EnterpriseHero() {
  const [selectedHub, setSelectedHub] = useState<HubTelemetry>(ENTERPRISE_HUBS[0]);

  return (
    <section className="enterprise-hero-section">
      <div className="hero-grid-container">
        {/* Left Column: Value Prop + Tracking Simulator */}
        <div className="hero-left-column">
          <div className="hero-announcement-tag">
            <span className="tag-pulse-blue" />
            <span className="tag-text">NỀN TẢNG LOGISTICS PHÂN TÁN CHUẨN ENTERPRISE</span>
          </div>

          <h1 className="hero-main-heading">
            Kiểm Soát Vòng Đời Đơn Hàng & Vận Tải Đa Kho{' '}
            <span className="heading-highlight-blue">Thời Gian Thực</span>
          </h1>

          <p className="hero-lead-text">
            Giải quyết triệt để bài toán giữ tồn kho đồng thời (Optimistic Locking), điều phối chuyến xe, 
            và theo dõi lộ trình thời gian thực. Được xây dựng trên chuẩn kiến trúc phân tán 
            <strong> Spring Boot Microservices</strong>, <strong>Kafka Event-Driven</strong> và cơ chế <strong>Transactional Outbox</strong> chống mất mát dữ liệu.
          </p>

          <div className="hero-cta-buttons">
            <Link to={paths.dashboard} className="btn-hero-primary">
              <DashboardOutlined style={{ marginRight: '8px' }} />
              Xem Trực Tiếp Dashboard
            </Link>
            <Link to={paths.login} className="btn-hero-secondary">
              Đăng Nhập Quản Trị
              <ArrowRightOutlined style={{ marginLeft: '8px' }} />
            </Link>
          </div>

          <div className="hero-trust-bullets">
            <span className="trust-item">
              <CheckCircleOutlined className="trust-icon" />
              Database per service isolation
            </span>
            <span className="trust-item">
              <CheckCircleOutlined className="trust-icon" />
              Quy tắc giữ tồn BR-01 chuẩn ACID
            </span>
            <span className="trust-item">
              <CheckCircleOutlined className="trust-icon" />
              Saga Compensation tự động
            </span>
          </div>

          {/* Interactive Live Tracking Simulator */}
          <div id="tracking" className="hero-simulator-anchor">
            <TrackingSimulator />
          </div>
        </div>

        {/* Right Column: 3D Globe Visualizer with Live Hub Inspector */}
        <div className="hero-right-column">
          <div className="globe-card-wrapper">
            <div className="globe-card-header">
              <div>
                <span className="globe-header-kicker">MẠNG LƯỚI LOGISTICS TOÀN CẦU</span>
                <h3 className="globe-header-title">3D Logistics Hub & Route Matrix</h3>
              </div>
              <div className="hub-count-badge">
                <span className="hub-count-number">7</span>
                <span className="hub-count-label">Hubs Trọng Điểm</span>
              </div>
            </div>

            <EnterpriseGlobe selectedHub={selectedHub} onSelectHub={setSelectedHub} />
          </div>
        </div>
      </div>
    </section>
  );
}
