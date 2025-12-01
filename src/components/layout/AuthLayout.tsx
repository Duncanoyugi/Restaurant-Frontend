import React from 'react';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <LandingHeader />
      
      {/* Main Content with Background Image */}
      <main 
        className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative min-h-screen"
        style={{
          backgroundImage: `url('/src/assets/images/restaurant-hall-with-blue-chairs-decors-wall.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Background Overlay with Less Blur */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
        
        <div className="relative w-full max-w-md sm:max-w-lg z-10">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl sm:rounded-2xl border border-white/20">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">SB</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AuthLayout;