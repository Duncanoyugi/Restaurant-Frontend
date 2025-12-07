import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import KPICards from '../../components/admin/KPICards';
import RevenueChart from '../../components/admin/RevenueChart';
import OrderMetrics from '../../components/admin/OrderMetrics';
import QuickActions from '../../components/admin/QuickActions';
import RecentActivity from '../../components/admin/RecentActivity';
import SystemHealth from '../../components/admin/SystemHealth';
import UserManagement from './UserManagement';
import RestaurantManagement from './RestaurantManagement';
import OrderManagement from './OrderManagement';
import PaymentManagement from './PaymentManagement';
import Deliverymanagement from './Deliverymanagement';
import InventoryOverview from './InventoryOverview';
import ReviewModeration from './ReviewModeration';
import NotificationCenter from './NotificationCenter';

// Main Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            System overview and key metrics
          </p>
        </div>
        <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
          Live System
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div>
        <KPICards />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OrderMetrics />
      </div>

      {/* Quick Actions & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div>
          <SystemHealth />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <RecentActivity />
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/restaurants" element={<RestaurantManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/payments" element={<PaymentManagement />} />
        <Route path="/delivery" element={<Deliverymanagement />} />
        <Route path="/inventory" element={<InventoryOverview />} />
        <Route path="/reviews" element={<ReviewModeration />} />
        <Route path="/notifications" element={<NotificationCenter />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;