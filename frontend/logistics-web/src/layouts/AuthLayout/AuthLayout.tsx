import{ Outlet } from "react-router-dom";
import { TruckOutlined } from "@ant-design/icons";

import styles from "./AuthLayout.module.css";

const LOGIN_BACKGROUND = 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6y-QTwEqV_A7-9IPxpHL0viR2p-vH25Z63KnFTfiA0uRwxY_wF8eZjYmQNCAKdfTaQF5aCcQxEKOwkg0kJgI7tVjek29eJyliVDZZa-Q6MI1iqCh-Zff1KukLLFxmDOfaQivGgzGrwnlD4Rx6KapnF0Z2sLyzoqYhMvi2arl0Zc6-Vw_Vs6LEO8kaEGSPT9mJTSzw6AnkoG2sgdnKwvFvKamCwsw5Iq4GoWET3-HzjmFQiZCdJLg2';

export function AuthLayout(){
    return (
        <main className={styles.layout}>
            <section className={styles.brandSection}>
                <img
          className={styles.backgroundImage}
          src={LOGIN_BACKGROUND}
          alt=""
          aria-hidden="true"
        />

        <div className={styles.overlay} />

        <div className={styles.brandContent}>
          <TruckOutlined className={styles.brandIcon} />

          <h1 className={styles.brandTitle}>Smart Logistics</h1>

          <p className={styles.brandDescription}>
            Manage orders, inventory and delivery operations in one platform.
          </p>
        </div>
      </section>

      <section className={styles.contentSection}>
        <Outlet />
      </section>
    </main>
  );
}