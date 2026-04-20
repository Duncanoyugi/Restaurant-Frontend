import React, { Suspense, lazy } from 'react';
import { useAppSelector } from '../../app/hooks';
import { UserRoleEnum, extractRoleName } from '../../features/auth/authSlice';
import { StaffProvider } from '../../contexts/staff/StaffContext';

const CustomerDashboard = lazy(() => import('../../Dashboard/customer/CustomerDashboard'));
const AdminDashboard = lazy(() => import('../../Dashboard/admin/AdminDashboard'));
const DriverDashboard = lazy(() => import('../../Dashboard/driver/DriverDashboard'));
const StaffDashboard = lazy(() => import('../../Dashboard/staff/StaffDashboard'));
const OwnerDashboard = lazy(() => import('../../Dashboard/owner/OwnerDashboard'));

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
