import React, { useState, useMemo } from 'react';
import { useGetMyRestaurantOrdersQuery, useUpdateOrderStatusMutation } from '../../features/orders/ordersApi';
import { useAppSelector } from '../../app/hooks';
import { useToast } from '../../contexts/ToastContext';

interface StaffOrdersProps {
  restaurantId: string;
}

const StaffOrders: React.FC<StaffOrdersProps> = ({ restaurantId: _restaurantId }) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'delivery'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch restaurant orders
  const { data: ordersData, isLoading, refetch } = useGetMyRestaurantOrdersQuery(undefined, {
    skip: !isAuthenticated || !user,
  });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const orders = ordersData || [];

  const calculateElapsedTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    return Math.floor(diffMs / 60000);
  };

  // Helper to get status ID
  const getStatusId = (order: any): string | null => {
    if (order.statusId) return order.statusId;
    const status = order.status;
    if (status?.id) return status.id;
    return null;
  };

  const updateOrderStatusHandler = async (orderId: string, order: any, statusName: string) => {
    try {
      const statusId = getStatusId(order);
      if (!statusId) {
        showToast('Unable to determine status. Please try again.', 'error');
        return;
      }
      await updateOrderStatus({
        id: orderId,
        data: { statusId, notes: `Status updated to ${statusName}` },
      }).unwrap();
      showToast('Order status updated successfully', 'success');
      refetch();
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const assignToSelf = async (_orderId: string) => {
    // This would need a backend endpoint for assigning orders to staff
    showToast('Assignment feature coming soon', 'info');
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      if (filter === 'all') return true;
      if (filter === 'delivery') {
        return order.orderType === 'delivery' || order.type === 'delivery';
      }
      const statusName = typeof order.status === 'object' 
        ? order.status?.name || order.status?.status 
        : order.status;
      return statusName?.toLowerCase() === filter.toLowerCase();
    });
  }, [orders, filter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dine_in': return '🪑';
      case 'takeaway': return '🥡';
      case 'delivery': return '🚗';
      default: return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ready': return 'bg-green-100 text-green-800 border-green-300';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Queue</h2>
            <p className="text-gray-600">Manage all incoming orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'preparing', 'ready', 'delivery'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Orders' : status.replace('_', ' ').toUpperCase()}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/30">
              {orders.filter((o: any) => {
                if (status === 'all') return true;
                if (status === 'delivery') {
                  return o.orderType === 'delivery' || o.type === 'delivery';
                }
                const oStatus = typeof o.status === 'object' ? o.status?.name || o.status?.status : o.status;
                return oStatus?.toLowerCase() === status.toLowerCase();
              }).length}
              </span>
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{orders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {orders.filter((o: any) => {
                const status = typeof o.status === 'object' ? o.status?.name || o.status?.status : o.status;
                return status?.toLowerCase() === 'pending';
              }).length}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">
              {orders.filter((o: any) => {
                const status = typeof o.status === 'object' ? o.status?.name || o.status?.status : o.status;
                return status?.toLowerCase() === 'preparing' || status?.toLowerCase() === 'in_progress';
              }).length}
            </div>
            <div className="text-sm text-blue-600">Preparing</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {orders.filter((o: any) => {
                const status = typeof o.status === 'object' ? o.status?.name || o.status?.status : o.status;
                return status?.toLowerCase() === 'ready';
              }).length}
            </div>
            <div className="text-sm text-green-600">Ready</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">
              {orders.filter((o: any) => o.orderType === 'delivery' || o.type === 'delivery').length}
            </div>
            <div className="text-sm text-purple-600">Delivery</div>
          </div>
        </div>
      </div>

      {/* Orders Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onUpdateStatus={updateOrderStatusHandler}
              onAssign={assignToSelf}
              getTypeIcon={getTypeIcon}
              getStatusColor={getStatusColor}
              calculateElapsedTime={calculateElapsedTime}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold">#{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{order.user?.name || 'Customer'}</div>
                    {order.table?.number && (
                      <div className="text-sm text-gray-500">Table {order.table.number}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center">
                      <span className="mr-2">{getTypeIcon(order.orderType || 'DINE_IN')}</span>
                      <span className="capitalize">{(order.orderType || 'DINE_IN').replace('_', ' ').toLowerCase()}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(order.status?.name || '')}`}>
                      {(order.status?.name || 'UNKNOWN').replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(order.orderItems || []).length} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    KSh {order.finalPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${calculateElapsedTime(order.createdAt) > 30 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                      {calculateElapsedTime(order.createdAt)}m ago
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {(() => {
                        const statusName = order.status?.name || '';
                        if (statusName?.toLowerCase() === 'pending') {
                          return (
                            <button
                              onClick={() => updateOrderStatusHandler(order.id, order, 'preparing')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Start
                            </button>
                          );
                        }
                        if (statusName?.toLowerCase() === 'preparing' || statusName?.toLowerCase() === 'in_progress') {
                          return (
                            <button
                              onClick={() => updateOrderStatusHandler(order.id, order, 'ready')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Ready
                            </button>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
          <p className="text-gray-500">No orders match your current filter</p>
        </div>
      )}
    </div>
  );
};

// Reusable Order Card Component
const OrderCard: React.FC<{
  order: any;
  onUpdateStatus: (id: string, order: any, status: string) => void;
  onAssign: (id: string) => void;
  getTypeIcon: (type: string) => string;
  getStatusColor: (status: string) => string;
  calculateElapsedTime: (createdAt: string) => number;
}> = ({ order, onUpdateStatus, getTypeIcon, getStatusColor, calculateElapsedTime }) => {
  const statusName = order.status?.name || '';
  const elapsedTime = calculateElapsedTime(order.createdAt);
  const customerName = order.user?.name || 'Customer';
  const orderType = order.orderType || 'DINE_IN';
  const orderItems = order.orderItems || [];
  
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">#{order.orderNumber || order.id}</span>
              <span className="text-gray-600">{getTypeIcon(orderType)}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{customerName}</div>
            {order.table?.number && (
              <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block mt-1">
                Table {order.table.number}
              </div>
            )}
          </div>
          <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(statusName)}`}>
            {statusName?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items:</span>
            <span className="font-medium">{orderItems.length} items</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">KSh {order.finalPrice?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time:</span>
            <span className={`font-medium ${elapsedTime > 30 ? 'text-red-600' : 'text-gray-900'}`}>
              {elapsedTime}m ago
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            {statusName?.toLowerCase() === 'pending' && (
              <button
                onClick={() => onUpdateStatus(order.id, order, 'preparing')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Start Preparing
              </button>
            )}
            {(statusName?.toLowerCase() === 'preparing' || statusName?.toLowerCase() === 'in_progress') && (
              <button
                onClick={() => onUpdateStatus(order.id, order, 'ready')}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Mark Ready
              </button>
            )}
            {statusName?.toLowerCase() === 'ready' && orderType === 'DELIVERY' && (
              <button
                onClick={() => onUpdateStatus(order.id, order, 'out_for_delivery')}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
              >
                Dispatch
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOrders;