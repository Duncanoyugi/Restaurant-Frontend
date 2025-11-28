import React from 'react';
import { useAppSelector } from '../../app/hooks';
import CustomerDashboard from './CustomerDashboard';
import { UserRoleEnum } from '../../features/auth/authSlice';

const HomePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // For now, we'll focus on Customer role
  // You can create separate components for other roles later
  const renderDashboard = () => {
    switch (user?.role) {
      case UserRoleEnum.ADMIN:
        return <AdminDashboard />;
      case UserRoleEnum.RESTAURANT_OWNER:
        return <RestaurantOwnerDashboard />;
      case UserRoleEnum.RESTAURANT_STAFF:
        return <RestaurantStaffDashboard />;
      case UserRoleEnum.DRIVER:
        return <DriverDashboard />;
      case UserRoleEnum.CUSTOMER:
      default:
        return <CustomerDashboard />;
    }
  };

  return renderDashboard();
};

// Placeholder components for other roles
const AdminDashboard: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
    <p className="mt-2 text-gray-600">Manage restaurants, users, and system settings</p>
  </div>
);

const RestaurantOwnerDashboard: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Restaurant Owner Dashboard</h1>
    <p className="mt-2 text-gray-600">Manage your restaurant and view performance</p>
  </div>
);

const RestaurantStaffDashboard: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
    <p className="mt-2 text-gray-600">Handle orders and reservations</p>
  </div>
);

const DriverDashboard: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
    <p className="mt-2 text-gray-600">Manage deliveries and track earnings</p>
  </div>
);

export default HomePage;