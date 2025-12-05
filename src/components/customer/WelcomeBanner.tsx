import React from 'react';
import { useAppSelector } from '../../app/hooks';

export const WelcomeBanner: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready for a delicious experience?",
      "What culinary adventure awaits today?",
      "Your next favorite meal is just a click away!",
      "Great food and memories start here.",
      "Let's make today delicious!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-primary-100 text-lg mb-4">
            {getMotivationalMessage()}
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              🎯 {(user as any)?.loyaltyTier || 'Silver'} Member
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              ⭐ {user?.averageRating || '4.8'} Rating
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};