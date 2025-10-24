import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PrivateRouteProps {
  children?: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuth();
  
  // 确保认证逻辑正确，未认证用户重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 确保子路由或组件能够正确渲染
  return children ? children : <Outlet />;
}