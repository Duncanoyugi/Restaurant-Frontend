import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';
import { ToastProvider } from '@/shared/contexts/ToastContext';
import { RestaurantProvider } from '@/modules/restaurants/contexts/RestaurantContext';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import AppRouter from '@/routing/AppRouter';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <RestaurantProvider>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </RestaurantProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;