import {
  ApartmentOutlined,
  CloudServerOutlined,
  DesktopOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons';

const STACK_GROUPS = [
  {
    title: 'Giao Diện Người Dùng (Frontend)',
    icon: <DesktopOutlined />,
    technologies: [
      { name: 'React 19 & TypeScript', desc: 'Kiến trúc feature-based mô đun hóa cao' },
      { name: 'Ant Design & Lucide', desc: 'Hệ thống component UI chuẩn doanh nghiệp' },
      { name: 'Three.js & GSAP', desc: 'Không gian 3D tương tác và hoạt họa mượt mà' },
      { name: 'Leaflet & OpenStreetMap', desc: 'Bản đồ định vị và lộ trình trực quan' },
    ],
  },
  {
    title: 'Hệ Thống Microservices (Backend)',
    icon: <CloudServerOutlined />,
    technologies: [
      { name: 'Spring Cloud Gateway', desc: 'Entrypoint định tuyến, bảo mật và rate limit' },
      { name: 'Spring Boot 3.x & Java 21', desc: 'Domain-Driven Design & Bounded Contexts' },
      { name: 'Spring Security & JWT', desc: 'Xác thực đa tầng và phân quyền RBAC' },
      { name: 'OpenFeign & Resilience4j', desc: 'Giao tiếp đồng bộ kèm Circuit Breaker' },
    ],
  },
  {
    title: 'Hạ Tầng Sự Kiện & Dữ Liệu (Event & Data)',
    icon: <NodeIndexOutlined />,
    technologies: [
      { name: 'Apache Kafka & KRaft', desc: 'Xương sống xử lý sự kiện bất đồng bộ' },
      { name: 'Transactional Outbox & CDC', desc: 'Debezium loại bỏ hoàn toàn dual-write lỗi' },
      { name: 'MySQL 8.4 Isolation', desc: 'Database per service, không foreign key chéo' },
      { name: 'Redis Distributed Cache', desc: 'Bộ đệm tốc độ cao và Distributed Lock' },
    ],
  },
  {
    title: 'Lộ Trình Tiến Hóa V0 – V12',
    icon: <ApartmentOutlined />,
    technologies: [
      { name: 'V0-V1: Core Foundation', desc: 'Gateway, Auth, Customer, Inventory, Order' },
      { name: 'V2-V4: Delivery & Saga', desc: 'Quản lý tài xế, thanh toán và bù trừ' },
      { name: 'V5-V8: Outbox, CDC & Tracking', desc: 'Định vị GPS realtime với WebSocket' },
      { name: 'V9-V12: Observability & K8s', desc: 'OpenTelemetry, Prometheus, Grafana, Helm' },
    ],
  },
];

export function TechStackSection() {
  return (
    <section id="architecture" className="tech-section">
      <div className="tech-container">
        <div className="section-header">
          <div className="section-subtitle">KIẾN TRÚC HỆ THỐNG</div>
          <h2 className="section-title">
            Xây Dựng Trên Nền Tảng Công Nghệ{' '}
            <span className="gradient-text">Chuẩn Doanh Nghiệp</span>
          </h2>
          <p className="section-description">
            Được thiết kế tỉ mỉ theo tiêu chuẩn phân tán hiện đại, đảm bảo tính độc lập giữa các service,
            khả năng mở rộng linh hoạt và độ tin cậy tuyệt đối.
          </p>
        </div>

        <div className="tech-grid">
          {STACK_GROUPS.map((group, idx) => (
            <div key={idx} className="tech-card">
              <div className="tech-card-header">
                <div className="tech-card-icon">{group.icon}</div>
                <h3 className="tech-card-title">{group.title}</h3>
              </div>

              <div className="tech-list">
                {group.technologies.map((tech, tIdx) => (
                  <div key={tIdx} className="tech-item">
                    <div className="tech-bullet" />
                    <div className="tech-info">
                      <span className="tech-name">{tech.name}</span>
                      <span className="tech-desc">{tech.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
