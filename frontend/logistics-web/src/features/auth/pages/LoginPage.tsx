import { TruckOutlined } from '@ant-design/icons';

import { LoginForm } from '../components/LoginForm';

import styles from './LoginPage.module.css';

export function LoginPage() {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.mobileBrand}>
          <TruckOutlined className={styles.mobileBrandIcon} />

          <span className={styles.mobileBrandName}>
            Smart Logistics
          </span>
        </div>

        <header className={styles.header}>
          <h2 className={styles.title}>
            Welcome back
          </h2>

          <p className={styles.description}>
            Sign in to continue to Smart Logistics.
          </p>
        </header>

        <LoginForm />
      </section>
    </div>
  );
}