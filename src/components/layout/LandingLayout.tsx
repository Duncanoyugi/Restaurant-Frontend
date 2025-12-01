import React from 'react';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <LandingHeader />
      <main className="min-h-screen">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
};