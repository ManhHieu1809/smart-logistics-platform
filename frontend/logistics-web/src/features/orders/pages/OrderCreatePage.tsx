import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Table,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { paths } from '../../../app/router/paths';
import { MOCK_CUSTOMERS, MOCK_PRODUCTS, MOCK_WAREHOUSES } from '../mock/orders.mock';
import { useOrderStore } from '../store/order.store';
import type { PaymentMethod, ProductInventoryOption } from '../types/order.types';
import '../styles/orders.css';

const { Title, Text } = Typography;

interface SelectedProductRow {
  key: string;
  product: ProductInventoryOption;
  quantity: number;
}

export function OrderCreatePage() {
  const navigate = useNavigate();
  const createOrder = useOrderStore((state) => state.createOrder);

  const [form] = Form.useForm();
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('WH-HCM-01');
  const [selectedItems, setSelectedItems] = useState<SelectedProductRow[]>([
    {
      key: 'item-1',
      product: MOCK_PRODUCTS[0], // SRV-DELL-R750
      quantity: 1,
    },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [notes, setNotes] = useState('');

  // Handle Customer Selection
  const handleCustomerChange = (customerId: string) => {
    const cust = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    if (cust) {
      form.setFieldsValue({
        customerPhone: cust.phone,
        customerEmail: cust.email,
        shippingAddress: cust.addresses[0] || '',
      });
    }
  };

  // Add Item to table
  const handleAddItem = (productId: string) => {
    const prod = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!prod) return;

    // Check if already in table
    const exists = selectedItems.find((item) => item.product.id === prod.id);
    if (exists) {
      message.warning('Sản phẩm đã tồn tại trong danh sách. Vui lòng tăng số lượng.');
      return;
    }

    if (prod.availableStock <= 0) {
      message.error(`Sản phẩm "${prod.name}" đã hết tồn kho khả dụng (BR-01)!`);
      return;
    }

    setSelectedItems((prev) => [
      ...prev,
      {
        key: `item-${Date.now()}`,
        product: prod,
        quantity: 1,
      },
    ]);
  };

  // Quantity Change with BR-01 stock validation
  const handleQuantityChange = (key: string, qty: number | null) => {
    const target = selectedItems.find((item) => item.key === key);
    if (!target) return;

    const newQty = qty || 1;
    if (newQty > target.product.availableStock) {
      message.error(
        `Quy tắc BR-01: Tồn kho khả dụng chỉ còn ${target.product.availableStock} ${target.product.unit}. Không thể đặt vượt mức!`
      );
      return;
    }

    setSelectedItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: newQty } : item))
    );
  };

  // Remove Item
  const handleRemoveItem = (key: string) => {
    if (selectedItems.length === 1) {
      message.warning('Đơn hàng phải chứa ít nhất một sản phẩm!');
      return;
    }
    setSelectedItems((prev) => prev.filter((item) => item.key !== key));
  };

  // Calculations
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 100000000 ? 0 : 500000;
  const tax = Math.round(subtotal * 0.1);
  const totalAmount = subtotal + shippingFee + tax;

  // Submit Order
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const customer = MOCK_CUSTOMERS.find((c) => c.id === values.customerId);
      const warehouse = MOCK_WAREHOUSES.find((w) => w.id === values.warehouseId);

      if (!customer || !warehouse) {
        message.error('Vui lòng kiểm tra lại thông tin khách hàng và kho hàng.');
        return;
      }

      if (selectedItems.length === 0) {
        message.error('Vui lòng chọn ít nhất một sản phẩm cho đơn hàng!');
        return;
      }

      // Final check for stock rules
      for (const item of selectedItems) {
        if (item.quantity > item.product.availableStock) {
          message.error(
            `Sản phẩm ${item.product.name} vượt quá tồn kho khả dụng (${item.product.availableStock})!`
          );
          return;
        }
      }

      const newOrder = createOrder({
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail,
        shippingAddress: values.shippingAddress,
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        items: selectedItems.map((item) => ({
          productId: item.product.id,
          sku: item.product.sku,
          name: item.product.name,
          unitPrice: item.product.price,
          quantity: item.quantity,
        })),
        notes,
        paymentMethod,
      });

      message.success(`Đã tạo thành công đơn hàng ${newOrder.code}! Trạng thái: PENDING_STOCK.`);
      navigate(`/orders/${newOrder.id}`);
    } catch {
      message.error('Vui lòng điền đầy đủ các thông tin bắt buộc.');
    }
  };

  const itemColumns: ColumnsType<SelectedProductRow> = [
    {
      title: 'Mặt Hàng & SKU',
      dataIndex: 'product',
      key: 'product',
      render: (product: ProductInventoryOption) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{product.name}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            SKU: <strong style={{ color: '#2563eb' }}>{product.sku}</strong> | {product.category}
          </div>
        </div>
      ),
    },
    {
      title: 'Tồn Khả Dụng (BR-01)',
      dataIndex: 'product',
      key: 'stock',
      width: 170,
      render: (product: ProductInventoryOption) => (
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              background: product.availableStock > 0 ? '#ecfdf5' : '#fef2f2',
              color: product.availableStock > 0 ? '#059669' : '#dc2626',
            }}
          >
            {product.availableStock} {product.unit} còn lại
          </span>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Tổng: {product.totalStock} | Đã giữ: {product.reservedStock}
          </div>
        </div>
      ),
    },
    {
      title: 'Đơn Giá (Snapshot BR-03)',
      dataIndex: 'product',
      key: 'price',
      width: 170,
      align: 'right',
      render: (prod: ProductInventoryOption) => (
        <span style={{ fontWeight: 600 }}>{prod.price.toLocaleString('vi-VN')} đ</span>
      ),
    },
    {
      title: 'Số Lượng',
      key: 'quantity',
      width: 120,
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.product.availableStock}
          value={record.quantity}
          onChange={(val) => handleQuantityChange(record.key, val)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: 'Thành Tiền',
      key: 'subtotal',
      width: 160,
      align: 'right',
      render: (_, record) => (
        <span style={{ fontWeight: 700, color: '#0f172a' }}>
          {(record.product.price * record.quantity).toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.key)}
        />
      ),
    },
  ];

  return (
    <div className="orders-page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(paths.orders.root)}
          style={{ borderRadius: 8 }}
        >
          Quay lại danh sách
        </Button>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
            Tạo Đơn Hàng Mới (New Order)
          </Title>
          <Text style={{ color: '#64748b', fontSize: 13 }}>
            Thiết lập đơn hàng B2B, áp dụng cơ chế Snapshot dữ liệu (BR-03) và khóa tồn kho (BR-01).
          </Text>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          customerId: 'CUST-001',
          customerPhone: MOCK_CUSTOMERS[0].phone,
          customerEmail: MOCK_CUSTOMERS[0].email,
          shippingAddress: MOCK_CUSTOMERS[0].addresses[0],
          warehouseId: 'WH-HCM-01',
        }}
      >
        <Row gutter={[24, 24]}>
          {/* Left Column: Customer & Items */}
          <Col xs={24} lg={16}>
            {/* Customer & Warehouse Card */}
            <Card
              title={<span style={{ fontWeight: 700, fontSize: 16 }}>1. Thông Tin Khách Hàng & Kho Xuất Hàng</span>}
              style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}
              styles={{ body: { padding: '24px' } }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="customerId"
                    label="Khách hàng doanh nghiệp (B2B)"
                    rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
                  >
                    <Select
                      placeholder="Chọn khách hàng"
                      onChange={handleCustomerChange}
                      options={MOCK_CUSTOMERS.map((c) => ({
                        value: c.id,
                        label: `${c.name} (${c.phone})`,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="warehouseId"
                    label="Kho hàng xuất phát (Warehouse)"
                    rules={[{ required: true, message: 'Vui lòng chọn kho xuất hàng!' }]}
                  >
                    <Select
                      value={selectedWarehouseId}
                      onChange={(val) => setSelectedWarehouseId(val)}
                      options={MOCK_WAREHOUSES.map((w) => ({
                        value: w.id,
                        label: `${w.name}`,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="customerPhone"
                    label="Số điện thoại liên hệ"
                    rules={[{ required: true, message: 'Vui lòng nhập SĐT!' }]}
                  >
                    <Input placeholder="09xx..." />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="customerEmail" label="Email nhận chứng từ / Hóa đơn">
                    <Input placeholder="email@domain.com" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    name="shippingAddress"
                    label="Địa chỉ giao hàng chi tiết (Destination)"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]}
                  >
                    <Input.TextArea rows={2} placeholder="Số nhà, phố, phường/xã, quận/huyện, tỉnh/thành..." />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Order Items Table Card */}
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>2. Danh Sách Sản Phẩm & Kiểm Soát Tồn Kho (BR-01)</span>
                  <Select
                    placeholder="+ Thêm sản phẩm vào đơn"
                    style={{ width: 280 }}
                    onChange={handleAddItem}
                    value={null}
                    options={MOCK_PRODUCTS.map((p) => ({
                      value: p.id,
                      disabled: p.availableStock <= 0,
                      label: `${p.name} (Còn: ${p.availableStock})`,
                    }))}
                  />
                </div>
              }
              style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}
              styles={{ body: { padding: '24px' } }}
            >
              <Alert
                message="Quy Tắc Đóng Băng Dữ Liệu (BR-03) & Kiểm Soát Tồn (BR-01)"
                description="Khi tạo đơn, đơn giá và mô tả sản phẩm sẽ được đóng băng (Snapshot). Số lượng mua không được vượt quá số lượng Tồn Khả Dụng (Available Stock = Total - Reserved)."
                type="info"
                showIcon
                style={{ marginBottom: 20 }}
              />

              <Table<SelectedProductRow>
                columns={itemColumns}
                dataSource={selectedItems}
                pagination={false}
                scroll={{ x: 650 }}
              />
            </Card>

            {/* Note Card */}
            <Card
              title={<span style={{ fontWeight: 700, fontSize: 16 }}>Ghi Chú Đơn Hàng & Chỉ Dẫn Giao Hàng</span>}
              style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
              styles={{ body: { padding: '24px' } }}
            >
              <Input.TextArea
                rows={3}
                placeholder="Ghi chú thêm về quy cách đóng gói, người nhận thay thế, thời gian nhận hàng..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Card>
          </Col>

          {/* Right Column: Payment & Summary */}
          <Col xs={24} lg={8}>
            {/* Payment Method */}
            <Card
              title={<span style={{ fontWeight: 700, fontSize: 16 }}>3. Phương Thức Thanh Toán</span>}
              style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}
              styles={{ body: { padding: '24px' } }}
            >
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
              >
                <Radio value="BANK_TRANSFER">
                  <div>
                    <strong style={{ color: '#0f172a' }}>Chuyển khoản Ngân hàng (B2B)</strong>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Thanh toán qua tài khoản doanh nghiệp bảo chứng</div>
                  </div>
                </Radio>
                <Radio value="COD">
                  <div>
                    <strong style={{ color: '#0f172a' }}>Thanh toán khi nhận hàng (COD)</strong>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Tài xế thu tiền mặt hoặc quét mã QR tại điểm giao</div>
                  </div>
                </Radio>
                <Radio value="CREDIT_CARD">
                  <div>
                    <strong style={{ color: '#0f172a' }}>Thẻ Tín Dụng Doanh Nghiệp</strong>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Cổng thanh toán quốc tế Visa/Mastercard Corporate</div>
                  </div>
                </Radio>
              </Radio.Group>
            </Card>

            {/* Order Cost Breakdown */}
            <Card
              title={<span style={{ fontWeight: 700, fontSize: 16 }}>Tổng Kết Đơn Hàng</span>}
              style={{ borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}
              styles={{ body: { padding: '24px' } }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Tiền hàng ({selectedItems.length} mặt hàng)</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>
                    {subtotal.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Cước phí vận chuyển</span>
                  <span style={{ fontWeight: 600, color: shippingFee === 0 ? '#16a34a' : '#0f172a' }}>
                    {shippingFee === 0 ? 'Miễn phí (Đơn > 100tr)' : `${shippingFee.toLocaleString('vi-VN')} đ`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Thuế GTGT (VAT 10%)</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>
                    {tax.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <Divider style={{ margin: '8px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>
                    Tổng Thanh Toán:
                  </span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: '#2563eb' }}>
                    {totalAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleSubmit}
                  style={{
                    height: 48,
                    fontWeight: 700,
                    borderRadius: 8,
                    background: '#2563eb',
                  }}
                >
                  Xác Nhận Tạo Đơn Hàng
                </Button>

                <Button
                  size="large"
                  onClick={() => navigate(paths.orders.root)}
                  style={{ borderRadius: 8 }}
                >
                  Hủy bỏ
                </Button>
              </div>
            </Card>

            {/* BR Rules Info Callout */}
            <Card
              size="small"
              style={{
                borderRadius: 12,
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <InfoCircleOutlined style={{ color: '#2563eb', marginTop: 2 }} />
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  <strong>Cơ chế tự động:</strong> Đơn hàng mới sẽ tự động nhận mã <code>ORD-2026-xxx</code> và kích hoạt trạng thái <code>PENDING_STOCK</code> để trung tâm phân phối bắt đầu tiến trình giữ tồn kho (Reserve Stock).
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
