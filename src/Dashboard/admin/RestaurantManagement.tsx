import React from 'react';
import { FaStore } from 'react-icons/fa';

const RestaurantManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Restaurant Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage restaurant profiles, settings, and operations
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-8 text-center">
        <div className="text-6xl mb-4 flex justify-center text-orange-500">
          <FaStore />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Restaurant Management System
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete restaurant management including profiles, menus, settings, and operational controls.
        </p>
      </div>
    </div>
  );
};

export default RestaurantManagement;