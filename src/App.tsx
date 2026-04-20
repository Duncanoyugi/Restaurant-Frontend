import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { RestaurantProvider } from './contexts/RestaurantContext';
import ErrorBoundary from './components/ErrorBoundary';
import AppRouter from './routing/AppRouter';

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