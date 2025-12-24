import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { RestaurantProvider } from './contexts/RestaurantContext';
import AppRouter from './routing/AppRouter';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <RestaurantProvider>
              <AppRouter />
            </RestaurantProvider>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;