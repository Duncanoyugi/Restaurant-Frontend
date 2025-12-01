import React from 'react';
import { useAppSelector } from '../../app/hooks';
import RestaurantKPIs from './components/RestaurantKPIs';
import LiveOrders from './components/LiveOrders';
import TodayReservations from './components/TodayReservation';
import QuickActions from './components/QuickActions';
import InventoryAlerts from './components/InventoryAlerts';
import StaffOnDuty from './components/StaffOnDuty';
import RevenueChart from './components/RevenueChart';

const OwnerDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Restaurant Dashboard
              </h1>
              <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                Live
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <div className="mb-8">
          <RestaurantKPIs />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
        <div className="mb-8">
          <RevenueChart />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;