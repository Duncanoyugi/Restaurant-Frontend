import React, { useState, useMemo } from 'react';
import { useGetKitchenOrdersQuery, useUpdateOrderStatusMutation } from '../../features/orders/ordersApi';
import { useToast } from '../../contexts/ToastContext';

interface KitchenDashboardProps {
  restaurantId: string;
}

const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ restaurantId }) => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'preparing' | 'ready'>('all');
  
  // Fetch kitchen orders
  const { data: ordersData, isLoading, refetch } = useGetKitchenOrdersQuery({
    restaurantId,
  });
  
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const orders = ordersData || [];

  const getStatusColor = (status: string | any) => {
    const statusName = typeof status === 'object' ? status?.name : status;
    switch (statusName?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'ready': case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to get status ID - accepts order and optional target status name
  const getStatusId = (order: any, newStatusName?: string): string | null => {
    // If we're looking for a specific status (newStatusName), try to find it
    if (newStatusName) {
      // Look in status history first
      if (order.statusHistory) {
        const targetStatus = order.statusHistory.find(
          (history: any) => 
            history.statusCatalog?.name?.toLowerCase() === newStatusName.toLowerCase() ||
            history.status?.toLowerCase() === newStatusName.toLowerCase()
        );
        if (targetStatus?.statusCatalog?.id) {
          return targetStatus.statusCatalog.id;
        }
      }
      
      // Try to find in available statuses if provided
      if (order.availableStatuses) {
        const targetStatus = order.availableStatuses.find(
          (status: any) => status.name?.toLowerCase() === newStatusName.toLowerCase()
        );
        if (targetStatus?.id) {
          return targetStatus.id;
        }
      }
    }
    
    // Fallback to current status ID
    if (order.statusId) {
      return order.statusId;
    }
    
    // Check status object
    const status = order.status;
    if (typeof status === 'object' && status?.id) return status.id;
    
    return null;
  };

  const handleStatusUpdate = async (orderId: string, order: any, newStatusName: string) => {
    try {
      const statusId = getStatusId(order, newStatusName);
      if (!statusId) {
        showToast('Unable to determine status. Please try again.', 'error');
        return;
      }
      await updateOrderStatus({
        id: orderId,
        data: { statusId, notes: `Status updated to ${newStatusName}` },
      }).unwrap();
      showToast('Order status updated successfully', 'success');
      refetch();
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      if (filter === 'all') return true;
      const statusName = typeof order.status === 'object' 
        ? order.status?.name || order.status?.status 
        : order.status;
      return statusName?.toLowerCase() === filter.toLowerCase();
    });
  }, [orders, filter]);

  const calculateElapsedTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    return Math.floor(diffMs / 60000); // Convert to minutes
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Kitchen Dashboard</h2>
        <p className="text-gray-600">Manage food preparation and order status</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {['all', 'pending', 'preparing', 'ready'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/30">
              {orders.filter((o: any) => {
                if (status === 'all') return true;
                const oStatus = typeof o.status === 'object' ? o.status?.name || o.status?.status : o.status;
                return oStatus?.toLowerCase() === status.toLowerCase();
              }).length}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order: any) => {
          const statusName = typeof order.status === 'object' 
            ? order.status?.name || order.status?.status 
            : order.status;
          const elapsedTime = calculateElapsedTime(order.createdAt || order.created_at);
          const customerName = order.user?.name || order.customerName || 'Customer';
          const orderItems = order.orderItems || order.items || [];
          
          return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg">#{order.orderNumber || order.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(statusName)}`}>
                      {statusName?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {order.tableNumber ? `Table ${order.tableNumber}` : order.orderType === 'delivery' ? 'Delivery' : 'Takeaway'} • {customerName}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${elapsedTime > 15 ? 'text-red-600' : 'text-gray-600'}`}>
                    {elapsedTime}m ago
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {orderItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-800">
                      {item.quantity}x {item.menuItem?.name || item.name || 'Item'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {statusName?.toLowerCase() === 'pending' && (
                  <button 
                    onClick={() => handleStatusUpdate(order.id, order, 'preparing')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Start Preparing
                  </button>
                )}
                {(statusName?.toLowerCase() === 'preparing' || statusName?.toLowerCase() === 'in_progress') && (
                  <button 
                    onClick={() => handleStatusUpdate(order.id, order, 'ready')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    Mark as Ready
                  </button>
                )}
                {statusName?.toLowerCase() === 'ready' && (
                  <button 
                    onClick={() => handleStatusUpdate(order.id, order, 'completed')}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                  >
                    Mark as Served
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👨‍🍳</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
          <p className="text-gray-500">No orders match your current filter</p>
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;