// frontend/src/components/dashboard/RoleBasedDashboard.tsx
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import CustomerDashboard from '../../pages/Dashboard/CustomerDashboard';
import OwnerDashboard from '../../features/owner/OwnerDashboard';
import AdminDashboard from '../../features/admin/AdminDashboard';
import { UserRoleEnum } from '../../features/auth/authSlice';

// Helper to safely extract role name
const extractRoleName = (role: any): string => {
  if (typeof role === 'string') {
    return role;
  }
  if (role && typeof role === 'object') {
    // Try different possible property names
    return role.name || role.roleName || role.role || role.value || UserRoleEnum.CUSTOMER;
  }
  return UserRoleEnum.CUSTOMER;
};

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Safely extract role name
  const roleName = extractRoleName(user.role);

  // Route to appropriate dashboard
  if (roleName === UserRoleEnum.ADMIN) {
    return <AdminDashboard />;
  } else if (roleName === UserRoleEnum.RESTAURANT_OWNER) {
    return <OwnerDashboard />;
  } else {
    return <CustomerDashboard />;
  }
};

export default RoleBasedDashboard;