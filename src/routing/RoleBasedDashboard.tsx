import React, { Suspense, lazy } from 'react';
import { useAppSelector } from '@/app/hooks';
import { UserRoleEnum, extractRoleName } from '@/modules/auth/api/authSlice';
import { StaffProvider } from '@/dashboards/staff/contexts/StaffContext';

const CustomerDashboard = lazy(() => import('@/dashboards/customer/pages/CustomerDashboard'));
const AdminDashboard = lazy(() => import('@/dashboards/admin/pages/AdminDashboard'));
const DriverDashboard = lazy(() => import('@/dashboards/driver/pages/DriverDashboard'));
const StaffDashboard = lazy(() => import('@/dashboards/staff/pages/StaffDashboard'));
const OwnerDashboard = lazy(() => import('@/dashboards/owner/pages/OwnerDashboard'));

const DashboardLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading dashboard...</p>
    </div>
  </div>
);

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <DashboardLoader />;
  }

  const roleName = extractRoleName(user.role);

  return (
    <Suspense fallback={<DashboardLoader />}>
      {roleName === UserRoleEnum.DRIVER ? (
        <DriverDashboard />
      ) : roleName === UserRoleEnum.ADMIN ? (
        <AdminDashboard />
      ) : roleName === UserRoleEnum.RESTAURANT_OWNER ? (
        <OwnerDashboard />
      ) : roleName === UserRoleEnum.RESTAURANT_STAFF ? (
        <StaffProvider>
          <StaffDashboard />
        </StaffProvider>
      ) : (
        <CustomerDashboard />
      )}
    </Suspense>
  );
};

export default RoleBasedDashboard;
