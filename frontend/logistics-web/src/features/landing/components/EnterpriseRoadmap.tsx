import { CheckCircleFilled, ClockCircleOutlined, RocketFilled } from '@ant-design/icons';

interface RoadmapItem {
  version: string;
  title: string;
  focus: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  keyDeliverables: string;
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    version: 'V0',
    title: 'Foundation & Infrastructure',
    focus: 'Khung Microservice',
    status: 'COMPLETED',
    keyDeliverables: 'Spring Cloud Gateway, Docker MySQL 8.4 nhiều database logic, Flyway migration, Correlation ID tracing.',
  },
  {
    version: 'V1',
    title: 'Core Ordering & Inventory',
    focus: 'Luồng Nghiệp Vụ Cốt Lõi',
    status: 'IN_PROGRESS',
    keyDeliverables: 'Quản lý Customer, Kho bãi, Tồn kho (Optimistic Lock BR-01), Tạo & xác nhận Order qua OpenFeign, Frontend React 19 UI.',
  },
  {
    version: 'V2',
    title: 'Delivery Management',
    focus: 'Điều Phối Giao Vận',
    status: 'PLANNED',
    keyDeliverables: 'Phân công tài xế khả dụng, quản lý phương tiện, Resilience4j Circuit Breaker cho giao tiếp nội bộ.',
  },
  {
    version: 'V3',
    title: 'Event-Driven & Kafka',
    focus: 'Xương Sống Sự Kiện',
    status: 'PLANNED',
    keyDeliverables: 'Kafka KRaft single broker, Notification Service consume sự kiện bất đồng bộ, bảo đảm Idempotent Consumer.',
  },
  {
    version: 'V4',
    title: 'Payment & Saga Orchestration',
    focus: 'Giao Dịch Phân Tán',
    status: 'PLANNED',
    keyDeliverables: 'Payment Service, xử lý chuỗi bù trừ (Compensation Saga) tự động nhả kho khi thanh toán thất bại.',
  },
  {
    version: 'V5 – V6',
    title: 'Outbox Pattern & Debezium CDC',
    focus: 'Toàn Vẹn Dữ Liệu',
    status: 'PLANNED',
    keyDeliverables: 'Bảng outbox_events trong local transaction, thay thế polling bằng Debezium bắt binlog MySQL đẩy vào Kafka.',
  },
  {
    version: 'V7 – V8',
    title: 'Redis Cache & Realtime Tracking',
    focus: 'Định Vị Tốc Độ Cao',
    status: 'PLANNED',
    keyDeliverables: 'Redis hot-data cho vị trí tài xế, WebSocket stream trực tiếp lên bản đồ, Redis Distributed Lock.',
  },
  {
    version: 'V9 – V12',
    title: 'Observability & Kubernetes',
    focus: 'Vận Hành Doanh Nghiệp',
    status: 'PLANNED',
    keyDeliverables: 'OpenSearch CQRS Read Model, OpenTelemetry tracing, Docker multi-stage & K8s/Helm deployment.',
  },
];

export function EnterpriseRoadmap() {
  return (
    <section id="roadmap" className="enterprise-roadmap-section">
      <div className="section-container">
        <div className="section-header-centered">
          <span className="section-pill-tag">LỘ TRÌNH PHÁT TRIỂN DÀI HẠN</span>
          <h2 className="section-headline">
            Tiến Trình Xây Dựng Từ V0 Đến V12
          </h2>
          <p className="section-subtext">
            Mỗi phiên bản kế thừa trực tiếp nền móng của phiên bản trước. Không xây dựng tạm bợ rồi đập đi làm lại.
          </p>
        </div>

        <div className="roadmap-grid">
          {ROADMAP_ITEMS.map((item, idx) => (
            <div key={idx} className={`roadmap-card status-${item.status.toLowerCase()}`}>
              <div className="roadmap-card-header">
                <div className="version-pill">
                  <span className="version-number">{item.version}</span>
                  <span className="version-focus">{item.focus}</span>
                </div>
                <div className="status-indicator-tag">
                  {item.status === 'COMPLETED' ? (
                    <span className="tag-completed">
                      <CheckCircleFilled style={{ marginRight: '4px' }} /> Đã xong V0
                    </span>
                  ) : item.status === 'IN_PROGRESS' ? (
                    <span className="tag-in-progress">
                      <RocketFilled style={{ marginRight: '4px' }} /> Đang triển khai
                    </span>
                  ) : (
                    <span className="tag-planned">
                      <ClockCircleOutlined style={{ marginRight: '4px' }} /> Kế hoạch
                    </span>
                  )}
                </div>
              </div>

              <h4 className="roadmap-item-title">{item.title}</h4>
              <p className="roadmap-item-deliverables">{item.keyDeliverables}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
