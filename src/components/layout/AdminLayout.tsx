import React from 'react';
import { useAppSelector } from '../../app/hooks';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  useAppSelector((state) => state.auth);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
};

export default AdminLayout;