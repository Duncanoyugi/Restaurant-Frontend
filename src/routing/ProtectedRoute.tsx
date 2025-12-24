import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { UserRoleEnum } from '../features/auth/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRoleEnum; // Optional role requirement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    console.log('🔒 Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if a specific role is required and user has it
  if (requiredRole) {
    console.log('🛡️ Role check - User role:', user?.role, 'Required role:', requiredRole);
    console.log('🔍 Trimmed comparison:', user?.role?.trim(), 'vs', requiredRole.trim());
    console.log('📌 Match:', user?.role?.trim() === requiredRole.trim());
    
    if (user?.role?.trim() !== requiredRole.trim()) {
      console.log('❌ Role mismatch, redirecting to dashboard');
      // Redirect to dashboard if user doesn't have the required role
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};

export default ProtectedRoute;