// src/Dashboard/customer/Rewards.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useGetProfileQuery } from '../../features/auth/authApi';

const Rewards: React.FC = () => {
  const { data: profile } = useGetProfileQuery();

  const loyaltyPoints = (profile as any)?.loyaltyPoints || 0;
  const loyaltyTier = (profile as any)?.loyaltyTier || 'Silver';
  const pointsToNextTier = (profile as any)?.pointsToNextTier || 500;
  const nextTier = (profile as any)?.nextTier || 'Gold';

  const tiers = [
    {
      name: 'Bronze',
      minPoints: 0,
      benefits: ['5% discount on orders', 'Birthday special', 'Early access to promotions'],
      color: 'from-orange-400 to-orange-600',
      icon: '🥉',
    },
    {
      name: 'Silver',
      minPoints: 500,
      benefits: ['10% discount on orders', 'Free delivery', 'Priority support', 'All Bronze benefits'],
      color: 'from-gray-300 to-gray-500',
      icon: '🥈',
    },
    {
      name: 'Gold',
      minPoints: 2000,
      benefits: ['15% discount on orders', 'Complimentary upgrades', 'Exclusive events', 'All Silver benefits'],
      color: 'from-yellow-400 to-yellow-600',
      icon: '🥇',
    },
    {
      name: 'Platinum',
      minPoints: 5000,
      benefits: ['20% discount on orders', 'VIP concierge', 'Personalized experiences', 'All Gold benefits'],
      color: 'from-purple-400 to-purple-600',
      icon: '💎',
    },
  ];

  const recentRewards = [
    {
      id: '1',
      title: 'Birthday Reward',
      description: '20% off your next order',
      expiresIn: '30 days',
      points: 0,
      type: 'special',
    },
    {
      id: '2',
      title: 'Free Delivery',
      description: 'Free delivery on orders over $25',
      expiresIn: 'Never',
      points: 100,
      type: 'reward',
    },
    {
      id: '3',
      title: 'Complimentary Dessert',
      description: 'Get a free dessert with any meal',
      expiresIn: '7 days',
      points: 250,
      type: 'reward',
    },
  ];

  const progressPercentage = ((loyaltyPoints / (loyaltyPoints + pointsToNextTier)) * 100).toFixed(0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rewards & Loyalty</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your points and unlock exclusive benefits
          </p>
        </div>

        {/* Current Status Card */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 mb-6 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-4xl">🏆</span>
                <h2 className="text-3xl font-bold">{loyaltyTier} Member</h2>
              </div>
              <p className="text-primary-100 text-lg mb-4">
                {loyaltyPoints.toLocaleString()} points • {pointsToNextTier.toLocaleString()} to {nextTier}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-md">
                <div className="w-full bg-white/20 rounded-full h-4 mb-2">
                  <div 
                    className="bg-yellow-400 h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-primary-100">
                  {progressPercentage}% to {nextTier} tier
                </p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-primary-100 text-sm mb-2">Available Points</p>
              <p className="text-5xl font-bold">{loyaltyPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Loyalty Tiers */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Membership Tiers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-soft border-2 ${
                  tier.name === loyaltyTier
                    ? 'border-primary-600 dark:border-primary-400'
                    : 'border-gray-200 dark:border-gray-700'
                } overflow-hidden`}
              >
                <div className={`h-2 bg-gradient-to-r ${tier.color}`}></div>
                
                <div className="p-6">
                  <div className="text-center mb-4">
                    <span className="text-4xl mb-2 block">{tier.icon}</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tier.minPoints.toLocaleString()}+ points
                    </p>
                  </div>
                  
                  {tier.name === loyaltyTier && (
                    <div className="mb-4 py-2 px-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-center">
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        Current Tier
                      </span>
                    </div>
                  )}
                  
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Available Rewards
            </h2>
            <Link
              to="/rewards/history"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium"
            >
              View History
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">
                    {reward.type === 'special' ? '🎁' : '🎟️'}
                  </span>
                  {reward.points > 0 && (
                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                      {reward.points} pts
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {reward.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {reward.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Expires in {reward.expiresIn}
                  </span>
                  <button
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    disabled={reward.points > loyaltyPoints}
                  >
                    {reward.points > loyaltyPoints ? 'Locked' : 'Redeem'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            How to Earn Points
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl">🍽️</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Order Food
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Earn 1 point for every $1 spent on orders
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Write Reviews
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get 50 points for each review you write
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Refer Friends
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Earn 200 points for each friend who signs up
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Rewards;