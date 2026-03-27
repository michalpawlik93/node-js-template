import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/stores/authStore';

interface RequireRoleProps {
  allowedRoles: string[];
}

export function RequireRole({ allowedRoles }: RequireRoleProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = allowedRoles.some((role) => user.roles.includes(role));
  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
