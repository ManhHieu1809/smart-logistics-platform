import { useState } from 'react';
import {
  CarOutlined,
  CheckOutlined,
  CompassOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { paths } from '../../../app/router/paths';

interface RoleSolution {
  id: string;
  roleTitle: string;
  roleTag: string;
  icon: React.ReactNode;
  heading: string;
  summary: string;
  keyFeatures: string[];
  systemBenefits: { label: string; value: string }[];
  targetAction: string;
}

const ROLE_SOLUTIONS: RoleSolution[] = [
  {
    id: 'operator',
    roleTitle: 'Điều Phối Viên (Operator)',
    roleTag: 'TRUNG TÂM VẬN HÀNH',
    icon: <CompassOutlined />,
    heading: 'Điều phối đa kênh & Xử lý đơn hàng thông minh',
    summary:
      'Quản lý toàn diện quy trình đơn hàng từ lúc tiếp nhận, xác minh tồn kho tới phân bổ phương tiện vận chuyển và giám sát chỉ số SLA vận hành theo thời gian thực.',
    keyFeatures: [
      'Orchestration tự động luồng xác nhận đơn và giữ hàng (Order Confirmation & Reservation).',
      'Phân bổ tự động hoặc thủ công tài xế khả dụng dựa trên tình trạng hoạt động (Policy BR-07).',
      'Theo dõi trực tiếp dòng trạng thái đơn hàng (Timeline Audit Trail) minh bạch.',
      'Cơ chế xử lý bù trừ (Saga Compensation) tự động khi có biến cố thanh toán hoặc hủy đơn.',
    ],
    systemBenefits: [
      { label: 'Thời gian phân phối đơn', value: '< 2 phút' },
      { label: 'Tỷ lệ gán chuyến tối ưu', value: '98.4%' },
      { label: 'Xử lý lỗi tự động', value: 'Zero Over-assign' },
    ],
    targetAction: 'Truy cập Bảng Điều Phối',
  },
  {
    id: 'warehouse',
    roleTitle: 'Quản Lý Kho (Warehouse)',
    roleTag: 'QUẢN TRỊ TỒN KHO',
    icon: <DatabaseOutlined />,
    heading: 'Kiểm soát tồn kho chính xác với Optimistic Locking',
    summary:
      'Triệt tiêu hoàn toàn rủi ro bán vượt tồn (overselling). Phân định rõ ràng giữa lượng tồn vật lý (quantity) và lượng hàng đã giữ trước (reserved_quantity) theo quy tắc nghiệp vụ BR-01.',
    keyFeatures: [
      'Cơ chế Versioning & Optimistic Lock: Đảm bảo giao dịch an toàn khi hàng nghìn người cùng mua sản phẩm cuối.',
      'Quản lý danh mục sản phẩm (SKU, quy cách đóng gói, kích thước, trọng lượng).',
      'Ghi nhận đầy đủ biến động kho (StockTransaction) cho từng thao tác nhập, xuất, giữ và nhả tồn.',
      'Cảnh báo mức tồn an toàn (Low Stock Alert) hỗ trợ nhập hàng kịp thời.',
    ],
    systemBenefits: [
      { label: 'Tỷ lệ chênh lệch kho', value: '0.00%' },
      { label: 'Tốc độ khóa giữ tồn (Lock latency)', value: '< 8ms' },
      { label: 'Truy vết giao dịch', value: '100% Audit trail' },
    ],
    targetAction: 'Xem Danh Mục Kho & Tồn',
  },
  {
    id: 'driver',
    roleTitle: 'Tài Xế Giao Vận (Driver)',
    roleTag: 'ĐỘI NGŨ GIAO VẬN',
    icon: <CarOutlined />,
    heading: 'Giao diện chuyến giao thông suốt & Định vị Realtime',
    summary:
      'Hỗ trợ tài xế nhận chuyến nhanh chóng, tối ưu hóa cung đường giao nhận và cập nhật trạng thái từng điểm dừng theo đúng quyền sở hữu chuyến giao (Ownership Authorization).',
    keyFeatures: [
      'Chỉ xem và cập nhật chuyến giao thuộc về mình (Nguyên tắc bảo mật BR-06).',
      'Quy trình giao hàng 4 bước: Nhận chuyến -> Đến kho (Pickup) -> Đang giao -> Đã hoàn tất.',
      'Cơ chế gửi tọa độ GPS định kỳ lên hệ thống qua Redis & WebSocket độ trễ thấp.',
      'Ký nhận điện tử e-POD (Proof of Delivery) xác nhận thành công tức thì.',
    ],
    systemBenefits: [
      { label: 'Thời gian bàn giao hàng', value: 'Tiết kiệm 25%' },
      { label: 'Tỷ lệ xác thực chuyến đúng', value: '100%' },
      { label: 'Tiết kiệm nhiên liệu lộ trình', value: '14%' },
    ],
    targetAction: 'Xem Cổng Thông Tin Tài Xế',
  },
  {
    id: 'customer',
    roleTitle: 'Doanh Nghiệp & Khách Hàng (Customer)',
    roleTag: 'CỔNG THÔNG TIN KHÁCH HÀNG',
    icon: <UserOutlined />,
    heading: 'Minh bạch hành trình & Sổ địa chỉ nhận hàng linh hoạt',
    summary:
      'Cung cấp cho khách hàng doanh nghiệp trải nghiệm chủ động: tự quản lý địa chỉ nhận hàng, đặt hàng số lượng lớn, theo dõi hành trình xe trên bản đồ và nhận thông báo tức thời.',
    keyFeatures: [
      'Quản lý sổ địa chỉ giao hàng đa điểm (Multiple Delivery Addresses).',
      'Theo dõi vị trí kiện hàng trực tiếp trên bản đồ số thời gian thực (Live GPS Tracking).',
      'Chủ động hủy đơn hợp lệ trước khi đơn hàng xuất kho (Tự động kích hoạt Release Stock).',
      'Hộp thư thông báo cập nhật trạng thái đơn qua sự kiện Kafka (Notification Inbox).',
    ],
    systemBenefits: [
      { label: 'Độ hài lòng khách hàng (CSAT)', value: '4.9 / 5.0' },
      { label: 'Thời gian tra cứu đơn', value: '< 1 giây' },
      { label: 'Minh bạch thông tin', value: 'Realtime 24/7' },
    ],
    targetAction: 'Trải Nghiệm Cổng Khách Hàng',
  },
];

export function RoleSolutionsTabs() {
  const [activeTab, setActiveTab] = useState<string>('operator');

  const selectedSolution = ROLE_SOLUTIONS.find((s) => s.id === activeTab) || ROLE_SOLUTIONS[0];

  return (
    <section id="solutions" className="role-solutions-section">
      <div className="section-container">
        <div className="section-header-centered">
          <span className="section-pill-tag">GIẢI PHÁP THEO VAI TRÒ THỰC TẾ</span>
          <h2 className="section-headline">
            Thiết Kế Chuyên Biệt Cho Từng Bộ Phận Vận Hành
          </h2>
          <p className="section-subtext">
            Phân định rõ quyền hạn và nghiệp vụ cho từng đối tượng tham gia chuỗi cung ứng,
            đảm bảo tính toàn vẹn dữ liệu và tối đa hóa năng suất lao động.
          </p>
        </div>

        {/* Role Tab Navigation Bar */}
        <div className="role-tabs-bar" role="tablist">
          {ROLE_SOLUTIONS.map((item) => {
            const isActive = item.id === activeTab;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                className={`role-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="tab-icon">{item.icon}</span>
                <span className="tab-text">{item.roleTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Solution Content Card */}
        <div className="role-content-display">
          <div className="role-info-col">
            <span className="role-kicker">{selectedSolution.roleTag}</span>
            <h3 className="role-heading">{selectedSolution.heading}</h3>
            <p className="role-summary">{selectedSolution.summary}</p>

            <div className="role-feature-list">
              {selectedSolution.keyFeatures.map((feat, idx) => (
                <div key={idx} className="role-feature-item">
                  <div className="check-badge">
                    <CheckOutlined />
                  </div>
                  <span className="feat-text">{feat}</span>
                </div>
              ))}
            </div>

            <div className="role-action-row">
              <Link to={paths.dashboard} className="btn-role-cta">
                {selectedSolution.targetAction}
              </Link>
              <div className="security-notice">
                <SafetyCertificateOutlined style={{ marginRight: '6px', color: '#2563eb' }} />
                <span>Kiểm soát phân quyền RBAC đa tầng</span>
              </div>
            </div>
          </div>

          {/* Metrics & Performance Sidebar */}
          <div className="role-metrics-col">
            <div className="metrics-box">
              <h4 className="metrics-box-title">Chỉ Số Hiệu Năng Vận Hành</h4>
              <div className="metrics-list">
                {selectedSolution.systemBenefits.map((metric, mIdx) => (
                  <div key={mIdx} className="metric-row">
                    <span className="metric-label">{metric.label}</span>
                    <span className="metric-val">{metric.value}</span>
                  </div>
                ))}
              </div>
              <div className="metrics-badge-footer">
                Được kiểm chứng qua mô phỏng chịu tải Concurrency Tests
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
