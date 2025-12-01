import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

interface DriverLayoutProps {
  children: React.ReactNode;
}

const DriverLayout: React.FC<DriverLayoutProps> = ({ }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple header for now */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Driver Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🚗 Driver Dashboard Under Construction
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Driver dashboard is currently being built. This is a placeholder layout.
            </p>
            <div className="bg-purple-100 dark:bg-purple-900 border border-purple-400 dark:border-purple-600 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-purple-800 dark:text-purple-200 text-sm">
                <strong>Note:</strong> Full Driver features including delivery management, 
                earnings tracking, and route optimization will be available soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverLayout;