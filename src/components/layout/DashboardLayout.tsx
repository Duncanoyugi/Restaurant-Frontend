import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { UserRoleEnum, extractRoleName } from '../../features/auth/authSlice';
import CustomerLayout from './CustomerLayout';
import AdminLayout from './AdminLayout';
import OwnerLayout from './OwnerLayout';
import StaffLayout from './StaffLayout';
import DriverLayout from './DriverLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);

  // Safely extract role name
  const roleName = user ? extractRoleName(user.role) : UserRoleEnum.CUSTOMER;

  console.log('DashboardLayout - Role:', roleName);

  const renderLayout = () => {
    switch (roleName) {
      case UserRoleEnum.ADMIN:
        return <AdminLayout>{children}</AdminLayout>;
      case UserRoleEnum.RESTAURANT_OWNER:
        return <OwnerLayout>{children}</OwnerLayout>;
      case UserRoleEnum.RESTAURANT_STAFF:
        return <StaffLayout>{children}</StaffLayout>;
      case UserRoleEnum.DRIVER:
        return <DriverLayout>{children}</DriverLayout>;
      case UserRoleEnum.CUSTOMER:
      default:
        return <CustomerLayout>{children}</CustomerLayout>;
    }
  };

  return renderLayout();
};

export default DashboardLayout;