import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRestaurantByIdQuery } from '../../features/restaurants/unifiedRestaurantApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Building2, Users, Truck, Utensils, Calendar, Bed, Settings, BarChart3, Bell, PlusCircle, ArrowRight, Home, ChefHat } from 'lucide-react';

const OwnerDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: restaurant, isLoading, error } = useGetRestaurantByIdQuery(id || '', {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 p-8 rounded-2xl shadow-lg">
              <div className="flex items-start">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl mr-4">
                  <Building2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Restaurant</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't load the restaurant data. Please try again or check your connection.</p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => navigate('/restaurants')}
                      className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl"
                    >
                      Back to Restaurants
                    </Button>
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-3 rounded-xl"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 p-8 rounded-2xl shadow-lg">
              <div className="flex items-start">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4">
                  <PlusCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Your Restaurant Dashboard!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">You don't have a restaurant yet. Let's create your first restaurant and start your culinary journey.</p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => navigate('/restaurant-setup')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Setup Your Restaurant
                    </Button>
                    <Button 
                      onClick={() => navigate('/dashboard')}
                      variant="outline"
                      className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-xl"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'Staff Management',
      description: 'Manage your staff members and their roles',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      onClick: () => navigate(`/restaurants/${restaurant.id}/staff`)
    },
    {
      title: 'Driver Management',
      description: 'Manage delivery drivers and assignments',
      icon: Truck,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      onClick: () => navigate(`/restaurants/${restaurant.id}/drivers`)
    },
    {
      title: 'Menu Management',
      description: 'Create and manage your menu items',
      icon: Utensils,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      onClick: () => navigate(`/restaurants/${restaurant.id}/menu`)
    },
    {
      title: 'Reservations',
      description: 'View and manage table reservations',
      icon: Calendar,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      onClick: () => navigate(`/restaurants/${restaurant.id}/reservations`)
    },
    {
      title: 'Accommodations',
      description: 'Manage room bookings and availability',
      icon: Bed,
      color: 'from-indigo-500 to-violet-500',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      onClick: () => navigate(`/restaurants/${restaurant.id}/accommodations`)
    },
    {
      title: 'Reports & Analytics',
      description: 'View sales and performance reports',
      icon: BarChart3,
      color: 'from-gray-600 to-gray-800',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900',
      borderColor: 'border-gray-200 dark:border-gray-700',
      onClick: () => navigate(`/restaurants/${restaurant.id}/reports`)
    },
    {
      title: 'Restaurant Settings',
      description: 'Configure restaurant settings',
      icon: Settings,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      onClick: () => navigate(`/restaurants/${restaurant.id}/settings`)
    },
    {
      title: 'Kitchen Orders',
      description: 'View and manage kitchen orders',
      icon: ChefHat,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      onClick: () => navigate(`/restaurants/${restaurant.id}/kitchen`)
    }
  ];

  const stats = [
    { label: 'Total Staff', value: '0', color: 'text-blue-600', bgColor: 'bg-blue-500/10', icon: Users },
    { label: 'Active Drivers', value: '0', color: 'text-green-600', bgColor: 'bg-green-500/10', icon: Truck },
    { label: 'Menu Items', value: '0', color: 'text-purple-600', bgColor: 'bg-purple-500/10', icon: Utensils },
    { label: 'Today\'s Reservations', value: '0', color: 'text-orange-600', bgColor: 'bg-orange-500/10', icon: Calendar },
    { label: 'Active Orders', value: '0', color: 'text-red-600', bgColor: 'bg-red-500/10', icon: Bell },
    { label: 'Monthly Revenue', value: '$0', color: 'text-emerald-600', bgColor: 'bg-emerald-500/10', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-2xl shadow-lg mr-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {restaurant.name} Dashboard
                  </h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">
                      Restaurant Owner
                    </span>
                    <span className="mx-3">•</span>
                    <span>Manage your restaurant operations</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                variant="outline"
                className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-xl"
              >
                View Restaurant Page
              </Button>
              <Button 
                onClick={() => navigate('/restaurants')}
                className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white px-6 py-3 rounded-xl shadow-lg"
              >
                All Restaurants
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurant Overview</h2>
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                Last 30 days
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">LIVE</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Management Cards Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Management Tools</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {dashboardCards.length} modules available
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dashboardCards.map((card, index) => (
              <div 
                key={index}
                onClick={card.onClick}
                className="group cursor-pointer"
              >
                <Card className={`h-full border-2 ${card.borderColor} ${card.bgColor} hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}>
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">
                      {card.description}
                    </p>
                    
                    <Button 
                      size="sm" 
                      className={`w-full bg-gradient-to-r ${card.color} hover:opacity-90 text-white border-0`}
                    >
                      Access Module
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need Quick Assistance?</h3>
              <p className="text-gray-300">Get instant help or contact our support team</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/30 text-white px-6 py-3 rounded-xl"
              >
                View Tutorials
              </Button>
              <Button 
                className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-xl"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;