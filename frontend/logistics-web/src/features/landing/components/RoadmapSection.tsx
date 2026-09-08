import { CheckCircleFilled, ClockCircleOutlined, RocketOutlined } from '@ant-design/icons';

const ROADMAP_STEPS = [
  {
    version: 'V0',
    title: 'Microservice Foundation',
    status: 'completed',
    desc: 'Thiết lập Spring Cloud Gateway, JWT Auth skeleton, cấu trúc Monorepo, Docker MySQL logical databases.',
  },
  {
    version: 'V1',
    title: 'Core Ordering & Inventory',
    status: 'in-progress',
    desc: 'Quản lý khách hàng, kho bãi, tồn kho với Optimistic Lock, tạo đơn hàng qua REST/OpenFeign, giao diện React Core.',
  },
  {
    version: 'V2',
    title: 'Delivery Management',
    status: 'planned',
    desc: 'Điều phối tài xế, quản lý chuyến giao, tích hợp Resilience4j Circuit Breaker cho giao tiếp đồng bộ.',
  },
  {
    version: 'V3',
    title: 'Kafka Event-Driven & Notification',
    status: 'planned',
    desc: 'Xương sống sự kiện bất đồng bộ Kafka KRaft, dịch vụ thông báo (Notification Inbox), Idempotency Consumer.',
  },
  {
    version: 'V4',
    title: 'Payment & Saga Orchestration',
    status: 'planned',
    desc: 'Giao dịch phân tán bù trừ tự động (Saga pattern), thanh toán và tự động nhả tồn khi xảy ra lỗi.',
  },
  {
    version: 'V5 - V6',
    title: 'Transactional Outbox & CDC Debezium',
    status: 'planned',
    desc: 'Loại bỏ hoàn toàn rủi ro Dual-Write, bắt binlog trực tiếp từ MySQL đẩy vào Kafka streaming.',
  },
  {
    version: 'V7 - V8',
    title: 'Redis Cache & Realtime Tracking Map',
    status: 'planned',
    desc: 'Định vị GPS tài xế, WebSocket stream trực tiếp lên bản đồ, Redis Distributed Locks và Rate Limiting.',
  },
  {
    version: 'V9 - V12',
    title: 'Observability, K8s & Advanced',
    status: 'planned',
    desc: 'OpenSearch CQRS, OpenTelemetry tracing xuyên service, đóng gói Kubernetes Helm charts, CI/CD tự động.',
  },
];

export function RoadmapSection() {
  return (
    <section id="roadmap" className="roadmap-section">
      <div className="roadmap-container">
        <div className="section-header">
          <div className="section-subtitle">LỘ TRÌNH PHÁT TRIỂN DỰ ÁN</div>
          <h2 className="section-title">
            Tiến Trình Xây Dựng Từ <span className="gradient-text">V0 Đến V12</span>
          </h2>
          <p className="section-description">
            Kế hoạch kiến trúc bài bản theo tài liệu Master Blueprint, đảm bảo các công nghệ phân tán xuất hiện
            khi có nhu cầu nghiệp vụ thực tế.
          </p>
        </div>

        <div className="roadmap-timeline">
          {ROADMAP_STEPS.map((step, idx) => (
            <div key={idx} className={`roadmap-node ${step.status}`}>
              <div className="node-marker">
                {step.status === 'completed' ? (
                  <CheckCircleFilled className="marker-icon completed" />
                ) : step.status === 'in-progress' ? (
                  <RocketOutlined className="marker-icon in-progress" />
                ) : (
                  <ClockCircleOutlined className="marker-icon planned" />
                )}
              </div>

              <div className="node-card">
                <div className="node-header">
                  <span className="node-version">{step.version}</span>
                  <span className={`node-badge ${step.status}`}>
                    {step.status === 'completed'
                      ? 'Đã hoàn thành'
                      : step.status === 'in-progress'
                      ? 'Đang thực hiện'
                      : 'Kế hoạch tiếp theo'}
                  </span>
                </div>
                <h4 className="node-title">{step.title}</h4>
                <p className="node-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
