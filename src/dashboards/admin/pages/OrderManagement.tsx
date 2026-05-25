import React, { useState, useMemo } from 'react';
import { FaBox, FaFilter, FaEye, FaEdit, FaTrash, FaTruck } from 'react-icons/fa';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrderMutation } from '@/modules/orders/api/ordersApi';
import type { Order } from '@/shared/types/order';
import { Badge, Button, Loader } from '@/shared/components';
import { Modal } from '@/shared/components/Modal';
import { Table } from '@/shared/components';
import Input from '@/shared/components/input';

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const { data: orders = [], isLoading, error } = useGetAllOrdersQuery({});
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

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
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'preparing':
        return 'primary';
      case 'ready':
        return 'success';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getOrderTypeIcon = (orderType: string) => {
    switch (orderType?.toLowerCase()) {
      case 'delivery':
        return <FaTruck className="text-blue-500" />;
      case 'dine-in':
        return <FaBox className="text-green-500" />;
      case 'takeaway':
        return <FaBox className="text-orange-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus({
        id: orderId,
        status: { statusId: newStatus }
      }).unwrap();
      setShowStatusModal(false);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId).unwrap();
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order #',
      render: (order: Order) => (
        <div className="font-medium text-gray-900 dark:text-white">
          {order.orderNumber}
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order: Order) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {order.user?.firstName} {order.user?.lastName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {order.user?.email}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (order: Order) => (
        <div className="flex items-center gap-2">
          {getOrderTypeIcon(order.orderType)}
          <span className="capitalize">{order.orderType}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order: Order) => (
        <Badge variant={getStatusBadgeVariant(order.status?.name || '')}>
          {order.status?.name}
        </Badge>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (order: Order) => (
        <div className="font-medium text-gray-900 dark:text-white">
          ₦{order.finalPrice?.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (order: Order) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order: Order) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewOrder(order)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEye />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedOrder(order);
              setShowStatusModal(true);
            }}
            className="text-green-600 hover:text-green-800"
          >
            <FaEdit />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteOrder(order.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg font-medium">Error loading orders</div>
        <div className="text-gray-500 mt-2">Please try again later</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage all customer orders across the system
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Orders: {orders.length}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search orders by number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
        <Table
          columns={columns}
          data={filteredOrders}
          emptyMessage="No orders found matching your criteria"
        />
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showOrderDetails}
        onClose={() => setShowOrderDetails(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Order Number:</span> {selectedOrder.orderNumber}</div>
                  <div><span className="font-medium">Type:</span> {selectedOrder.orderType}</div>
                  <div><span className="font-medium">Status:</span> <Badge variant={getStatusBadgeVariant(selectedOrder.status?.name || '')}>{selectedOrder.status?.name}</Badge></div>
                  <div><span className="font-medium">Total:</span> ₦{selectedOrder.finalPrice?.toLocaleString()}</div>
                  <div><span className="font-medium">Created:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</div>
                  <div><span className="font-medium">Email:</span> {selectedOrder.user?.email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedOrder.user?.phoneNumber}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.orderItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium">{item.menuItem?.name}</div>
                      <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                    </div>
                    <div className="font-medium">₦{(item.menuItem?.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Order Status"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Update the status for order #{selectedOrder.orderNumber}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    variant={selectedOrder.status?.name === status ? 'primary' : 'outline'}
                    onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;
