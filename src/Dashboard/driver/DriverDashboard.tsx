import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import DriverLayout from '../../components/layout/DriverLayout';
import DeliveryQueue from '../../components/driver/DeliveryQueue';
import EarningsDashboard from '../../components/driver/EarningsDashboard';
import LocationTracker from '../../components/driver/LocationTracker';
import AvailabilityManager from '../../components/driver/AvailabilityManager';
import VehicleManagement from '../../components/driver/VehicleManagement';
import { useGetMyDeliveriesQuery } from '../../features/orders/ordersApi';
import { useGetMyDeliveryStatsQuery } from '../../features/delivery/deliveryApi';

const DriverDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('deliveries');
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);

  // Fetch real data
  const { data: deliveriesData } = useGetMyDeliveriesQuery();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const endDate = new Date();
  const { data: statsData } = useGetMyDeliveryStatsQuery({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  });

  // Calculate stats from real data
  const activeDeliveries = deliveriesData?.filter((d: any) => {
    const status = typeof d.status === 'object' ? d.status?.name || d.status?.status : d.status;
    return status?.toLowerCase() !== 'delivered' && status?.toLowerCase() !== 'completed';
  }).length || 0;

  const completedToday = deliveriesData?.filter((d: any) => {
    const status = typeof d.status === 'object' ? d.status?.name || d.status?.status : d.status;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveryDate = new Date(d.updatedAt || d.updated_at || d.createdAt || d.created_at);
    return (status?.toLowerCase() === 'delivered' || status?.toLowerCase() === 'completed') &&
           deliveryDate >= today;
  }).length || 0;

  const totalEarnings = statsData?.totalEarnings || 0;
  const rating = user?.averageRating || 4.8;
  const onlineHours = 0; // Would need online hours tracking from backend

  const driverStats = {
    activeDeliveries,
    completedToday,
    totalEarnings,
    rating,
    onlineHours,
  };

  // Redirect if not a driver
  useEffect(() => {
    if (user && user.role !== 'Driver') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading driver data...</p>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'deliveries':
        return <DeliveryQueue />;
      case 'earnings':
        return <EarningsDashboard />;
      case 'location':
        return <LocationTracker />;
      case 'availability':
        return <AvailabilityManager isOnline={isOnline} setIsOnline={setIsOnline} />;
      case 'vehicle':
        return <VehicleManagement />;
      default:
        return <DeliveryQueue />;
    }
  };

  return (
    <DriverLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Stats Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {user.name}!</p>
                </div>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-blue-800">Active Deliveries</p>
                    <p className="text-xl font-bold text-blue-900">{driverStats.activeDeliveries}</p>
                  </div>
                  <div className="bg-green-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-green-800">Completed Today</p>
                    <p className="text-xl font-bold text-green-900">{driverStats.completedToday}</p>
                  </div>
                  <div className="bg-purple-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-purple-800">Today's Earnings</p>
                    <p className="text-xl font-bold text-purple-900">KSh {driverStats.totalEarnings.toFixed(2)}</p>
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
                <h2 className="font-semibold text-gray-900 mb-4">Driver Navigation</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('deliveries')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'deliveries' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Delivery Queue</span>
                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {driverStats.activeDeliveries}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('earnings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'earnings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Earnings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('location')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'location' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Location Tracker</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('availability')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'availability' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Availability</span>
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('vehicle')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'vehicle' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Vehicle Management</span>
                  </button>
                </nav>

                {/* Driver Rating */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Driver Rating</span>
                    <span className="text-sm font-bold text-gray-900">{driverStats.rating.toFixed(1)}/5</span>
                  </div>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(driverStats.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
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
    </DriverLayout>
  );
};

export default DriverDashboard;