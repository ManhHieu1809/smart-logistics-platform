import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  UserOutlined,
} from '@ant-design/icons';

import type { OrderStatusHistory } from '../types/order.types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderStatusTimelineProps {
  history: OrderStatusHistory[];
}

export function OrderStatusTimeline({ history }: OrderStatusTimelineProps) {
  return (
    <div className="order-timeline-box">
      <h3 className="timeline-heading">Lịch Sử Trạng Thái Đơn Hàng (Audit Trail)</h3>
      <p className="timeline-subheading">
        Truy vết toàn diện tiến trình đơn hàng và hành động của các actor theo thời gian thực.
      </p>

      <div className="timeline-steps-list">
        {history.map((item, idx) => {
          const isLatest = idx === history.length - 1;
          const isCancelled = item.toStatus === 'CANCELLED';
          const isCompleted = item.toStatus === 'COMPLETED';

          const formattedTime = new Date(item.createdAt).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });

          return (
            <div
              key={item.id || idx}
              className={`timeline-item ${isLatest ? 'is-latest' : ''} ${
                isCancelled ? 'is-cancelled' : ''
              }`}
            >
              <div className="timeline-indicator-col">
                <div className="timeline-dot">
                  {isCancelled ? (
                    <CloseCircleFilled className="dot-icon icon-cancel" />
                  ) : isCompleted ? (
                    <CheckCircleFilled className="dot-icon icon-complete" />
                  ) : isLatest ? (
                    <ClockCircleFilled className="dot-icon icon-latest" />
                  ) : (
                    <ExclamationCircleFilled className="dot-icon icon-step" />
                  )}
                </div>
                {idx < history.length - 1 && <div className="timeline-stem" />}
              </div>

              <div className="timeline-card-col">
                <div className="timeline-header-row">
                  <div className="status-transition">
                    <OrderStatusBadge status={item.toStatus} />
                    {item.fromStatus && (
                      <span className="from-status-hint">
                        (chuyển từ <strong>{item.fromStatus}</strong>)
                      </span>
                    )}
                  </div>
                  <span className="timeline-time">{formattedTime}</span>
                </div>

                {item.reason && <p className="timeline-reason">{item.reason}</p>}

                <div className="timeline-actor-row">
                  <UserOutlined style={{ marginRight: '6px', color: '#64748b' }} />
                  <span className="actor-name">{item.updatedBy}</span>
                  <span className="actor-role-chip">{item.role}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
