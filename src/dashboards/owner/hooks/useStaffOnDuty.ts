import { useState, useEffect } from 'react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  position: string;
  status: string;
  orders: number;
  efficiency: number;
}

export const useStaffOnDuty = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentShift] = useState('Evening (4PM-12AM)');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStaff([
        {
          id: '1',
          name: 'Michael Kimani',
          role: 'manager',
          position: 'Restaurant Manager',
          status: 'active',
          orders: 0,
          efficiency: 95
        },
        {
          id: '2',
          name: 'Susan Akinyi',
          role: 'chef',
          position: 'Head Chef',
          status: 'active',
          orders: 12,
          efficiency: 98
        },
        {
          id: '3',
          name: 'James Mbugua',
          role: 'waiter',
          position: 'Senior Waiter',
          status: 'active',
          orders: 8,
          efficiency: 92
        },
        {
          id: '4',
          name: 'Lucy Wambui',
          role: 'waiter',
          position: 'Wait Staff',
          status: 'break',
          orders: 6,
          efficiency: 88
        },
        {
          id: '5',
          name: 'Peter Otieno',
          role: 'cashier',
          position: 'Cashier',
          status: 'active',
          orders: 15,
          efficiency: 94
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return { staff, loading, currentShift };
};