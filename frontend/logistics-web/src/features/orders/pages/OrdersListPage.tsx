import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, message, Modal, Select, Space, Table, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { paths } from '../../../app/router/paths';
import { OrderCancelModal } from '../components/OrderCancelModal';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { OrdersStatusCards } from '../components/OrdersStatusCards';
import { useOrderStore } from '../store/order.store';
import type { Order, OrderStatus } from '../types/order.types';
import '../styles/orders.css';

const { Title, Text } = Typography;

export function OrdersListPage() {
  const navigate = useNavigate();
  const orders = useOrderStore((state) => state.orders);
  const confirmOrder = useOrderStore((state) => state.confirmOrder);
  const cancelOrder = useOrderStore((state) => state.cancelOrder);

  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [targetOrderForCancel, setTargetOrderForCancel] = useState<Order | null>(null);

  // Filter orders by status & search keyword
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === 'ALL'
          ? true
          : selectedStatus === 'PENDING_STOCK'
          ? order.status === 'PENDING_STOCK' || order.status === 'CREATED'
          : selectedStatus === 'CONFIRMED'
          ? order.status === 'CONFIRMED' || order.status === 'READY_FOR_DELIVERY'
          : order.status === selectedStatus;

      const keyword = searchText.toLowerCase().trim();
      const matchesSearch =
        !keyword ||
        order.code.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword) ||
        order.customerPhone.toLowerCase().includes(keyword) ||
        order.warehouseName.toLowerCase().includes(keyword) ||
        order.shippingAddress.toLowerCase().includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [orders, selectedStatus, searchText]);

  const handleConfirm = (order: Order) => {
    Modal.confirm({
      title: `Xác nhận đơn hàng ${order.code}?`,
      content:
        'Hệ thống sẽ cập nhật trạng thái sang "CONFIRMED" và chuyển tiếp đơn hàng sang trung tâm kho vận.',
      okText: 'Xác Nhận Ngay',
      cancelText: 'Hủy',
      onOk: () => {
        const success = confirmOrder(order.id);
        if (success) {
          message.success(`Đã duyệt xác nhận đơn hàng ${order.code} thành công.`);
        } else {
          message.error('Không thể xác nhận đơn hàng ở trạng thái hiện tại.');
        }
      },
    });
  };

  const handleOpenCancelModal = (order: Order) => {
    if (order.status === 'COMPLETED') {
      message.error('Quy tắc BR-04: Đơn hàng đã hoàn tất thành công, nghiêm cấm thao tác hủy!');
      return;
    }
    setTargetOrderForCancel(order);
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = (reason: string) => {
    if (!targetOrderForCancel) return;
    const success = cancelOrder(targetOrderForCancel.id, reason);
    if (success) {
      message.success(
        `Đã hủy đơn ${targetOrderForCancel.code}. Hệ thống tự động giải phóng tồn kho (BR-05).`
      );
    } else {
      message.error('Không thể hủy đơn hàng này.');
    }
    setCancelModalVisible(false);
    setTargetOrderForCancel(null);
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      render: (code: string, record) => (
        <Link
          to={`/orders/${record.id}`}
          style={{ fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}
        >
          {code}
        </Link>
      ),
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 220,
      render: (name: string, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.customerPhone}
          </Text>
        </div>
      ),
    },
    {
      title: 'Kho Xuất Hàng',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 200,
      ellipsis: true,
      render: (wh: string) => <span style={{ color: '#334155' }}>{wh}</span>,
    },
    {
      title: 'Số Mặt Hàng',
      key: 'itemsCount',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <span
          style={{
            background: '#f1f5f9',
            padding: '2px 8px',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 12,
          }}
        >
          {record.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
        </span>
      ),
    },
    {
      title: 'Tổng Giá Trị',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 160,
      align: 'right',
      render: (val: number) => (
        <span style={{ fontWeight: 700, color: '#0f172a' }}>
          {val.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Trạng Thái Đơn',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: OrderStatus) => <OrderStatusBadge status={status} />,
    },
    {
      title: 'Ngày Tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (dt: string) => {
        const d = new Date(dt);
        return (
          <span style={{ fontSize: 13, color: '#64748b' }}>
            {d.toLocaleDateString('vi-VN')} {d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        );
      },
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 130,
      fixed: 'right',
      render: (_, record) => {
        const canConfirm = record.status === 'PENDING_STOCK' || record.status === 'CREATED';
        const canCancel = record.status !== 'COMPLETED' && record.status !== 'CANCELLED';

        return (
          <Space orientation="horizontal" size={6}>
            <Tooltip title="Xem Chi Tiết">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/orders/${record.id}`)}
              />
            </Tooltip>

            {canConfirm && (
              <Tooltip title="Duyệt Xác Nhận Đơn">
                <Button
                  type="text"
                  size="small"
                  style={{ color: '#16a34a' }}
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleConfirm(record)}
                />
              </Tooltip>
            )}

            {canCancel && (
              <Tooltip title="Hủy Đơn Hàng (BR-05)">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleOpenCancelModal(record)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="orders-page-container">
      {/* Header Banner */}
      <div className="orders-header-row">
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Quản Lý Đơn Hàng (Orders)
          </Title>
          <Text style={{ color: '#64748b', fontSize: 14 }}>
            Theo dõi vòng đời xử lý đơn hàng, điều phối giữ tồn kho và kiểm soát quy tắc nghiệp vụ theo thời gian thực.
          </Text>
        </div>

        <Space>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate(paths.orders.create)}
            style={{ fontWeight: 600, height: 44, borderRadius: 8 }}
          >
            Tạo Đơn Hàng Mới
          </Button>
        </Space>
      </div>

      {/* KPI Status Filter Cards */}
      <OrdersStatusCards
        orders={orders}
        activeStatusFilter={selectedStatus}
        onSelectFilter={(status) => setSelectedStatus(status)}
      />

      {/* Search & Filter Toolbars */}
      <Card
        className="orders-filter-bar-card"
        styles={{ body: { padding: '18px 24px' } }}
        style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, flex: 1, minWidth: 280 }}>
            <Input
              placeholder="Tìm theo mã đơn (ORD-...), tên khách, SĐT, kho..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ maxWidth: 360, borderRadius: 8 }}
            />

            <Select
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              style={{ width: 190 }}
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                { value: 'PENDING_STOCK', label: 'Chờ Giữ Tồn Kho' },
                { value: 'CONFIRMED', label: 'Đã Xác Nhận' },
                { value: 'DELIVERING', label: 'Đang Giao Hàng' },
                { value: 'COMPLETED', label: 'Đã Hoàn Tất' },
                { value: 'CANCELLED', label: 'Đã Hủy' },
              ]}
            />
          </div>

          <div style={{ fontSize: 13, color: '#64748b' }}>
            Hiển thị <strong style={{ color: '#0f172a' }}>{filteredOrders.length}</strong> / {orders.length} đơn hàng
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card
        styles={{ body: { padding: 0 } }}
        style={{ borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}
      >
        <Table<Order>
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* Cancel Order Modal */}
      {targetOrderForCancel && (
        <OrderCancelModal
          visible={cancelModalVisible}
          orderCode={targetOrderForCancel.code}
          onConfirm={handleConfirmCancel}
          onCancel={() => {
            setCancelModalVisible(false);
            setTargetOrderForCancel(null);
          }}
        />
      )}
    </div>
  );
}
