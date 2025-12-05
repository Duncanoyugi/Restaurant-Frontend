import React from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../features/cart/cartSlice';

const MenuPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const menuCategories = [
    {
      id: 1,
      name: 'Appetizers',
      items: [
        {
          id: 1,
          name: 'Truffle Arancini',
          description: 'Crispy risotto balls with black truffle and mozzarella',
          price: 14.99,
        },
        {
          id: 2,
          name: 'Burrata Caprese',
          description: 'Fresh burrata with heirloom tomatoes and basil pesto',
          price: 16.99,
        }
      ]
    },
    {
      id: 2,
      name: 'Main Courses',
      items: [
        {
          id: 3,
          name: 'Grilled Ribeye Steak',
          description: 'Prime cut steak with roasted vegetables and red wine sauce',
          price: 32.99,
        },
        {
          id: 4,
          name: 'Truffle Pasta',
          description: 'Handmade pasta with black truffle and parmesan',
          price: 24.99,
        },
        {
          id: 5,
          name: 'Wood-Fired Pizza',
          description: 'Authentic Italian pizza with fresh ingredients',
          price: 18.99,
        }
      ]
    },
    {
      id: 3,
      name: 'Desserts',
      items: [
        {
          id: 6,
          name: 'Chocolate Fondant',
          description: 'Warm chocolate cake with molten center and vanilla ice cream',
          price: 12.99,
        },
        {
          id: 7,
          name: 'Tiramisu',
          description: 'Classic Italian dessert with mascarpone and espresso',
          price: 10.99,
        }
      ]
    }
  ];

  const handleOrder = (item: any) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/menu' } });
    } else {
      dispatch(addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: '🍽️'
      }));
      alert(`${item.name} added to cart!`);
    }
  };

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Menu
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our exquisite dishes crafted with passion and the finest ingredients
            </p>
          </div>

          {/* Menu Categories */}
          {menuCategories.map((category) => (
            <div key={category.id} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center border-b-2 border-primary-200 dark:border-primary-600 pb-2">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 flex items-center justify-center">
                      <span className="text-5xl">🍽️</span>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
                        <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{item.description}</p>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleOrder(item)}
                      >
                        {isAuthenticated ? 'Add to Order' : 'Login to Order'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Login Prompt */}
          {!isAuthenticated && (
            <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900 rounded-2xl">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Ready to place your order?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Login or create an account to start ordering from our delicious menu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => navigate('/login', { state: { from: '/menu' } })}
                >
                  Login to Order
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LandingLayout>
  );
};

export default MenuPage;