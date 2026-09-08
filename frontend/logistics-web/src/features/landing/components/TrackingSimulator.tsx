import { useState } from 'react';
import {
  CheckCircleFilled,
  ClockCircleFilled,
  LoadingOutlined,
  SearchOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { paths } from '../../../app/router/paths';

interface MockShipment {
  code: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  currentStatus: string;
  driver: string;
  eta: string;
  items: string;
  timeline: { title: string; time: string; desc: string; done: boolean; current?: boolean }[];
}

const MOCK_SHIPMENTS: Record<string, MockShipment> = {
  'SLP-88291-VN': {
    code: 'SLP-88291-VN',
    sender: 'Kho Trung Tâm Cát Lái, TP.HCM',
    recipient: 'Công ty Cổ phần Công nghệ ABC (Hà Nội)',
    origin: 'TP. Hồ Chí Minh',
    destination: 'Hà Nội',
    currentStatus: 'Đang vận chuyển liên tỉnh',
    driver: 'Trần Minh Đức (Xe tải 5 tấn - 29C-881.92)',
    eta: 'Hôm nay, 18:30 (Đúng tiến độ)',
    items: '40 Kiện linh kiện máy chủ (280 kg)',
    timeline: [
      { title: 'Tạo đơn & Giữ tồn kho', time: '08:15', desc: 'Reserved kho Cát Lái (Optimistic Lock BR-01)', done: true },
      { title: 'Xuất kho & Phân công tài xế', time: '10:30', desc: 'Tài xế nhận chuyến, bàn giao mã vận đơn', done: true },
      { title: 'Đang giao hàng (In Transit)', time: '14:20', desc: 'Đang qua trạm trung chuyển Đà Nẵng', done: true, current: true },
      { title: 'Dự kiến giao hàng hoàn tất', time: '18:30', desc: 'Bàn giao và ký nhận điện tử (e-POD)', done: false },
    ],
  },
  'SLP-55104-HCM': {
    code: 'SLP-55104-HCM',
    sender: 'Kho Logistics Tân Bình, TP.HCM',
    recipient: 'Đại lý Dược phẩm Miền Tây',
    origin: 'Tân Bình, TP.HCM',
    destination: 'Cần Thơ',
    currentStatus: 'Đang giao hàng chặng cuối',
    driver: 'Nguyễn Văn Hùng (Xe tải 2 tấn - 51D-492.11)',
    eta: '16:15 (Sớm hơn 20 phút)',
    items: '15 Kiện vật tư y tế bảo quản nhiệt độ chuẩn',
    timeline: [
      { title: 'Xác nhận đơn & Giữ tồn', time: '07:30', desc: 'Saga compensation sẵn sàng', done: true },
      { title: 'Đóng gói & Niêm phong', time: '09:00', desc: 'Kiểm soát số lượng tồn kho tự động', done: true },
      { title: 'Tài xế giao hàng chặng cuối', time: '14:00', desc: 'Đã vào địa phận Cần Thơ', done: true, current: true },
      { title: 'Ký nhận người nhận', time: '16:15', desc: 'Chờ đối soát COD & hoàn tất', done: false },
    ],
  },
  'SLP-33921-HAN': {
    code: 'SLP-33921-HAN',
    sender: 'Kho Nội Bài Gateway, Hà Nội',
    recipient: 'Siêu thị Điện máy Quốc tế Hải Phòng',
    origin: 'Sóc Sơn, Hà Nội',
    destination: 'Hải Phòng',
    currentStatus: 'Đã xuất kho & Bắt đầu vận chuyển',
    driver: 'Lê Hoàng Nam (Xe tải 3.5 tấn - 15B-201.34)',
    eta: '17:45 (Bình thường)',
    items: '80 Màn hình hiển thị công nghiệp',
    timeline: [
      { title: 'Khởi tạo đơn hàng', time: '11:00', desc: 'Xác thực khách hàng và phân bổ kho', done: true },
      { title: 'Xuất kho thành công', time: '13:15', desc: 'Trừ tồn khả dụng (Stock transaction audit)', done: true },
      { title: 'Bắt đầu lộ trình cao tốc 5B', time: '14:30', desc: 'Theo dõi GPS thời gian thực', done: true, current: true },
      { title: 'Giao hàng đích', time: '17:45', desc: 'Cập nhật trạng thái COMPLETED', done: false },
    ],
  },
};

export function TrackingSimulator() {
  const [inputCode, setInputCode] = useState('SLP-88291-VN');
  const [activeShipment, setActiveShipment] = useState<MockShipment>(MOCK_SHIPMENTS['SLP-88291-VN']);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (codeToSearch: string) => {
    setIsSearching(true);
    setTimeout(() => {
      const match = MOCK_SHIPMENTS[codeToSearch] || MOCK_SHIPMENTS['SLP-88291-VN'];
      setActiveShipment(match);
      setInputCode(match.code);
      setIsSearching(false);
    }, 250);
  };

  return (
    <div className="tracking-simulator-card">
      <div className="simulator-header">
        <div className="simulator-title-group">
          <span className="simulator-badge">TRẢI NGHIỆM TRỰC QUAN</span>
          <h3 className="simulator-title">Tra Cứu Tiến Độ Vận Hành Vận Đơn</h3>
        </div>
        <div className="simulator-code-tag">{activeShipment.code}</div>
      </div>

      {/* Search Input Bar */}
      <form
        className="simulator-search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(inputCode);
        }}
      >
        <div className="search-input-wrapper">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            className="tracking-input"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Nhập mã vận đơn (VD: SLP-88291-VN)..."
            aria-label="Mã vận đơn"
          />
        </div>
        <button type="submit" className="btn-track-submit" disabled={isSearching}>
          {isSearching ? <LoadingOutlined /> : 'Tra Cứu'}
        </button>
      </form>

      {/* Sample Codes */}
      <div className="sample-codes-row">
        <span className="sample-label">Mã vận đơn mẫu:</span>
        {Object.keys(MOCK_SHIPMENTS).map((code) => (
          <button
            key={code}
            type="button"
            className={`sample-chip ${code === activeShipment.code ? 'active' : ''}`}
            onClick={() => handleSearch(code)}
          >
            {code}
          </button>
        ))}
      </div>

      {/* Shipment Meta Details */}
      <div className="shipment-meta-box">
        <div className="meta-row">
          <div className="meta-col">
            <span className="meta-label">Tuyến vận chuyển</span>
            <span className="meta-value bold-blue">
              {activeShipment.origin} → {activeShipment.destination}
            </span>
          </div>
          <div className="meta-col">
            <span className="meta-label">Trạng thái hiện tại</span>
            <span className="meta-value status-transit">
              <TruckOutlined style={{ marginRight: '6px' }} />
              {activeShipment.currentStatus}
            </span>
          </div>
          <div className="meta-col">
            <span className="meta-label">Dự kiến giao (ETA)</span>
            <span className="meta-value bold-orange">{activeShipment.eta}</span>
          </div>
        </div>

        <div className="meta-driver-row">
          <span className="driver-label">Tài xế phụ trách:</span>
          <span className="driver-name">{activeShipment.driver}</span>
          <span className="items-summary">• Hàng hóa: {activeShipment.items}</span>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div className="shipment-timeline">
        {activeShipment.timeline.map((step, idx) => (
          <div
            key={idx}
            className={`timeline-step ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`}
          >
            <div className="step-indicator">
              {step.done ? (
                <CheckCircleFilled className="icon-done" />
              ) : step.current ? (
                <ClockCircleFilled className="icon-current" />
              ) : (
                <span className="dot-pending" />
              )}
              {idx < activeShipment.timeline.length - 1 && <div className="step-connector" />}
            </div>
            <div className="step-content">
              <div className="step-header">
                <span className="step-title">{step.title}</span>
                <span className="step-time">{step.time}</span>
              </div>
              <p className="step-desc">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Footer in card */}
      <div className="simulator-footer">
        <span className="footer-notice">
          Mô hình hóa chính xác nghiệp vụ Order State Machine & Delivery tracking từ tài liệu Blueprint.
        </span>
        <Link to={paths.dashboard} className="link-open-dashboard">
          Xem Bản Đồ Live Trực Tiếp →
        </Link>
      </div>
    </div>
  );
}
