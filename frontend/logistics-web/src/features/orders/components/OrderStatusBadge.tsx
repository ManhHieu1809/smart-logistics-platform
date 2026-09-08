import { Tag } from 'antd';

import type { OrderStatus } from '../types/order.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'middle';
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  switch (status) {
    case 'PENDING_STOCK':
      return (
        <Tag color="orange" style={{ fontWeight: 600, borderRadius: 6, margin: 0 }}>
          Chờ Giữ Tồn Kho
        </Tag>
      );
    case 'STOCK_RESERVED':
      return (
        <Tag color="cyan" style={{ fontWeight: 600, borderRadius: 6, margin: 0 }}>
          Đã Giữ Tồn (Reserved)
        </Tag>
      );
    case 'CONFIRMED':
      return (
        <Tag color="blue" style={{ fontWeight: 600, borderRadius: 6, margin: 0 }}>
          Đã Xác Nhận Đơn
        </Tag>
      );
    case 'READY_FOR_DELIVERY':
      return (
        <Tag color="geekblue" style={{ fontWeight: 600, borderRadius: 6, margin: 0 }}>
          Sẵn Sàng Giao Hàng
        </Tag>
      );
    case 'DELIVERING':
      return (
        <Tag color="purple" style={{ fontWeight: 600, borderRadius: 6, margin: 0 }}>
          Đang Giao Hàng
        </Tag>
      );
    case 'COMPLETED':
      return (
        <Tag color="success" style={{ fontWeight: 600, borderRadius: 6, margin: 0 }}>
          Đã Hoàn Tất
        </Tag>
      );
    case 'CANCELLED':
      return (
        <Tag color="error" style={{ fontWeight: 600, borderRadius: 6, margin: 0 }}>
          Đã Hủy
        </Tag>
      );
    case 'OUT_OF_STOCK':
      return (
        <Tag color="red" style={{ fontWeight: 600, borderRadius: 6, margin: 0 }}>
          Hết Tồn Kho
        </Tag>
      );
    case 'CREATED':
    default:
      return (
        <Tag color="default" style={{ fontWeight: 600, borderRadius: 6, margin: 0 }}>
          Mới Khởi Tạo
        </Tag>
      );
  }
}
