import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OwnerLayout from '../../components/layout/OwnerLayout';
import RestaurantKPIs from '../../components/owner/RestaurantKPIs';
import LiveOrders from '../../components/owner/LiveOrders';
import TodayReservations from '../../components/owner/TodayReservation';
import QuickActions from '../../components/owner/QuickActions';
import InventoryAlerts from '../../components/owner/InventoryAlerts';
import StaffOnDuty from '../../components/owner/StaffOnDuty';
import RevenueChart from '../../components/owner/RevenueChart';

import { FaUtensils, FaUsers, FaHotel, FaChartLine, FaStar, FaCog } from 'react-icons/fa';

// Placeholder components for owner sections
const MenuManagement: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Menu Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage restaurant menu items, pricing, and categories
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4 flex justify-center text-orange-500"><FaUtensils /></div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Menu Management System
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Complete menu management including items, categories, pricing, and availability.
      </p>
    </div>
  </div>
);

const StaffManagement: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage staff schedules, roles, and performance
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4 flex justify-center text-blue-500"><FaUsers /></div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Staff Management System
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Complete staff management including scheduling, roles, and performance tracking.
      </p>
    </div>
  </div>
);

const RoomManagement: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Room Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage accommodation rooms, pricing, and availability
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4 flex justify-center text-indigo-500"><FaHotel /></div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Room Management System
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Complete room management including availability, pricing, and booking coordination.
      </p>
    </div>
  </div>
);

const Analytics: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View detailed analytics and generate reports
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4 flex justify-center text-purple-500"><FaChartLine /></div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Analytics Dashboard
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Comprehensive analytics including revenue, customer behavior, and operational metrics.
      </p>
    </div>
  </div>
);

const Reviews: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitor and respond to customer reviews
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4 flex justify-center text-yellow-500"><FaStar /></div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Review Management
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Monitor customer feedback, respond to reviews, and track satisfaction metrics.
      </p>
    </div>
  </div>
);

const Settings: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Restaurant Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure restaurant settings and preferences
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4 flex justify-center text-gray-500"><FaCog /></div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Settings & Configuration
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Configure restaurant settings, operating hours, policies, and system preferences.
      </p>
    </div>
  </div>
);

// Main Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Restaurant Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your restaurant operations and performance
          </p>
        </div>
        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
          Live Operations
        </span>
      </div>

      {/* KPI Cards */}
      <div>
        <RestaurantKPIs />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Live Operations */}
        <div className="lg:col-span-2 space-y-6">
          <LiveOrders />
          <TodayReservations />
        </div>

        {/* Right Column - Quick Actions & Alerts */}
        <div className="space-y-6">
          <QuickActions />
          <InventoryAlerts />
          <StaffOnDuty />
        </div>
      </div>

      {/* Revenue Chart */}
      <div>
        <RevenueChart />
      </div>
    </div>
  );
};

const OwnerDashboard: React.FC = () => {
  return (
    <OwnerLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/reservations" element={<TodayReservations />} />
        <Route path="/rooms" element={<RoomManagement />} />
        <Route path="/orders" element={<LiveOrders />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </OwnerLayout>
  );
};

export default OwnerDashboard;