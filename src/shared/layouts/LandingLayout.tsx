import React from 'react';
import LandingHeader from '@/shared/layouts/LandingHeader';
import LandingFooter from '@/shared/layouts/LandingFooter';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] transition-colors duration-300">
      <LandingHeader />
      <main className="flex flex-col gap-0">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
};