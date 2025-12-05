import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import StaffLayout from '../../components/layout/StaffLayout';
import KitchenDashboard from '../../components/staff/KitchenDashboard';
import StaffOrders from '../../components/staff/StaffOrders';
import TableManagement from '../../components/staff/TableManagement';
import DailyReservations from '../../components/staff/DailyReservations';
import StockOverview from '../../components/staff/StockOverview';

import { useGetMyRestaurantOrdersQuery } from '../../features/orders/ordersApi';
import { useGetRestaurantOrdersTodayQuery } from '../../features/orders/ordersApi';
import { useGetMyRestaurantLowStockItemsQuery } from '../../features/inventory/inventoryApi';
import { useGetDashboardOverviewQuery } from '../../features/analytics/analyticsApi';
import { AnalyticsPeriod } from '../../features/analytics/analyticsApi';

const StaffDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('kitchen');

  // Get restaurant ID from user
  const getRestaurantId = () => {
    const anyUser = user as any;
    return anyUser?.restaurantId || anyUser?.restaurant?.id || anyUser?.restaurantStaff?.restaurantId || '1';
  };

  const restaurantId = getRestaurantId();

  // Fetch real data
  const { data: ordersData } = useGetMyRestaurantOrdersQuery();
  useGetRestaurantOrdersTodayQuery(restaurantId); // Fetch but don't use yet - reservations API needed
  const { data: lowStockData } = useGetMyRestaurantLowStockItemsQuery();
  const { data: analyticsData } = useGetDashboardOverviewQuery({
    period: AnalyticsPeriod.TODAY,
    restaurantId,
  });

  // Calculate stats from real data
  const activeOrders = ordersData?.filter((o: any) => {
    const status = typeof o.status === 'object' ? o.status?.name || o.status?.status : o.status;
    return status?.toLowerCase() !== 'completed' && status?.toLowerCase() !== 'cancelled';
  }).length || 0;

  const todaysReservations = 0; // Would need reservations API endpoint
  const availableTables = 15; // This would need a table management API
  const lowStockItems = lowStockData?.length || 0;
  const todaysRevenue = analyticsData?.revenue?.totalRevenue || 0;

  const staffStats = {
    activeOrders,
    todaysReservations,
    availableTables,
    lowStockItems,
    todaysRevenue,
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff data...</p>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'kitchen':
        return <KitchenDashboard restaurantId={restaurantId} />;
      case 'orders':
        return <StaffOrders restaurantId={restaurantId} />;
      case 'tables':
        return <TableManagement restaurantId={restaurantId} />;
      case 'reservations':
        return <DailyReservations restaurantId={restaurantId} />;
      case 'stock':
        return <StockOverview restaurantId={restaurantId} />;
      default:
        return <KitchenDashboard restaurantId={restaurantId} />;
    }
  };

  return (
    <StaffLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Stats Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Restaurant Staff Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {user.name}!</p>
                </div>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-blue-800">Active Orders</p>
                    <p className="text-xl font-bold text-blue-900">{staffStats.activeOrders}</p>
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-green-800">Today's Reservations</p>
                    <p className="text-xl font-bold text-green-900">{staffStats.todaysReservations}</p>
                  </div>
                  <div className="bg-purple-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-purple-800">Available Tables</p>
                    <p className="text-xl font-bold text-purple-900">{staffStats.availableTables}/15</p>
                  </div>
                  <div className="bg-amber-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-amber-800">Today's Revenue</p>
                    <p className="text-xl font-bold text-amber-900">KSh {staffStats.todaysRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-8">
                <h2 className="font-semibold text-gray-900 mb-4">Restaurant Navigation</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('kitchen')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'kitchen' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className="text-xl">👨‍🍳</span>
                    <span>Kitchen Dashboard</span>
                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      5
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className="text-xl">📋</span>
                    <span>Order Queue</span>
                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {staffStats.activeOrders}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('tables')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'tables' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className="text-xl">🪑</span>
                    <span>Table Management</span>
                    <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {staffStats.availableTables}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('reservations')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'reservations' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className="text-xl">📅</span>
                    <span>Daily Reservations</span>
                    <span className="ml-auto bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {staffStats.todaysReservations}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('stock')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'stock' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <span className="text-xl">📦</span>
                    <span>Stock Overview</span>
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${staffStats.lowStockItems > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {staffStats.lowStockItems} low
                    </span>
                  </button>
                </nav>

                {/* Shift Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Shift</span>
                    <span className="text-sm font-bold text-green-600">Active</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    08:00 - 17:00 • {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {renderActiveTab()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffDashboard;