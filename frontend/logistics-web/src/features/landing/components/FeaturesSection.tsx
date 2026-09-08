import {
  AppstoreOutlined,
  CompassOutlined,
  DatabaseOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

const FEATURES = [
  {
    icon: <AppstoreOutlined />,
    title: 'Vòng Đời Đơn Hàng Chuẩn ACID',
    tag: 'Order Orchestration',
    description:
      'State machine nghiêm ngặt từ PENDING_STOCK, CONFIRMED đến COMPLETED. Lưu snapshot giá và sản phẩm tại thời điểm mua, sẵn sàng tích hợp Saga bù trừ phân tán.',
    highlight: 'ACID & Saga Transaction',
  },
  {
    icon: <DatabaseOutlined />,
    title: 'Kiểm Soát Tồn Kho & Chống Race Condition',
    tag: 'Optimistic Locking',
    description:
      'Quy tắc BR-01: Available = Quantity - Reserved. Cơ chế version locking triệt để loại bỏ tình trạng overselling khi nhiều khách hàng tranh mua sản phẩm cuối.',
    highlight: 'Zero Overselling Guarantee',
  },
  {
    icon: <CompassOutlined />,
    title: 'Điều Phối Giao Vận & Dispatching',
    tag: 'Fleet & Driver Ops',
    description:
      'Tự động phân công tài xế khả dụng, quản lý phương tiện và bảo đảm nguyên tắc 1 tài xế chỉ nhận 1 active trip tại một thời điểm theo đúng nghiệp vụ giao vận.',
    highlight: 'Optimized Dispatching',
  },
  {
    icon: <ThunderboltOutlined />,
    title: 'Định Vị Realtime & Cập Nhật Lộ Trình',
    tag: 'Live GPS & WebSocket',
    description:
      'Tích hợp bản đồ Leaflet / OpenStreetMap hiển thị trực quan các luồng di chuyển của tài xế. Hot data lưu trữ bộ đệm Redis tối ưu hiệu năng ghi dữ liệu.',
    highlight: 'Sub-second Latency',
  },
  {
    icon: <LockOutlined />,
    title: 'Transactional Outbox & CDC Debezium',
    tag: 'Event-Driven Backbone',
    description:
      'Khắc phục triệt để lỗi dual-write giữa Database và Kafka broker. Đảm bảo 100% sự kiện business được xuất bản tin cậy với cơ chế Idempotent Consumer.',
    highlight: 'At-Least-Once Delivery',
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Phân Quyền Đa Tầng Chuẩn RBAC',
    tag: 'Security & Access Control',
    description:
      'Mô hình bảo mật JWT phân quyền đa vai trò cho 7 nhóm Actor: ADMIN, OPERATOR, WAREHOUSE_STAFF, DELIVERY_MANAGER, DRIVER và CUSTOMER.',
    highlight: 'Enterprise Security',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="section-header">
          <div className="section-subtitle">NĂNG LỰC CỐT LÕI</div>
          <h2 className="section-title">
            Nền Tảng Vận Hành Mạnh Mẽ Được Thiết Kế Cho{' '}
            <span className="gradient-text">Quy Mô Lớn</span>
          </h2>
          <p className="section-description">
            Giải quyết triệt để các bài toán khó nhất trong ngành logistics từ quản trị đồng thời,
            giữ tồn kho tin cậy, đến điều phối và theo dõi phương tiện thời gian thực.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="card-top-row">
                <div className="feature-icon-box">{feature.icon}</div>
                <span className="feature-tag-chip">{feature.tag}</span>
              </div>

              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>

              <div className="feature-card-footer">
                <span className="feature-highlight-badge">{feature.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
