import { useState, useEffect } from 'react';

interface InventoryAlert {
  id: string;
  itemName: string;
  currentStock: number;
  threshold: number;
  unit: string;
  level: string;
  supplier?: string;
}

export const useInventoryAlerts = () => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAlerts([
        {
          id: '1',
          itemName: 'Beef Tenderloin',
          currentStock: 2,
          threshold: 10,
          unit: 'kg',
          level: 'critical',
          supplier: 'Prime Meats Ltd'
        },
        {
          id: '2',
          itemName: 'Fresh Basil',
          currentStock: 15,
          threshold: 20,
          unit: 'bunches',
          level: 'warning',
          supplier: 'Green Farms'
        },
        {
          id: '3',
          itemName: 'Parmesan Cheese',
          currentStock: 1,
          threshold: 5,
          unit: 'kg',
          level: 'critical',
          supplier: 'Italian Imports'
        },
        {
          id: '4',
          itemName: 'Truffle Oil',
          currentStock: 3,
          threshold: 2,
          unit: 'bottles',
          level: 'info',
          supplier: 'Gourmet Supplies'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const reorderItem = (id: string) => {
    // Simulate reorder action
    console.log(`Reordering item: ${id}`);
    // In real app, this would call an API
  };

  return { alerts, loading, reorderItem };
};