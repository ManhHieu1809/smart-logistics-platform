import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  InboxOutlined,
  TruckOutlined,
} from '@ant-design/icons';

import type { Order, OrderStatus } from '../types/order.types';

interface OrdersStatusCardsProps {
  orders: Order[];
  activeStatusFilter: OrderStatus | 'ALL';
  onSelectFilter: (status: OrderStatus | 'ALL') => void;
}

export function OrdersStatusCards({
  orders,
  activeStatusFilter,
  onSelectFilter,
}: OrdersStatusCardsProps) {
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING_STOCK' || o.status === 'CREATED').length,
    confirmed: orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'READY_FOR_DELIVERY').length,
    delivering: orders.filter((o) => o.status === 'DELIVERING').length,
    completed: orders.filter((o) => o.status === 'COMPLETED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  };

  const cards = [
    {
      key: 'ALL' as const,
      label: 'Tất Cả Đơn Hàng',
      count: counts.all,
      icon: <InboxOutlined />,
      colorClass: 'card-all',
    },
    {
      key: 'PENDING_STOCK' as const,
      label: 'Chờ Giữ Tồn Kho',
      count: counts.pending,
      icon: <ClockCircleOutlined />,
      colorClass: 'card-pending',
    },
    {
      key: 'CONFIRMED' as const,
      label: 'Đã Xác Nhận Đơn',
      count: counts.confirmed,
      icon: <FileDoneOutlined />,
      colorClass: 'card-confirmed',
    },
    {
      key: 'DELIVERING' as const,
      label: 'Đang Vận Chuyển',
      count: counts.delivering,
      icon: <TruckOutlined />,
      colorClass: 'card-delivering',
    },
    {
      key: 'COMPLETED' as const,
      label: 'Đã Hoàn Tất',
      count: counts.completed,
      icon: <CheckCircleOutlined />,
      colorClass: 'card-completed',
    },
    {
      key: 'CANCELLED' as const,
      label: 'Đã Hủy Đơn',
      count: counts.cancelled,
      icon: <CloseCircleOutlined />,
      colorClass: 'card-cancelled',
    },
  ];

  return (
    <div className="orders-status-cards-grid">
      {cards.map((card) => {
        const isActive = activeStatusFilter === card.key;
        return (
          <button
            key={card.key}
            type="button"
            className={`status-summary-card ${card.colorClass} ${isActive ? 'active' : ''}`}
            onClick={() => onSelectFilter(card.key)}
          >
            <div className="summary-card-top">
              <span className="summary-label">{card.label}</span>
              <span className="summary-icon">{card.icon}</span>
            </div>
            <div className="summary-count">{card.count}</div>
          </button>
        );
      })}
    </div>
  );
}
