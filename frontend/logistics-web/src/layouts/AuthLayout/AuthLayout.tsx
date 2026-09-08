import { ArrowLeftOutlined, CheckCircleFilled, SafetyCertificateOutlined, TruckOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';

import { paths } from '../../app/router/paths';

import styles from './AuthLayout.module.css';

export function AuthLayout() {
  return (
    <main className={styles.layout}>
      {/* Left Brand & Trust Section */}
      <section className={styles.brandSection}>
        <div className={styles.brandBgPattern} />

        <div className={styles.brandContent}>
          <Link to={paths.landing} className={styles.backToHomeLink}>
            <ArrowLeftOutlined />
            <span>Về trang chủ</span>
          </Link>

          <div className={styles.brandLogoRow}>
            <div className={styles.brandLogoBox}>
              <TruckOutlined />
            </div>
            <div>
              <span className={styles.brandKicker}>SMART LOGISTICS PLATFORM</span>
              <h2 className={styles.brandTitle}>Enterprise Operations</h2>
            </div>
          </div>

          <p className={styles.brandDescription}>
            Nền tảng điều phối chuỗi cung ứng, quản lý vòng đời đơn hàng và đội xe thời gian thực
            xây dựng trên kiến trúc Spring Boot Microservices và Kafka.
          </p>

          <div className={styles.trustPillars}>
            <div className={styles.pillarItem}>
              <CheckCircleFilled className={styles.pillarIcon} />
              <div>
                <strong className={styles.pillarTitle}>Cam Kết Đúng Hẹn 99.85% (SLA)</strong>
                <p className={styles.pillarDesc}>Điều phối tự động và theo dõi lộ trình xe liên tục.</p>
              </div>
            </div>

            <div className={styles.pillarItem}>
              <CheckCircleFilled className={styles.pillarIcon} />
              <div>
                <strong className={styles.pillarTitle}>Kiểm Soát Tồn Kho Optimistic Lock</strong>
                <p className={styles.pillarDesc}>Quy tắc BR-01 loại bỏ 100% nguy cơ bán vượt tồn.</p>
              </div>
            </div>

            <div className={styles.pillarItem}>
              <CheckCircleFilled className={styles.pillarIcon} />
              <div>
                <strong className={styles.pillarTitle}>Phân Quyền RBAC Đa Tầng</strong>
                <p className={styles.pillarDesc}>Bảo vệ dữ liệu phân tách nghiêm ngặt giữa các vai trò.</p>
              </div>
            </div>
          </div>

          <div className={styles.brandFooterNote}>
            <SafetyCertificateOutlined style={{ marginRight: '6px', color: '#60a5fa' }} />
            <span>Đạt chuẩn kiến trúc Master Blueprint v1.0 • Sẵn sàng vận hành 24/7</span>
          </div>
        </div>
      </section>

      {/* Right Content Form Section */}
      <section className={styles.contentSection}>
        <Outlet />
      </section>
    </main>
  );
}