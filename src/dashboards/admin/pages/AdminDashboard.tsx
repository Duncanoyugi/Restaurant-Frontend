import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '@/shared/layouts/AdminLayout';
import KPICards from '@/dashboards/admin/components/KPICards';
import RevenueChart from '@/dashboards/admin/components/RevenueChart';
import OrderMetrics from '@/dashboards/admin/components/OrderMetrics';
import QuickActions from '@/dashboards/admin/components/QuickActions';
import RecentActivity from '@/dashboards/admin/components/RecentActivity';
import SystemHealth from '@/dashboards/admin/components/SystemHealth';
import { BarChart3, DollarSign, Package, Shield, Zap, Clock, Circle } from 'lucide-react';
import UserManagement from '@/dashboards/admin/pages/UserManagement';
import RestaurantManagement from '@/dashboards/admin/pages/RestaurantManagement';
import OrderManagement from '@/dashboards/admin/pages/OrderManagement';
import PaymentManagement from '@/dashboards/admin/pages/PaymentManagement';
import Deliverymanagement from '@/dashboards/admin/pages/Deliverymanagement';
import InventoryOverview from '@/dashboards/admin/pages/InventoryOverview';
import ReviewModeration from '@/dashboards/admin/pages/ReviewModeration';
import NotificationCenter from '@/dashboards/admin/pages/NotificationCenter';
import ReservationManagement from '@/dashboards/admin/pages/ReservationManagement';
import RoomBookingManagement from '@/dashboards/admin/pages/RoomBookingManagement';

// Main Dashboard Overview Component
const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-linear-to-r from-slate-50 to-amber-50/30 dark:from-slate-900/50 dark:to-amber-900/20 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-300 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg leading-relaxed max-w-md">
            System overview and key metrics at a glance
          </p>
        </div>
        <span className="px-4 py-2 text-sm font-semibold bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 self-start sm:self-auto flex items-center gap-2">
          <Circle className="h-3 w-3 fill-white" />
          Live System
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          Key Performance Indicators
          <BarChart3 className="h-5 w-5 text-amber-600" />
        </h2>
        <KPICards />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            Revenue Trends
            <DollarSign className="h-5 w-5 text-amber-600" />
          </h2>
          <RevenueChart />
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            Order Metrics
            <Package className="h-5 w-5 text-amber-600" />
          </h2>
          <OrderMetrics />
        </div>
      </div>

      {/* Quick Actions & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            Quick Actions
            <Zap className="h-5 w-5 text-amber-600" />
          </h2>
          <QuickActions />
        </div>
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            System Health
            <Shield className="h-5 w-5 text-amber-600" />
          </h2>
          <SystemHealth />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          Recent Activity
          <Clock className="h-5 w-5 text-amber-600" />
        </h2>
        <RecentActivity />
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  console.log('📍 AdminDashboard component rendered');

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="restaurants" element={<RestaurantManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="reservations" element={<ReservationManagement />} />
        <Route path="room-bookings" element={<RoomBookingManagement />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="delivery" element={<Deliverymanagement />} />
        <Route path="inventory" element={<InventoryOverview />} />
        <Route path="reviews" element={<ReviewModeration />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="*" element={
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-bold text-red-800">Page Not Found (Debug Mode)</h3>
            <p className="text-red-700">The requested path was not found in the Admin Dashboard routes.</p>
            <div className="mt-2 p-2 bg-white rounded border border-red-100 font-mono text-sm">
              Current Location: {window.location.pathname}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Tried to match path "users" against current URL.
              If you see this, the router failed to match the nested route.
            </p>
          </div>
        } />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;