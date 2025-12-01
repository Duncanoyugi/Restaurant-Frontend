import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;