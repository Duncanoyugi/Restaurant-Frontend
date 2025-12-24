import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { ShoppingBag, Clock, CheckCircle, XCircle, Truck, Search, Printer, User } from 'lucide-react';

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'dine-in' | 'takeout' | 'delivery';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  deliveryAddress?: string;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

const RestaurantOrders: React.FC = () => {
  const { selectedRestaurant } = useRestaurant();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Fetch orders for the current restaurant
  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedRestaurant) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch orders from backend
        const response = await fetch(`/api/orders/restaurant/${selectedRestaurant.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [selectedRestaurant]);

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      // Refresh orders list
      if (selectedRestaurant) {
        const updatedResponse = await fetch(`/api/orders/restaurant/${selectedRestaurant.id}`);
        const updatedData = await updatedResponse.json();
        setOrders(updatedData);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      console.error('Error updating order status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintOrder = (order: Order) => {
    // In a real application, this would open a print dialog or generate a PDF
    console.log('Printing order:', order.orderNumber);
    alert(`Printing order #${order.orderNumber}`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <Truck className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const calculateTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.totalAmount, 0);
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'delivered';
      case 'delivered': return null;
      case 'cancelled': return null;
      default: return null;
    }
  };

  if (!selectedRestaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Info!</strong>
          <span className="block sm:inline"> Please select a restaurant first.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          Order Management
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 dark:bg-primary-800 p-3 rounded-lg">
                <div className="text-sm text-primary-600 dark:text-primary-300">Total Orders</div>
                <div className="text-2xl font-bold text-primary-700 dark:text-primary-200">{orders.length}</div>
              </div>
              <div className="bg-green-100 dark:bg-green-800 p-3 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-300">Total Revenue</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-200">${calculateTotalRevenue().toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No orders yet. Orders will appear here as customers place them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      Order #{order.orderNumber}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800 dark:text-white">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {order.orderType}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{order.customerName}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePrintOrder(order)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Print Order"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    {expandedOrderId === order.id ? (
                      <button
                        onClick={() => setExpandedOrderId(null)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                        title="Collapse"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setExpandedOrderId(order.id)}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                        title="Expand"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                {expandedOrderId === order.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">{item.name}</div>
                            {item.specialInstructions && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.specialInstructions}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-gray-600 dark:text-gray-300">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </div>
                            <div className="font-medium text-gray-800 dark:text-white">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.deliveryAddress && order.orderType === 'delivery' && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Delivery Address</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{order.deliveryAddress}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Last updated: {new Date(order.updatedAt).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button
                      onClick={() => handleStatusChange(order.id, getNextStatus(order.status) as Order['status'])}
                      disabled={loading || !getNextStatus(order.status)}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      {loading ? (
                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Mark as {getNextStatus(order.status)}
                        </>
                      )}
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'cancelled')}
                      disabled={loading}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;