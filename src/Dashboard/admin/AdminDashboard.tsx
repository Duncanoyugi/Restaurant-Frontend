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
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-amber-50/30 dark:from-slate-900/50 dark:to-amber-900/20 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg leading-relaxed max-w-md">
            System overview and key metrics at a glance
          </p>
        </div>
        <span className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 self-start sm:self-auto">
          🔴 Live System
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          Key Performance Indicators
          <span className="text-amber-600">📊</span>
        </h2>
        <KPICards />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            Revenue Trends
            <span className="text-amber-600">💰</span>
          </h2>
          <RevenueChart />
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            Order Metrics
            <span className="text-amber-600">📦</span>
          </h2>
          <OrderMetrics />
        </div>
      </div>

      {/* Quick Actions & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            Quick Actions
            <span className="text-amber-600">⚡</span>
          </h2>
          <QuickActions />
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            System Health
            <span className="text-amber-600">🛡️</span>
          </h2>
          <SystemHealth />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          Recent Activity
          <span className="text-amber-600">🕐</span>
        </h2>
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