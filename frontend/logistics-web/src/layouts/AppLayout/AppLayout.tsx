import {
  BellOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  GroupOutlined,
  InboxOutlined,
  MenuOutlined,
  MoreOutlined,
  NotificationOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  ShopOutlined,
  TruckOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Input, Tooltip } from 'antd';
import type { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { paths } from '../../app/router/paths';

import styles from './AppLayout.module.css';

type NavigationItem = {
  label: string;
  icon: ReactNode;
  path?: string;
};

const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', icon: <DashboardOutlined />, path: paths.dashboard },
  { label: 'Customers', icon: <GroupOutlined /> },
  { label: 'Products', icon: <InboxOutlined /> },
  { label: 'Warehouses', icon: <ShopOutlined /> },
  { label: 'Inventory', icon: <DatabaseOutlined /> },
  { label: 'Orders', icon: <MenuOutlined /> },
  { label: 'Deliveries', icon: <TruckOutlined /> },
  { label: 'Drivers', icon: <UserOutlined /> },
  { label: 'Notifications', icon: <NotificationOutlined /> },
  { label: 'Users & Permissions', icon: <SafetyCertificateOutlined /> },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} to={paths.dashboard}>
          <TruckOutlined className={styles.brandIcon} />
          <span>Smart Logistics</span>
        </Link>

        <nav className={styles.navigation} aria-label="Main navigation">
          {navigationItems.map((item) => {
            const isActive = item.path === location.pathname;
            const content = (
              <>
                <span className={styles.navigationIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </>
            );

            if (item.path) {
              return (
                <Link
                  className={`${styles.navigationItem} ${isActive ? styles.active : ''}`}
                  key={item.label}
                  to={item.path}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button className={styles.navigationItem} key={item.label} type="button">
                {content}
              </button>
            );
          })}
        </nav>

        <div className={styles.systemStatus}>
          <span className={styles.statusLabel}>System Status</span>
          <div className={styles.statusValue}>
            <span className={styles.statusDot} />
            All Systems Operational
          </div>
        </div>
      </aside>

      <div className={styles.contentArea}>
        <header className={styles.header}>
          <h1>Dashboard Overview</h1>
          <div className={styles.headerActions}>
            <Input
              className={styles.search}
              prefix={<SearchOutlined />}
              placeholder="Search orders, deliveries..."
            />
            <div className={styles.headerDivider} />
            <Tooltip title="Notifications">
              <Badge dot>
                <Button aria-label="Notifications" className={styles.iconButton} icon={<BellOutlined />} type="text" />
              </Badge>
            </Tooltip>
            <Tooltip title="Settings">
              <Button aria-label="Settings" className={styles.iconButton} icon={<SettingOutlined />} type="text" />
            </Tooltip>
            <button className={styles.profile} type="button">
              <Avatar className={styles.avatar} icon={<UserOutlined />} size={32} />
              <span className={styles.profileName}>Alex Smith</span>
              <MoreOutlined />
            </button>
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
