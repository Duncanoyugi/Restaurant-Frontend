import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { removeToast } from '../../features/notifications/notificationsSlice';
import Toast from '../ui/Toast';

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.notifications.toasts);

  return (
    <>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => dispatch(removeToast(toast.id))}
            duration={toast.duration}
          />
        ))}
      </div>
    </>
  );
};

export default ToastProvider;