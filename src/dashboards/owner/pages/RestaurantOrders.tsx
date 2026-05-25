import React, { useState, useEffect, useMemo } from 'react';
import { useRestaurant } from '@/modules/restaurants/contexts/RestaurantContext';
import { ShoppingBag, Clock, CheckCircle, XCircle, Truck, Search, Printer, User } from 'lucide-react';
import { ApiClient } from '@/shared/utils/api';

interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderNumber: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: {
    id: number;
    name: string;
  };
  orderType: 'delivery' | 'dine-in' | 'takeaway';
  deliveryAddress?: string;
  createdAt: string;
  updatedAt: string;
}

const RestaurantOrders: React.FC = () => {
  const { selectedRestaurant } = useRestaurant();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Fetch orders for the current restaurant
  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedRestaurant) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await ApiClient.request<{ data: Order[] }>(`/api/orders/restaurant/${selectedRestaurant.id}`);
        setOrders(response.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [selectedRestaurant]);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || order.status?.name === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await ApiClient.request(`/api/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: { ...order.status, name: newStatus } }
          : order
      ));
      setShowOrderDetails(false);
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status');
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    
    return {
      total: orders.length,
      pending: orders.filter(o => o.status?.name === 'pending').length,
      preparing: orders.filter(o => o.status?.name === 'preparing').length,
      completed: orders.filter(o => ['delivered', 'completed'].includes(o.status?.name?.toLowerCase() || '')).length,
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
    };
  }, [orders]);

  if (!selectedRestaurant) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          Please select a restaurant from the dashboard to view orders.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">Manage orders for {selectedRestaurant.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Preparing</p>
              <p className="text-xl font-bold">{stats.preparing}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Truck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today's Revenue</p>
              <p className="text-xl font-bold">${stats.todayRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            <XCircle className="w-12 h-12 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-2" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-blue-600">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{order.user?.firstName} {order.user?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {order.orderType === 'delivery' ? (
                          <Truck className="w-4 h-4 text-blue-500" />
                        ) : order.orderType === 'takeaway' ? (
                          <ShoppingBag className="w-4 h-4 text-orange-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <span className="capitalize">{order.orderType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeVariant(order.status?.name || '')}`}>
                        {order.status?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <p className="text-gray-600">Order #{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>{' '}
                      <span className="font-medium">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>{' '}
                      <span className="font-medium">{selectedOrder.user?.email}</span>
                    </div>
                    {selectedOrder.user?.phone && (
                      <div>
                        <span className="text-gray-500">Phone:</span>{' '}
                        <span className="font-medium">{selectedOrder.user.phone}</span>
                      </div>
                    )}
                    {selectedOrder.deliveryAddress && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Delivery Address:</span>{' '}
                        <span className="font-medium">{selectedOrder.deliveryAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">{item.menuItemName}</span>
                          <span className="text-gray-500"> x {item.quantity}</span>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${selectedOrder.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                        disabled={selectedOrder.status?.name === status}
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          selectedOrder.status?.name === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
