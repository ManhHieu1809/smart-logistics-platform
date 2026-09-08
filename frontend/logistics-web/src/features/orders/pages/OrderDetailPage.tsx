import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
  TruckOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Result,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { paths } from '../../../app/router/paths';
import { OrderCancelModal } from '../components/OrderCancelModal';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';
import { useOrderStore } from '../store/order.store';
import type { OrderItem } from '../types/order.types';
import '../styles/orders.css';

const { Title, Text } = Typography;

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getOrderById = useOrderStore((state) => state.getOrderById);
  const confirmOrder = useOrderStore((state) => state.confirmOrder);
  const dispatchOrder = useOrderStore((state) => state.dispatchOrder);
  const completeOrder = useOrderStore((state) => state.completeOrder);
  const cancelOrder = useOrderStore((state) => state.cancelOrder);

  const order = getOrderById(id || '');

  // Dispatch modal state
  const [dispatchModalVisible, setDispatchModalVisible] = useState(false);
  const [dispatchForm] = Form.useForm();

  // Cancel modal state
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  if (!order) {
    return (
      <div className="orders-page-container">
        <Result
          status="404"
          title="Không tìm thấy đơn hàng"
          subTitle={`Mã đơn hoặc định danh "${id}" không tồn tại trên hệ thống quản trị.`}
          extra={
            <Button type="primary" onClick={() => navigate(paths.orders.root)}>
              Quay lại danh sách đơn hàng
            </Button>
          }
        />
      </div>
    );
  }

  // Action handlers
  const handleConfirm = () => {
    Modal.confirm({
      title: `Xác nhận phê duyệt đơn hàng ${order.code}?`,
      content:
        'Hệ thống sẽ chuyển trạng thái sang "CONFIRMED", hoàn tất chốt tồn kho giữ trước và gửi chỉ thị xuất kho.',
      okText: 'Xác Nhận Ngay',
      cancelText: 'Quay lại',
      onOk: () => {
        const success = confirmOrder(order.id);
        if (success) {
          message.success(`Đã phê duyệt đơn hàng ${order.code} thành công.`);
        }
      },
    });
  };

  const handleOpenDispatch = () => {
    dispatchForm.setFieldsValue({
      driverName: 'Trần Văn Mạnh',
      vehiclePlate: '29C-884.21 (Xe Tải 5 Tấn)',
    });
    setDispatchModalVisible(true);
  };

  const handleConfirmDispatch = async () => {
    try {
      const values = await dispatchForm.validateFields();
      const success = dispatchOrder(order.id, values.driverName, values.vehiclePlate);
      if (success) {
        message.success(`Đã bàn giao đơn ${order.code} cho tài xế ${values.driverName}!`);
        setDispatchModalVisible(false);
      }
    } catch {
      // validation failed
    }
  };

  const handleComplete = () => {
    Modal.confirm({
      title: `Xác nhận hoàn tất đơn hàng ${order.code}?`,
      content:
        'Xác nhận khách hàng đã ký nhận biên bản bàn giao điện tử (e-POD). Lưu ý: Sau khi hoàn tất, đơn hàng sẽ tuân thủ BR-04 (CẤM HỦY).',
      okText: 'Hoàn Tất Đơn Hàng',
      okButtonProps: { style: { background: '#16a34a' } },
      cancelText: 'Quay lại',
      onOk: () => {
        const success = completeOrder(order.id);
        if (success) {
          message.success(`Đơn hàng ${order.code} đã hoàn tất thành công (BR-04 cấm hủy áp dụng)!`);
        }
      },
    });
  };

  const handleOpenCancel = () => {
    if (order.status === 'COMPLETED') {
      message.error('Quy tắc BR-04: Đơn hàng đã hoàn tất thành công, không thể hủy!');
      return;
    }
    setCancelModalVisible(true);
  };

  const handleConfirmCancel = (reason: string) => {
    const success = cancelOrder(order.id, reason);
    if (success) {
      message.success(
        `Đã hủy đơn ${order.code}. Hệ thống tự động giải phóng tồn kho đã giữ (BR-05).`
      );
      setCancelModalVisible(false);
    }
  };

  const itemColumns: ColumnsType<OrderItem> = [
    {
      title: 'Mặt Hàng & Snapshot Mã SKU (BR-03)',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            SKU Snapshot: <strong style={{ color: '#2563eb' }}>{record.sku}</strong>
          </Text>
        </div>
      ),
    },
    {
      title: 'Đơn Giá Lưu Giữ (Snapshot)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 180,
      align: 'right',
      render: (val: number) => (
        <span style={{ fontWeight: 600 }}>{val.toLocaleString('vi-VN')} đ</span>
      ),
    },
    {
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 110,
      align: 'center',
      render: (qty: number) => (
        <span
          style={{
            background: '#f1f5f9',
            padding: '2px 8px',
            borderRadius: 6,
            fontWeight: 700,
          }}
        >
          {qty}
        </span>
      ),
    },
    {
      title: 'Thành Tiền',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: 180,
      align: 'right',
      render: (val: number) => (
        <span style={{ fontWeight: 700, color: '#0f172a' }}>
          {val.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
  ];

  const canConfirm = order.status === 'PENDING_STOCK' || order.status === 'CREATED';
  const canDispatch = order.status === 'CONFIRMED' || order.status === 'READY_FOR_DELIVERY';
  const canComplete = order.status === 'DELIVERING';
  const canCancel = order.status !== 'COMPLETED' && order.status !== 'CANCELLED';

  return (
    <div className="orders-page-container">
      {/* Top Navigation & Action Header */}
      <div className="orders-header-row">
        <div className="orders-header-left">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(paths.orders.root)}
            style={{ borderRadius: 8, height: 40 }}
          >
            Danh Sách Đơn
          </Button>

          <div className="orders-header-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {order.code}
              </Title>
              <OrderStatusBadge status={order.status} />
              {order.status === 'COMPLETED' && (
                <Tag color="success" icon={<SafetyCertificateOutlined />} style={{ padding: '2px 8px', borderRadius: 6 }}>
                  BR-04: Đã Khóa Bất Biến
                </Tag>
              )}
            </div>
            <Text style={{ color: '#64748b', fontSize: 13, marginTop: 4, display: 'block' }}>
              Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')} • Kho xuất:{' '}
              <strong style={{ color: '#334155' }}>{order.warehouseName}</strong>
            </Text>
          </div>
        </div>

        {/* Action Controls */}
        <Space wrap size={10}>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()} style={{ height: 38, borderRadius: 8 }}>
            In Phiếu Đơn Hàng
          </Button>

          {canConfirm && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleConfirm}
              style={{ background: '#2563eb', height: 38, borderRadius: 8, fontWeight: 600 }}
            >
              Duyệt Xác Nhận Đơn
            </Button>
          )}

          {canDispatch && (
            <Button
              type="primary"
              icon={<TruckOutlined />}
              onClick={handleOpenDispatch}
              style={{ background: '#ea580c', borderColor: '#ea580c', height: 38, borderRadius: 8, fontWeight: 600 }}
            >
              Bàn Giao Vận Chuyển
            </Button>
          )}

          {canComplete && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleComplete}
              style={{ background: '#16a34a', borderColor: '#16a34a', height: 38, borderRadius: 8, fontWeight: 600 }}
            >
              Ký Nhận e-POD & Hoàn Tất
            </Button>
          )}

          {canCancel ? (
            <Button danger icon={<CloseCircleOutlined />} onClick={handleOpenCancel} style={{ height: 38, borderRadius: 8 }}>
              Hủy Đơn Hàng (BR-05)
            </Button>
          ) : order.status === 'COMPLETED' ? (
            <Button disabled danger style={{ height: 38, borderRadius: 8 }}>
              Cấm Hủy (Quy tắc BR-04)
            </Button>
          ) : null}
        </Space>
      </div>

      {order.status === 'COMPLETED' && (
        <Alert
          message="Đơn hàng đã hoàn tất thành công (COMPLETED)"
          description="Khách hàng đã nhận hàng và ký nhận bàn giao. Theo quy tắc nghiệp vụ BR-04, đơn hàng hoàn tất không được phép hủy bỏ để đảm bảo tính toàn vẹn chứng từ tài chính và tồn kho."
          type="success"
          showIcon
          style={{ marginBottom: 24, borderRadius: 10 }}
        />
      )}

      {order.status === 'CANCELLED' && (
        <Alert
          message="Đơn hàng đã bị hủy bỏ (CANCELLED)"
          description="Toàn bộ tồn kho đã giữ (Reserved Stock) của đơn hàng này đã được tự động giải phóng hoàn trả về kho xuất hàng theo quy tắc nghiệp vụ BR-05."
          type="error"
          showIcon
          style={{ marginBottom: 24, borderRadius: 10 }}
        />
      )}

      <Row gutter={[24, 24]}>
        {/* Left Column: Order Items & Customer Details */}
        <Col xs={24} lg={15}>
          {/* Items Snapshot Card */}
          <Card
            title={<span style={{ fontWeight: 700, fontSize: 16 }}>Chi Tiết Mặt Hàng (Đóng Băng Snapshot BR-03)</span>}
            style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}
            styles={{ body: { padding: '20px 24px 24px' } }}
          >
            <Table<OrderItem>
              columns={itemColumns}
              dataSource={order.items}
              rowKey="id"
              pagination={false}
              scroll={{ x: 600 }}
            />

            {/* Financial Summary */}
            <div className="order-financial-summary-card">
              <div className="financial-row">
                <span>Tổng tiền hàng:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                  {order.subtotal.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="financial-row">
                <span>Cước phí vận chuyển:</span>
                <span style={{ fontWeight: 600, color: order.shippingFee === 0 ? '#16a34a' : '#0f172a' }}>
                  {order.shippingFee === 0 ? 'Miễn phí' : `${order.shippingFee.toLocaleString('vi-VN')} đ`}
                </span>
              </div>

              <div className="financial-row">
                <span>Thuế GTGT (VAT 10%):</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                  {order.tax.toLocaleString('vi-VN')} đ
                </span>
              </div>

              <div className="financial-row total-row">
                <span>Tổng Cộng:</span>
                <span className="total-price">
                  {order.totalAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>
          </Card>

          {/* Customer & Destination Information */}
          <Card
            title={<span style={{ fontWeight: 700, fontSize: 16 }}>Thông Tin Người Nhận & Địa Điểm Giao Hàng</span>}
            style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}
            styles={{ body: { padding: '20px 24px' } }}
          >
            <Descriptions column={{ xs: 1, sm: 2 }} bordered size="middle">
              <Descriptions.Item label="Khách Hàng / Đơn Vị">
                <Space>
                  <UserOutlined style={{ color: '#2563eb' }} />
                  <strong>{order.customerName}</strong>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Điện Thoại Liên Hệ">
                <Space>
                  <PhoneOutlined style={{ color: '#16a34a' }} />
                  <span>{order.customerPhone}</span>
                </Space>
              </Descriptions.Item>

              {order.customerEmail && (
                <Descriptions.Item label="Email Đặt Hàng">
                  <Space>
                    <MailOutlined style={{ color: '#64748b' }} />
                    <span>{order.customerEmail}</span>
                  </Space>
                </Descriptions.Item>
              )}

              <Descriptions.Item label="Phương Thức Thanh Toán">
                <Tag color={order.paymentStatus === 'PAID' ? 'success' : 'orange'}>
                  {order.paymentMethod} ({order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'})
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Địa Chỉ Giao Hàng" span={2}>
                <Space align="start">
                  <EnvironmentOutlined style={{ color: '#ea580c', marginTop: 4 }} />
                  <span>{order.shippingAddress}</span>
                </Space>
              </Descriptions.Item>

              {order.notes && (
                <Descriptions.Item label="Ghi Chú Đơn Hàng" span={2}>
                  <Text type="secondary">{order.notes}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Transportation / Driver Card if dispatched */}
          {order.driverName && (
            <Card
              title={<span style={{ fontWeight: 700, fontSize: 16 }}>Thông Tin Đội Xe & Điều Phối Vận Tải</span>}
              style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
              styles={{ body: { padding: '20px 24px' } }}
            >
              <Descriptions column={{ xs: 1, sm: 2 }} bordered size="middle">
                <Descriptions.Item label="Tài Xế Phụ Trách">
                  <strong>{order.driverName}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Phương Tiện / Biển Số">
                  <Tag color="blue">{order.vehiclePlate}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Col>

        {/* Right Column: Order Status Audit Trail Timeline */}
        <Col xs={24} lg={9}>
          <OrderStatusTimeline history={order.statusHistory} />
        </Col>
      </Row>

      {/* Dispatch Modal */}
      <Modal
        title={`Bàn Giao Vận Chuyển: ${order.code}`}
        open={dispatchModalVisible}
        onOk={handleConfirmDispatch}
        onCancel={() => setDispatchModalVisible(false)}
        okText="Bắt Đầu Giao Hàng"
        cancelText="Hủy"
      >
        <Form form={dispatchForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="driverName"
            label="Họ Tên Tài Xế"
            rules={[{ required: true, message: 'Vui lòng nhập tên tài xế!' }]}
          >
            <Input placeholder="Ví dụ: Trần Văn Mạnh" />
          </Form.Item>

          <Form.Item
            name="vehiclePlate"
            label="Biển Số Xe / Loại Xe"
            rules={[{ required: true, message: 'Vui lòng nhập biển số xe!' }]}
          >
            <Input placeholder="Ví dụ: 29C-884.21 (Xe Tải 5 Tấn)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Cancel Modal */}
      <OrderCancelModal
        visible={cancelModalVisible}
        orderCode={order.code}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelModalVisible(false)}
      />
    </div>
  );
}
