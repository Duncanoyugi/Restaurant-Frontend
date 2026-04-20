import React, { useMemo, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DriverLayout from '../../components/layout/DriverLayout';
import DeliveryQueue from '../../components/driver/DeliveryQueue';
import EarningsDashboard from '../../components/driver/EarningsDashboard';
import LocationTracker from '../../components/driver/LocationTracker';
import AvailabilityManager from '../../components/driver/AvailabilityManager';
import { useAppSelector } from '../../app/hooks';
import { useGetMyActiveDeliveriesQuery, useGetMyDeliveryStatsQuery } from '../../features/delivery/deliveryApi';
import { HelpCircle, Truck, CheckCircle2, DollarSign, Star } from 'lucide-react';

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
          Track your current route and keep deliveries updated.
        </p>
      </div>
    </div>
    <LocationTracker />
  </div>
);

const Availability: React.FC<{ isOnline: boolean; setIsOnline: (status: boolean) => void }> = ({
  isOnline,
  setIsOnline,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Availability Status</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your online status and delivery availability
        </p>
      </div>
    </div>
    <AvailabilityManager isOnline={isOnline} setIsOnline={setIsOnline} />
  </div>
);

const Performance: React.FC<{ totalDeliveries: number; onTimeRate: number; averageDeliveryTime: number }> = ({
  totalDeliveries,
  onTimeRate,
  averageDeliveryTime,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Metrics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Delivery performance based on your current activity window
        </p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Deliveries Completed</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{totalDeliveries}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">On-Time Rate</p>
        <p className="mt-2 text-3xl font-semibold text-emerald-600">{onTimeRate}%</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Average Delivery Time</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{averageDeliveryTime} min</p>
      </div>
    </div>
  </div>
);

const Support: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Contact operations when you hit delivery, payment, or safety issues.
        </p>
      </div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8">
      <div className="flex items-center gap-3 mb-4">
        <HelpCircle className="h-10 w-10 text-purple-600" />
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Operations Support</h3>
          <p className="text-gray-600 dark:text-gray-400">Escalate blocked deliveries quickly.</p>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <p>Email: support@restaurant-platform.local</p>
        <p>Hotline: +254 700 000 000</p>
        <p>Use this channel for accidents, unreachable customers, or payout issues.</p>
      </div>
    </div>
  </div>
);

const DashboardOverview: React.FC<{
  isOnline: boolean;
  activeDeliveries: number;
  completedDeliveries: number;
  weekEarnings: number;
  rating: number;
}> = ({ isOnline, activeDeliveries, completedDeliveries, weekEarnings, rating }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Driver Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your deliveries and track your performance
          </p>
        </div>
        <span className={`px-3 py-1 text-sm rounded-full ${isOnline ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
          {isOnline ? 'Online & Available' : 'Offline'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Deliveries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeDeliveries}</p>
            </div>
            <Truck className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed This Week</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedDeliveries}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weekly Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">KSh {weekEarnings.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Driver Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{rating.toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div>
        <DeliveryQueue />
      </div>
    </div>
  );
};

const DriverDashboard: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [isOnline, setIsOnline] = useState(Boolean(user?.isOnline));

  const today = useMemo(() => new Date(), []);
  const weekStart = useMemo(() => {
    const start = new Date(today);
    start.setDate(today.getDate() - 7);
    return start;
  }, [today]);

  const { data: activeDeliveriesData } = useGetMyActiveDeliveriesQuery(user?.id || '', {
    skip: !user?.id,
  });

  const { data: weekStats } = useGetMyDeliveryStatsQuery(
    {
      driverId: user?.id || '',
      startDate: weekStart.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    },
    { skip: !user?.id },
  );

  const activeDeliveries = activeDeliveriesData?.length || 0;
  const completedDeliveries = weekStats?.totalDeliveries || 0;
  const weekEarnings = weekStats?.totalEarnings || 0;
  const onTimeRate = weekStats?.onTimeRate || 0;
  const averageDeliveryTime = weekStats?.averageDeliveryTime || 0;
  const rating = Number(user?.averageRating || 0);

  return (
    <DriverLayout>
      <Routes>
        <Route
          index
          element={
            <DashboardOverview
              isOnline={isOnline}
              activeDeliveries={activeDeliveries}
              completedDeliveries={completedDeliveries}
              weekEarnings={weekEarnings}
              rating={rating}
            />
          }
        />
        <Route path="deliveries" element={<Deliveries />} />
        <Route path="active-orders" element={<Deliveries />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="route" element={<Location />} />
        <Route path="schedule" element={<Availability isOnline={isOnline} setIsOnline={setIsOnline} />} />
        <Route
          path="performance"
          element={
            <Performance
              totalDeliveries={completedDeliveries}
              onTimeRate={onTimeRate}
              averageDeliveryTime={averageDeliveryTime}
            />
          }
        />
        <Route path="support" element={<Support />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DriverLayout>
  );
};

export default DriverDashboard;
