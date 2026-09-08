import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ProofStat {
  id: string;
  targetVal: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  label: string;
  sublabel: string;
}

const PROOF_STATS: ProofStat[] = [
  {
    id: 'proof-sla',
    targetVal: 99.85,
    decimals: 2,
    suffix: '%',
    label: 'Cam Kết SLA Đúng Hẹn',
    sublabel: 'Tối ưu tuyến đường liên tỉnh',
  },
  {
    id: 'proof-hubs',
    targetVal: 150,
    prefix: '+',
    suffix: '',
    label: 'Kho Bãi & Hub Trung Chuyển',
    sublabel: 'Bao phủ 63 tỉnh thành & quốc tế',
  },
  {
    id: 'proof-speed',
    targetVal: 15,
    prefix: '< ',
    suffix: 'ms',
    label: 'Độ Trễ Điều Phối Sự Kiện',
    sublabel: 'Hạ tầng Kafka KRaft tốc độ cao',
  },
  {
    id: 'proof-volume',
    targetVal: 2.4,
    decimals: 1,
    suffix: 'M+',
    label: 'Kiện Hàng Xử Lý Mỗi Tháng',
    sublabel: 'Chống lỗi bán vượt tồn tuyệt đối',
  },
];

export function TrustProofBar() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      PROOF_STATS.forEach((stat) => {
        const el = document.getElementById(stat.id);
        if (el) {
          const formatted = stat.decimals ? stat.targetVal.toFixed(stat.decimals) : stat.targetVal.toLocaleString();
          el.innerText = `${stat.prefix || ''}${formatted}${stat.suffix}`;
        }
      });
      return;
    }

    PROOF_STATS.forEach((stat) => {
      const el = document.getElementById(stat.id);
      if (!el) return;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: stat.targetVal,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => {
          const formatted = stat.decimals ? obj.val.toFixed(stat.decimals) : Math.floor(obj.val).toLocaleString();
          el.innerText = `${stat.prefix || ''}${formatted}${stat.suffix}`;
        },
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="trust-proof-bar">
      <div className="proof-container">
        <div className="proof-grid">
          {PROOF_STATS.map((stat) => (
            <div key={stat.id} className="proof-col">
              <div id={stat.id} className="proof-number">
                {stat.prefix || ''}0{stat.suffix}
              </div>
              <div className="proof-label">{stat.label}</div>
              <div className="proof-sublabel">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
