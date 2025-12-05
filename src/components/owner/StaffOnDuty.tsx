import React, { useState, useEffect } from 'react';

export const useStaffOnDuty = () => {
  type StaffMember = {
    id: string;
    name: string;
    role: string;
    position: string;
    status: string;
    orders: number;
  };

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentShift, setCurrentShift] = useState<string>('Morning');

  useEffect(() => {
    // Simulate fetching staff on duty (replace with real API call)
    const timer = setTimeout(() => {
      setStaff([
        { id: '1', name: 'Alice Johnson', role: 'manager', position: 'Floor Manager', status: 'active', orders: 3 },
        { id: '2', name: 'Bob Smith', role: 'chef', position: 'Head Chef', status: 'active', orders: 7 },
        { id: '3', name: 'Carol Lee', role: 'waiter', position: 'Server', status: 'break', orders: 1 },
        { id: '4', name: 'Dan Brown', role: 'cashier', position: 'Cashier', status: 'active', orders: 2 }
      ]);
      setLoading(false);
      setCurrentShift('Lunch');
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return { staff, loading, currentShift };
};

const StaffOnDuty: React.FC = () => {
  const { staff, loading, currentShift } = useStaffOnDuty();

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      supervisor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      chef: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      waiter: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cashier: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Staff On Duty
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Shift: {currentShift}
        </div>
      </div>

      <div className="space-y-3">
        {staff.map(member => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                  member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {member.name}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {member.position}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)} mb-1`}>
                {member.status === 'active' ? 'Active' : 'On Break'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {member.orders} orders
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {staff.filter(s => s.status === 'active').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {staff.reduce((sum, member) => sum + member.orders, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOnDuty;