import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { UserRoleEnum, extractRoleName } from '@/modules/auth/api/authSlice';
import CustomerLayout from '@/shared/layouts/CustomerLayout';
import AdminLayout from '@/shared/layouts/AdminLayout';
import OwnerLayout from '@/shared/layouts/OwnerLayout';
import StaffLayout from '@/shared/layouts/StaffLayout';
import DriverLayout from '@/shared/layouts/DriverLayout';

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