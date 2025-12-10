import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StaffLayout from '../../components/layout/StaffLayout';
import KitchenDashboard from '../../components/staff/KitchenDashboard';
import StaffOrders from '../../components/staff/StaffOrders';
import TableManagement from '../../components/staff/TableManagement';
import DailyReservations from '../../components/staff/DailyReservations';
import StockOverview from '../../components/staff/StockOverview';
import { FaBox, FaCalendarAlt, FaChair, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { useAppSelector } from '../../app/hooks';

// Helper to get restaurant ID from user
const getRestaurantId = (user: any): string => {
  return user?.restaurantId || 
         user?.restaurant?.id || 
         user?.restaurantStaff?.restaurantId || 
         (user as any)?.restaurantId || 
         '';
};

// Placeholder components for staff sections
const Orders: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const restaurantId = getRestaurantId(user);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Queue</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and process customer orders
          </p>
        </div>
      </div>
      {restaurantId ? <StaffOrders restaurantId={restaurantId} /> : <div>Loading restaurant information...</div>}
    </div>
  );
};

const Tables: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const restaurantId = getRestaurantId(user);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Table Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Assign and manage restaurant tables
          </p>
        </div>
      </div>
      {restaurantId ? <TableManagement restaurantId={restaurantId} /> : <div>Loading restaurant information...</div>}
    </div>
  );
};

const Reservations: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const restaurantId = getRestaurantId(user);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Reservations</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage today's reservations
          </p>
        </div>
      </div>
      {restaurantId ? <DailyReservations restaurantId={restaurantId} /> : <div>Loading restaurant information...</div>}
    </div>
  );
};

const Stock: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const restaurantId = getRestaurantId(user);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor inventory levels and stock alerts
          </p>
        </div>
      </div>
      {restaurantId ? <StockOverview restaurantId={restaurantId} /> : <div>Loading restaurant information...</div>}
    </div>
  );
};

const Reports: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Generate reports and view performance metrics
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4 flex justify-center text-purple-500"><FaChartLine /></div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Reports Dashboard
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Comprehensive reporting tools including sales reports, performance metrics, and operational analytics.
      </p>
    </div>
  </div>
);

const Schedule: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Schedule</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage staff schedules
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
      <div className="text-6xl mb-4 flex justify-center text-blue-500"><FaCalendarAlt /></div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Schedule Management
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Complete staff scheduling system including shift assignments, time-off requests, and schedule optimization.
      </p>
    </div>
  </div>
);

// Main Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const restaurantId = getRestaurantId(user);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage restaurant operations and customer service
          </p>
        </div>
        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
          Shift Active
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
            <div className="text-2xl text-orange-500"><FaBox /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Reservations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="text-2xl text-blue-500"><FaCalendarAlt /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Tables</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8/15</p>
            </div>
            <div className="text-2xl text-green-500"><FaChair /></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">KSh 45,230</p>
            </div>
            <div className="text-2xl text-green-600"><FaMoneyBillWave /></div>
          </div>
        </div>
      </div>

      {/* Kitchen Dashboard */}
      <div>
        {restaurantId ? <KitchenDashboard restaurantId={restaurantId} /> : <div>Loading restaurant information...</div>}
      </div>
    </div>
  );
};

const StaffDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const restaurantId = getRestaurantId(user);
  
  return (
    <StaffLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/kitchen" element={restaurantId ? <KitchenDashboard restaurantId={restaurantId} /> : <div>Loading...</div>} />
        <Route path="/inventory" element={<Stock />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/schedule" element={<Schedule />} />
      </Routes>
    </StaffLayout>
  );
};

export default StaffDashboard;