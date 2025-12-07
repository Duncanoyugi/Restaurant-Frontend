import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DriverLayout from '../../components/layout/DriverLayout';
import DeliveryQueue from '../../components/driver/DeliveryQueue';
import EarningsDashboard from '../../components/driver/EarningsDashboard';
import LocationTracker from '../../components/driver/LocationTracker';
import AvailabilityManager from '../../components/driver/AvailabilityManager';

// Placeholder components for driver sections
const Deliveries: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Active Deliveries</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your current delivery assignments
        </p>
      </div>
    </div>
    <DeliveryQueue />
  </div>
);

const Earnings: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earnings Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your earnings and performance metrics
        </p>
      </div>
    </div>
    <EarningsDashboard />
  </div>
);

const Location: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Location Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update your location and track delivery routes
        </p>
      </div>
    </div>
    <LocationTracker />
  </div>
);

const Availability: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Availability Status</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your online status and availability
        </p>
      </div>
    </div>
    <AvailabilityManager isOnline={false} setIsOnline={() => {}} />
  </div>
);


const Performance: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Metrics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View your delivery performance and ratings
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4">📊</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Performance Analytics
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Detailed performance metrics including delivery times, customer ratings, and efficiency scores.
      </p>
    </div>
  </div>
);

const Support: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Get help and support for delivery operations
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4">🆘</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Support Center
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Contact support for technical issues, delivery problems, or general assistance.
      </p>
    </div>
  </div>
);

// Main Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your deliveries and track your performance
          </p>
        </div>
        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
          Online & Available
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Deliveries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
            </div>
            <div className="text-2xl">🚚</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">KSh 2,450</p>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Driver Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div>
        <DeliveryQueue />
      </div>
    </div>
  );
};

const DriverDashboard: React.FC = () => {
  return (
    <DriverLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/deliveries" element={<Deliveries />} />
        <Route path="/active-orders" element={<Deliveries />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/route" element={<Location />} />
        <Route path="/schedule" element={<Availability />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </DriverLayout>
  );
};

export default DriverDashboard;