import React from 'react';
import { useAppSelector } from '../../app/hooks';
import CustomerDashboard from '../../Dashboard/customer/CustomerDashboard';
import AdminDashboard from '../../Dashboard/admin/AdminDashboard';
import DriverDashboard from '../../Dashboard/driver/DriverDashboard';
import StaffDashboard from '../../Dashboard/staff/StaffDashboard';
import OwnerDashboard from '../../Dashboard/owner/OwnerDashboard';
import { UserRoleEnum, extractRoleName } from '../../features/auth/authSlice';

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

  // Extract and normalize role name
  const roleName = extractRoleName(user.role);

  // Directly render the appropriate dashboard based on role
  if (roleName === UserRoleEnum.DRIVER) {
    return <DriverDashboard />;
  } else if (roleName === UserRoleEnum.ADMIN) {
    return <AdminDashboard />;
  } else if (roleName === UserRoleEnum.RESTAURANT_OWNER) {
    return <OwnerDashboard />;
  } else if (roleName === UserRoleEnum.RESTAURANT_STAFF) {
    return <StaffDashboard />;
  } else {
    return <CustomerDashboard />;
  }
};

export default RoleBasedDashboard;