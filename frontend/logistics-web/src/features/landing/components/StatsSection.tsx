import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface StatItem {
  id: string;
  targetValue: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  label: string;
  description: string;
}

const STATS_DATA: StatItem[] = [
  {
    id: 'stat-trips',
    targetValue: 1480,
    prefix: '+',
    suffix: '',
    label: 'Chuyến xe mỗi ngày',
    description: 'Vận hành liên tục trên các tuyến trục',
  },
  {
    id: 'stat-sla',
    targetValue: 99.85,
    decimals: 2,
    suffix: '%',
    label: 'Đúng hẹn cam kết (SLA)',
    description: 'Tối ưu tuyến đường thông minh',
  },
  {
    id: 'stat-hubs',
    targetValue: 150,
    prefix: '+',
    suffix: '',
    label: 'Kho bãi & Hub kết nối',
    description: 'Mạng lưới logistics toàn quốc',
  },
  {
    id: 'stat-orders',
    targetValue: 2.4,
    decimals: 1,
    suffix: 'M+',
    label: 'Đơn hàng đã xử lý',
    description: 'Cam kết tính nhất quán giao dịch ACID',
  },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    STATS_DATA.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: item.targetValue,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: undefined, // smooth auto count
        onUpdate: () => {
          const formatted = item.decimals ? obj.val.toFixed(item.decimals) : Math.floor(obj.val).toLocaleString();
          el.innerText = `${item.prefix || ''}${formatted}${item.suffix}`;
        },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} id="stats" className="stats-section">
      <div className="stats-container">
        <div className="stats-grid">
          {STATS_DATA.map((item) => (
            <div key={item.id} className="stat-card">
              <div className="stat-glow-effect" />
              <div id={item.id} className="stat-number">
                {item.prefix || ''}0{item.suffix}
              </div>
              <div className="stat-label">{item.label}</div>
              <div className="stat-desc">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
