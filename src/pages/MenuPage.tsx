import React, { useState, useEffect, useMemo } from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../features/cart/cartSlice';
import { useToast } from '../contexts/ToastContext';
import { useGetCategoriesQuery, useGetMenuItemsQuery } from '../features/menu/menuApi';

const MenuPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch data from API
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError
  } = useGetCategoriesQuery({ active: true });

  const {
    data: menuItemsData,
    isLoading: isMenuItemsLoading,
    error: menuItemsError
  } = useGetMenuItemsQuery({ available: true, limit: 100 }); // Fetch enough items

  const menuItems = menuItemsData?.data || [];
  const isLoading = isCategoriesLoading || isMenuItemsLoading;
  const error = categoriesError || menuItemsError;

  // Transform backend data into nested structure for display
  const structuredMenu = useMemo(() => {
    if (!categories.length || !menuItems.length) return [];

    return categories.map((category) => {
      const categoryItems = menuItems.filter(
        (item) => item.categoryId === category.id
      );
      return {
        ...category,
        items: categoryItems
      };
    }).filter((cat) => cat.items.length > 0); // Only show categories with items
  }, [categories, menuItems]);

  // Set initial selected category when data loads
  useEffect(() => {
    // Only set if not already set
    if (!selectedCategory && structuredMenu.length > 0) {
      // Optional: Auto-select or leave as 'All'
    }
  }, [structuredMenu, selectedCategory]);

  const handleAddToCart = (item: any) => {
    // Ensure we have a valid restaurantId from the item
    if (!item.restaurantId) {
      console.error('Item missing restaurantId:', item);
      showToast('Error adding item: missing restaurant info', 'error');
      return;
    }

    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl,
      restaurantId: item.restaurantId,
      menuItemId: item.id,
    }));
    showToast(`${item.name} added to cart!`, 'success');
  };

  const handleOrder = (item: any) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/menu' } });
    } else {
      handleAddToCart(item);
      const goToCheckout = window.confirm(`${item.name} added to cart! Would you like to proceed to checkout now?`);
      if (goToCheckout) {
        navigate('/cart');
      }
    }
  };

  // Flatten items for "All" view or filter by category
  const categoriesToDisplay = selectedCategory
    ? structuredMenu.filter(cat => cat.id === selectedCategory)
    : structuredMenu;

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/20">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Our Menu
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our carefully curated selection of delicious dishes, crafted with the finest ingredients
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg">Failed to load menu. Please try again later.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              {/* Category Filter */}
              {structuredMenu.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === null
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                      }`}
                  >
                    All
                  </button>
                  {structuredMenu.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category.id
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Menu Items by Category */}
              {categoriesToDisplay.map((category) => (
                <div key={category.id} className="mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 w-2 h-8 rounded-full mr-4"></span>
                    {category.name}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Price and Action */}
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-amber-600">
                              KSh {item.price.toLocaleString()}
                            </span>
                            <Button
                              variant="primary"
                              onClick={() => handleOrder(item)}
                              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            >
                              Order Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {(!categoriesToDisplay || categoriesToDisplay.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">No menu items found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </LandingLayout>
  );
};

export default MenuPage;