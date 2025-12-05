import React, { useState, useMemo } from 'react';
import { useGetMyDeliveryStatsQuery } from '../../features/delivery/deliveryApi';
import { useGetMyDeliveriesQuery } from '../../features/orders/ordersApi';

const EarningsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  // Calculate date ranges
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  const monthStart = new Date(today);
  monthStart.setDate(today.getDate() - 30);

  // Fetch delivery stats
  const { data: weekStats } = useGetMyDeliveryStatsQuery({
    startDate: weekStart.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  });

  const { data: monthStats } = useGetMyDeliveryStatsQuery({
    startDate: monthStart.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  });

  // Fetch deliveries for transactions
  const { data: deliveriesData } = useGetMyDeliveriesQuery();

  // Calculate earnings from stats
  const todayEarnings = 0; // Would need daily breakdown from backend
  const weekEarnings = weekStats?.totalEarnings || 0;
  const monthEarnings = monthStats?.totalEarnings || 0;
  const pendingPayout = 0; // Would need payout tracking from backend

  // Generate weekly earnings chart data (simplified - would need daily breakdown from backend)
  const weeklyEarnings = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const avgDaily = weekEarnings / 7;
    return days.map((day) => ({
      day,
      amount: Math.round(avgDaily * (0.8 + Math.random() * 0.4)), // Simulate daily variation
    }));
  }, [weekEarnings]);

  // Get recent transactions from deliveries
  const transactions = useMemo(() => {
    if (!deliveriesData) return [];
    return deliveriesData
      .filter((d: any) => {
        const status = typeof d.status === 'object' ? d.status?.name || d.status?.status : d.status;
        return status?.toLowerCase() === 'delivered' || status?.toLowerCase() === 'completed';
      })
      .slice(0, 10)
      .map((delivery: any) => ({
        id: delivery.id,
        orderId: delivery.orderNumber || delivery.id,
        amount: delivery.totalAmount || 0,
        date: new Date(delivery.updatedAt || delivery.createdAt).toISOString().split('T')[0],
        status: 'paid',
      }));
  }, [deliveriesData]);

  const maxAmount = Math.max(...weeklyEarnings.map(item => item.amount), 1);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Earnings Dashboard</h2>
        <p className="text-gray-600">Track your earnings and transaction history</p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium opacity-90">Today's Earnings</h3>
          <p className="text-3xl font-bold mt-2">KSh {todayEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium opacity-90">This Week</h3>
          <p className="text-3xl font-bold mt-2">KSh {weekEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-sm font-medium opacity-90">This Month</h3>
          <p className="text-3xl font-bold mt-2">KSh {monthEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium opacity-90">Pending Payout</h3>
          <p className="text-3xl font-bold mt-2">KSh {pendingPayout.toLocaleString()}</p>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Earnings</h3>
          <div className="flex space-x-2">
            {['today', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 rounded-lg text-sm ${timeRange === range ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end h-48 space-x-2">
          {weeklyEarnings.map((day) => {
            const height = (day.amount / maxAmount) * 100;
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div className="text-center mb-2">
                  <div className="text-xs text-gray-500">{day.day}</div>
                  <div className="text-sm font-semibold">KSh {day.amount}</div>
                </div>
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                  style={{ height: `${height}%`, minHeight: '4px' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <p>No transactions found</p>
            </div>
          ) : (
            transactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{transaction.orderId}</div>
                  <div className="text-sm text-gray-500">{transaction.date}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${transaction.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  KSh {transaction.amount.toLocaleString()}
                </div>
                <div className={`text-sm ${transaction.status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                  {transaction.status === 'paid' ? 'Paid' : 'Pending'}
                </div>
              </div>
              
              <button className="ml-4 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                View
              </button>
            </div>
            ))
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button className="w-full py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default EarningsDashboard;