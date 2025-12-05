import React from 'react';
import { useAppSelector } from '../app/hooks';
import CustomerDashboard from '../Dashboard/customer/CustomerDashboard';
import { UserRoleEnum } from '../features/auth/authSlice';

const HomePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

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
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
    <p className="mt-2 text-gray-600 dark:text-gray-400">Manage restaurants, users, and system settings</p>
    <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
      <p className="text-yellow-800 dark:text-yellow-200">
        🚧 Admin dashboard is under construction. Full features coming soon.
      </p>
    </div>
  </div>
);

const RestaurantOwnerDashboard: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Restaurant Owner Dashboard</h1>
    <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your restaurant and view performance</p>
    <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
      <p className="text-blue-800 dark:text-blue-200">
        🏪 Owner dashboard is under construction. Full features coming soon.
      </p>
    </div>
  </div>
);

const RestaurantStaffDashboard: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Dashboard</h1>
    <p className="mt-2 text-gray-600 dark:text-gray-400">Handle orders and reservations</p>
    <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg">
      <p className="text-green-800 dark:text-green-200">
        👨‍🍳 Staff dashboard is under construction. Full features coming soon.
      </p>
    </div>
  </div>
);

const DriverDashboard: React.FC = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Dashboard</h1>
    <p className="mt-2 text-gray-600 dark:text-gray-400">Manage deliveries and track earnings</p>
    <div className="mt-4 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
      <p className="text-purple-800 dark:text-purple-200">
        🚗 Driver dashboard is under construction. Full features coming soon.
      </p>
    </div>
  </div>
);

export default HomePage;