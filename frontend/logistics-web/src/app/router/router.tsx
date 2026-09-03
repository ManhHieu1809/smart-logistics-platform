import { Navigate, createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../../features/auth/pages/LoginPage';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { AppLayout } from '../../layouts/AppLayout/AppLayout';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { paths } from './paths';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={paths.login} replace />,
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
    ],
  },
]);
