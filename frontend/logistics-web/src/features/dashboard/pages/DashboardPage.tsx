import {
  ArrowUpOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Progress, Tag } from 'antd';
import type { ReactNode } from 'react';

import { RoutesMap } from '../components/RoutesMap';

import styles from './DashboardPage.module.css';

type Metric = {
  label: string;
  value: string;
  note: string;
  icon: ReactNode;
  iconClassName: string;
  progress?: number;
  progressColor?: string;
};

const metrics: Metric[] = [
  { label: 'Active Orders', value: '1,284', note: '12% vs last week', icon: <ShoppingCartOutlined />, iconClassName: styles.blue },
  { label: 'Deliveries in Progress', value: '86', note: '4% vs yesterday', icon: <TruckOutlined />, iconClassName: styles.indigo },
  { label: 'Warehouse Capacity', value: '78%', note: 'Approaching max capacity', icon: <EnvironmentOutlined />, iconClassName: styles.orange, progress: 78, progressColor: '#f59e0b' },
  { label: 'Fleet Availability', value: '92%', note: 'Optimal levels', icon: <TruckOutlined />, iconClassName: styles.green, progress: 92, progressColor: '#10b981' },
];

const orders = [
  ['ORD-2026-012', 'Global Retailers Ltd.', 'Berlin, Germany', 'Active', 'Today, 14:30'],
  ['ORD-2026-011', 'TechCorp Inc.', 'Seattle, WA, USA', 'Pending', 'Oct 26, 09:00'],
  ['ORD-2026-010', 'Sunrise Industries', 'Tokyo, Japan', 'Completed', 'Delivered'],
  ['ORD-2026-009', 'MegaMart', 'London, UK', 'Active', 'Tomorrow, 11:15'],
] as const;

const alerts = [
  ['Low Stock Alert', 'iPhone 15 Pro Max inventory critical at Hanoi Warehouse.', '10m ago', styles.alertRed, 'Review Inventory'],
  ['Route Delay', 'Delivery BRV-882 delayed due to heavy traffic on I-95 North.', '45m ago', styles.alertOrange, 'View Details'],
  ['New Large Order', 'TechCorp Inc. placed bulk order ORD-2026-008. Needs assignment.', '2h ago', styles.alertBlue, ''],
];

function statusClass(status: string) {
  return status === 'Active' ? styles.active : status === 'Pending' ? styles.pending : styles.completed;
}

export function DashboardPage() {
  return (
    <div className={styles.page}>
      <section className={styles.metricGrid} aria-label="Overview metrics">
        {metrics.map((metric) => (
          <article className={styles.metricCard} key={metric.label}>
            <div className={styles.metricTop}>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
              </div>
              <span className={`${styles.metricIcon} ${metric.iconClassName}`}>{metric.icon}</span>
            </div>
            {metric.progress ? (
              <>
                <Progress percent={metric.progress} showInfo={false} strokeColor={metric.progressColor} trailColor="#e2e8f0" size="small" />
                <span className={styles.metricNote}>{metric.note}</span>
              </>
            ) : (
              <div className={styles.growth}><ArrowUpOutlined /> <b>{metric.note.split(' ')[0]}</b><span>{metric.note.substring(metric.note.indexOf(' ') + 1)}</span></div>
            )}
          </article>
        ))}
      </section>

      <section className={styles.operationsGrid}>
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            <h2><EnvironmentOutlined /> Live Active Routes</h2>
            <button type="button">VIEW FULL MAP →</button>
          </div>
          <div className={styles.map}>
            <div className={styles.mapLegend}><b>4</b> Active Routes<br /><b>3</b> Experiencing Delays</div>
            <RoutesMap />
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHeader}><h2><WarningOutlined className={styles.warning} /> Operational Alerts <em>3 New</em></h2></div>
          <div className={styles.alertList}>
            {alerts.map(([title, copy, time, tone, action]) => (
              <div className={`${styles.alert} ${tone}`} key={title}>
                <div className={styles.alertTitle}><b>{title}</b><span>{time}</span></div>
                <p>{copy}</p>
                {action && <button type="button">{action}</button>}
              </div>
            ))}
            <div className={styles.update}><b>System Update</b><span>Yesterday</span><p>Routine maintenance scheduled for tonight.</p></div>
          </div>
        </article>
      </section>

      <section className={`${styles.card} ${styles.ordersCard}`}>
        <div className={styles.ordersHeader}>
          <h2>Recent Orders</h2>
          <div><Button icon={<FilterOutlined />} size="small">Filter</Button><Button icon={<PlusOutlined />} size="small" type="primary">Create Order</Button></div>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Destination</th><th>Status</th><th>Est. Arrival</th></tr></thead>
            <tbody>{orders.map(([id, customer, destination, status, eta]) => <tr key={id}><td>{id}</td><td>{customer}</td><td>{destination}</td><td><Tag bordered={false} className={`${styles.status} ${statusClass(status)}`}>{status}</Tag></td><td>{eta}</td></tr>)}</tbody>
          </table>
        </div>
        <button className={styles.viewAll} type="button">View All Orders</button>
      </section>
    </div>
  );
}
