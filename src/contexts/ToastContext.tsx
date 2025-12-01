import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { type ToastType } from '../components/ui/Toast';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
  duration?: number;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false,
    duration: 5000
  });

  const showToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    setToast({
      message,
      type,
      isVisible: true,
      duration
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};