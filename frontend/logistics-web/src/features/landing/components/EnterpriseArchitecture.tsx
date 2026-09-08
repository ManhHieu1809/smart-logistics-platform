import {
  ApartmentOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  LockOutlined,
  NodeIndexOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';

const ARCHITECTURE_PILLARS = [
  {
    icon: <DatabaseOutlined />,
    title: 'Database Per Service Isolation',
    tag: 'NGUYÊN TẮC BẤT BIẾN',
    description:
      'Mỗi microservice sở hữu schema và cơ sở dữ liệu logic riêng biệt (logistics_identity, logistics_customer, logistics_inventory, logistics_order, logistics_delivery). Tuyệt đối không tạo Foreign Key xuyên database.',
    metric: '100% Boundary Isolation',
  },
  {
    icon: <LockOutlined />,
    title: 'Kiểm Soát Tồn Kho & Optimistic Lock',
    tag: 'QUY TẮC BR-01',
    description:
      'Công thức chuẩn: Available = Quantity - Reserved. Cơ chế Version Lock tại tầng JPA/MySQL bảo đảm khi nhiều đơn hàng cùng tranh mua sản phẩm cuối chỉ đúng 1 giao dịch được xác nhận.',
    metric: 'Zero Overselling Guarantee',
  },
  {
    icon: <NodeIndexOutlined />,
    title: 'Transactional Outbox & CDC Debezium',
    tag: 'CHỐNG LỖI DUAL-WRITE',
    description:
      'Lưu trữ trạng thái nghiệp vụ và bản ghi outbox_events trong cùng 1 local transaction. Kafka Connect / Debezium đọc binlog phát tán sự kiện tin cậy tuyệt đối với Idempotency Consumer.',
    metric: 'At-Least-Once Delivery',
  },
  {
    icon: <CloudServerOutlined />,
    title: 'Giao Tiếp Đồng Bộ Kèm Resilience4j',
    tag: 'CIRCUIT BREAKER',
    description:
      'Sử dụng OpenFeign cho các truy vấn tức thời, trang bị Circuit Breaker, Timeout và Retry có kiểm soát để chống hiện tượng nghẽn dây chuyền (Cascading Failure) khi downstream gặp sự cố.',
    metric: 'Fault-Tolerant Microservices',
  },
  {
    icon: <ApartmentOutlined />,
    title: 'Định Vị Hot-Data với Redis & WebSocket',
    tag: 'REALTIME STREAMING',
    description:
      'Tọa độ GPS từ tài xế được đệm trực tiếp vào Redis In-Memory và truyền tải về trình duyệt qua WebSocket, giảm tải 90% áp lực ghi điểm định vị vào MySQL transactional.',
    metric: 'Sub-second Position Sync',
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Bảo Mật Phân Quyền Đa Tầng RBAC',
    tag: 'SECURITY ARCHITECTURE',
    description:
      'Spring Security + JWT access token ngắn hạn kết hợp Refresh Token Rotation. Kiểm soát quyền theo vai trò (ADMIN, OPERATOR, DRIVER, WAREHOUSE_STAFF) và bảo vệ dữ liệu thuộc sở hữu người dùng.',
    metric: 'Granular Access Control',
  },
];

export function EnterpriseArchitecture() {
  return (
    <section id="architecture" className="enterprise-architecture-section">
      <div className="section-container">
        <div className="section-header-centered">
          <span className="section-pill-tag">NỀN TẢNG KỸ THUẬT VỮNG CHẮC</span>
          <h2 className="section-headline">
            Kiến Trúc Phân Tán Giải Quyết Đúng Nhu Cầu Thực Tế
          </h2>
          <p className="section-subtext">
            Mọi công nghệ (Spring Cloud, Kafka, Redis, Debezium, Outbox) được áp dụng vì có bài toán nghiệp vụ rõ ràng,
            không đưa vào chỉ để làm từ khóa trang trí.
          </p>
        </div>

        <div className="architecture-grid">
          {ARCHITECTURE_PILLARS.map((pillar, idx) => (
            <div key={idx} className="architecture-card">
              <div className="arch-card-top">
                <div className="arch-icon-wrapper">{pillar.icon}</div>
                <span className="arch-tag-pill">{pillar.tag}</span>
              </div>

              <h3 className="arch-title">{pillar.title}</h3>
              <p className="arch-desc">{pillar.description}</p>

              <div className="arch-card-footer">
                <span className="arch-metric-text">{pillar.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
