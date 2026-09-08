import { createHashRouter } from 'react-router-dom';

import { LoginPage } from '../../features/auth/pages/LoginPage';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { LandingPage } from '../../features/landing/pages/LandingPage';
import { OrderCreatePage } from '../../features/orders/pages/OrderCreatePage';
import { OrderDetailPage } from '../../features/orders/pages/OrderDetailPage';
import { OrdersListPage } from '../../features/orders/pages/OrdersListPage';
import { AppLayout } from '../../layouts/AppLayout/AppLayout';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { paths } from './paths';

export const router = createHashRouter([
  {
    path: paths.landing,
    element: <LandingPage />,
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: paths.login,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: paths.dashboard,
        element: <DashboardPage />,
      },
      {
        path: paths.orders.root,
        element: <OrdersListPage />,
      },
      {
        path: paths.orders.create,
        element: <OrderCreatePage />,
      },
      {
        path: paths.orders.detail,
        element: <OrderDetailPage />,
      },
    ],
  },
]);
