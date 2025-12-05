import { useState, useEffect } from 'react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  type: string;
  amount: number;
  table?: string;
  items: OrderItem[];
  createdAt: string;
}

export const useLiveOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial API call
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-001',
          customerName: 'Alice Wangari',
          status: 'pending',
          type: 'dine-in',
          amount: 2450,
          table: 'T04',
          items: [
            { name: 'Nyama Choma', quantity: 2, price: 1200 },
            { name: 'Ugali', quantity: 2, price: 200 },
            { name: 'Kachumbari', quantity: 1, price: 150 }
          ],
          createdAt: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          customerName: 'Robert Mwangi',
          status: 'preparing',
          type: 'delivery',
          amount: 1850,
          items: [
            { name: 'Chicken Burger', quantity: 1, price: 850 },
            { name: 'French Fries', quantity: 1, price: 400 },
            { name: 'Coca Cola', quantity: 2, price: 300 }
          ],
          createdAt: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
          id: '3',
          orderNumber: 'ORD-003',
          customerName: 'Grace Otieno',
          status: 'ready',
          type: 'takeaway',
          amount: 3200,
          items: [
            { name: 'Pizza Margherita', quantity: 1, price: 1200 },
            { name: 'Garlic Bread', quantity: 1, price: 400 },
            { name: 'Caesar Salad', quantity: 1, price: 800 },
            { name: 'Red Wine', quantity: 1, price: 800 }
          ],
          createdAt: new Date(Date.now() - 25 * 60000).toISOString()
        }
      ]);
      setLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setOrders(prev => {
        if (prev.length === 0) return prev;
        
        // Randomly update order statuses
        return prev.map(order => {
          const random = Math.random();
          if (random < 0.1) { // 10% chance to change status
            if (order.status === 'pending') {
              return { ...order, status: 'preparing' };
            } else if (order.status === 'preparing' && random < 0.05) {
              return { ...order, status: 'ready' };
            }
          }
          return order;
        });
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (id: string, status: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, status } : order
      )
    );
  };

  return { orders, loading, updateOrderStatus };
};