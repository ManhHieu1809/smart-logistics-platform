import { useState } from 'react';
import { Alert, Input, Modal } from 'antd';

interface OrderCancelModalProps {
  visible: boolean;
  orderCode: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function OrderCancelModal({
  visible,
  orderCode,
  onConfirm,
  onCancel,
}: OrderCancelModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleOk = () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do hủy đơn hàng.');
      return;
    }
    onConfirm(reason.trim());
    setReason('');
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onCancel();
  };

  return (
    <Modal
      title={`Xác Nhận Hủy Đơn Hàng: ${orderCode}`}
      open={visible}
      onOk={handleOk}
      onCancel={handleClose}
      okText="Xác Nhận Hủy Đơn"
      cancelText="Quay Lại"
      okButtonProps={{ danger: true }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 10 }}>
        <Alert
          type="warning"
          showIcon
          message="Quy Tắc Nghiệp Vụ BR-05"
          description="Hủy đơn hàng trước khi xuất kho sẽ tự động kích hoạt tiến trình bồi hoàn giải phóng số lượng tồn kho đã giữ (Release Reservation) sang Inventory Service."
        />

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
            Lý do hủy đơn hàng <span style={{ color: '#dc2626' }}>*</span>:
          </label>
          <Input.TextArea
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ví dụ: Khách hàng thay đổi yêu cầu sản phẩm, sai địa chỉ nhận hàng..."
          />
          {error && <span style={{ color: '#dc2626', fontSize: 12, marginTop: 4, display: 'block' }}>{error}</span>}
        </div>
      </div>
    </Modal>
  );
}
