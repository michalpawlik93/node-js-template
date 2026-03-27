import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/components/pages/LoginPage';
import { RequireAuth } from '@/features/auth/components/containers/RequireAuth';
import { ProductsPage } from '@/features/products/components/pages/ProductsPage';
import { AppLayout } from '@/shared/components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/products" replace />,
          },
          {
            path: 'products',
            element: <ProductsPage />,
          },
        ],
      },
    ],
  },
]);
