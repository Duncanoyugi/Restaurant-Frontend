import React, { useState, useMemo } from 'react';
import { useGetMyDeliveriesQuery, useUpdateOrderStatusMutation } from '../../features/orders/ordersApi';
import { useToast } from '../../contexts/ToastContext';

const DeliveryQueue: React.FC = () => {
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  // Fetch driver deliveries
  const { data: deliveriesData, isLoading, refetch } = useGetMyDeliveriesQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const deliveries = deliveriesData || [];

  // Helper to get status ID from order and target status name
  const getStatusId = (order: any, targetStatus: string): string | null => {
    // If order has statusId, use it
    if (order.statusId) return order.statusId;
    
    // Try to find status in statusHistory or status object
    const status = order.status || order.statusHistory?.[order.statusHistory.length - 1]?.statusCatalog;
    if (status?.id) return status.id;
    
    // If we have a target status name, try to find matching status
    if (targetStatus) {
      // Look for status in status history that matches targetStatus
      if (order.statusHistory) {
        const matchingStatus = order.statusHistory.find(
          (history: any) => history.statusCatalog?.name?.toLowerCase() === targetStatus.toLowerCase() ||
                         history.status?.toLowerCase() === targetStatus.toLowerCase()
        );
        if (matchingStatus?.statusCatalog?.id) {
          return matchingStatus.statusCatalog.id;
        }
      }
    }
    
    // For now, return null - backend should handle status name to ID mapping
    return null;
  };

  const handleAcceptDelivery = async (orderId: string, order: any) => {
    try {
      const statusId = getStatusId(order, 'accepted');
      if (!statusId) {
        showToast('Unable to determine status. Please try again.', 'error');
        return;
      }
      await updateOrderStatus({
        id: orderId,
        data: { statusId, notes: 'Delivery accepted by driver' },
      }).unwrap();
      showToast('Delivery accepted successfully', 'success');
      refetch();
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to accept delivery', 'error');
    }
  };

  const handleCompleteDelivery = async (orderId: string, order: any) => {
    try {
      const statusId = getStatusId(order, 'delivered');
      if (!statusId) {
        showToast('Unable to determine status. Please try again.', 'error');
        return;
      }
      await updateOrderStatus({
        id: orderId,
        data: { statusId, notes: 'Delivery completed' },
      }).unwrap();
      showToast('Delivery completed successfully', 'success');
      refetch();
    } catch (error: any) {
      showToast(error?.data?.message || 'Failed to complete delivery', 'error');
    }
  };

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery: any) => {
      if (activeFilter === 'all') return true;
      const status = typeof delivery.status === 'object' 
        ? delivery.status?.name || delivery.status?.status 
        : delivery.status;
      if (activeFilter === 'active') {
        return status?.toLowerCase() === 'out_for_delivery' || 
               status?.toLowerCase() === 'in_transit' ||
               status?.toLowerCase() === 'accepted';
      }
      if (activeFilter === 'completed') {
        return status?.toLowerCase() === 'delivered' || 
               status?.toLowerCase() === 'completed';
      }
      return false;
    });
  }, [deliveries, activeFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      active: { color: 'bg-blue-100 text-blue-800', label: 'Active' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      accepted: { color: 'bg-blue-100 text-blue-800', label: 'Accepted' },
      out_for_delivery: { color: 'bg-orange-100 text-orange-800', label: 'Out for Delivery' },
      in_transit: { color: 'bg-purple-100 text-purple-800', label: 'In Transit' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' }
    };
    
    const normalizedStatus = status?.toLowerCase() || 'pending';
    const config = statusConfig[normalizedStatus] || statusConfig.pending;
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>{config.label}</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Queue</h2>
          <p className="text-gray-600">Manage your active and upcoming deliveries</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeFilter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 grid grid-cols-6 gap-4 border-b border-gray-200">
          <div className="font-semibold text-gray-700">Order #</div>
          <div className="font-semibold text-gray-700">Restaurant</div>
          <div className="font-semibold text-gray-700">Customer</div>
          <div className="font-semibold text-gray-700">Details</div>
          <div className="font-semibold text-gray-700">Status</div>
          <div className="font-semibold text-gray-700">Actions</div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredDeliveries.map((delivery: any) => {
            const status = typeof delivery.status === 'object' 
              ? delivery.status?.name || delivery.status?.status 
              : delivery.status;
            const orderItems = delivery.orderItems || delivery.items || [];
            const restaurantName = delivery.restaurant?.name || 'Restaurant';
            const customerName = delivery.user?.name || delivery.customerName || 'Customer';
            const deliveryAddress = delivery.deliveryAddress || delivery.address || 'Address not available';
            
            return (
              <div key={delivery.id} className="px-6 py-4 grid grid-cols-6 gap-4 items-center hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">{delivery.orderNumber || delivery.id}</div>
                  <div className="text-sm text-gray-500">KSh {delivery.totalAmount?.toFixed(2) || '0.00'}</div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900">{restaurantName}</div>
                  <div className="text-sm text-gray-500">{delivery.distance || 'N/A'} away</div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900">{customerName}</div>
                  <div className="text-sm text-gray-500">{deliveryAddress}</div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900">{delivery.estimatedTime || 'N/A'}</div>
                  <div className="text-sm text-gray-500">
                    {orderItems.map((item: any) => 
                      `${item.quantity || 1}x ${item.menuItem?.name || item.name || 'Item'}`
                    ).join(', ')}
                  </div>
                </div>
                
                <div>{getStatusBadge(status)}</div>
                
                <div className="flex space-x-2">
                  {(status?.toLowerCase() === 'pending' || status?.toLowerCase() === 'assigned') && (
                    <button 
                      onClick={() => handleAcceptDelivery(delivery.id, delivery)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Accept
                    </button>
                  )}
                  {(status?.toLowerCase() === 'out_for_delivery' || 
                    status?.toLowerCase() === 'in_transit' || 
                    status?.toLowerCase() === 'accepted' ||
                    status?.toLowerCase() === 'assigned') && (
                    <button 
                      onClick={() => handleCompleteDelivery(delivery.id, delivery)}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Complete
                    </button>
                  )}
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries found</h3>
          <p className="text-gray-600">You don't have any deliveries in this category</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryQueue;