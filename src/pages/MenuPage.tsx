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
          image: 'https://images.unsplash.com/photo-1527751171053-6ac5ec50000b?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBwZXRpemVyc3xlbnwwfHwwfHx8MA%3D%3D',
          name: 'Tomato Basil Bruschetta',
          description: 'Toasted bread topped with fresh tomato and basil, drizzled with olive oil.',
          price: 14.99,
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YXBwZXRpemVyc3xlbnwwfHwwfHx8MA%3D%3D',
          name: 'Mixed Bites Plate',
          description: 'Several appetizer pieces on one plate — crunchy, fresh, and ready to enjoy.',
          price: 16.99,
        },
        {
          id: 3,
          image: 'https://images.unsplash.com/photo-1706650439799-d4a8894556b6?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFwcGV0aXplcnN8ZW58MHx8MHx8fDA%3D',
          name: 'Snack Platter',
          description: 'A medley of little dishes, perfect as a communal appetiser.',
          price: 16.99,
        },
        {
          id: 4,
          image: 'https://images.unsplash.com/photo-1619869591528-080e2124de44?w=1400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGFwcGV0aXplcnN8ZW58MHx8MHx8fDA%3D',
          name: 'Party Snack Board',
          description: 'A mix of light, flavorful finger foods to whet the appetite.',
          price: 16.99,
        }
      ]
    },
    {
      id: 2,
      name: 'Salads & Bowls',
      items: [
        {
          id: 5,
          image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lZGl0ZXJlbmlhbiUyMHNhbGFkfGVufDB8fDB8fHww',
          name: 'Mediterranean Salad',
          description: 'Fresh greens, olives, feta, cucumber, and tomato with lemon-herb vinaigrette.',
          price: 14.99,
        },
        {
          id: 6,
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FsYWR8ZW58MHx8MHx8fDA%3D',
          name: 'Harvest Grain Bowl',
          description: 'Quinoa, roasted vegetables, avocado, and tahini dressing.',
          price: 16.99,
        },
        {
          id: 7,
          image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Q2Flc2FyJTIwU2FsYWR8ZW58MHx8MHx8fDA%3D',
          name: 'Classic Caesar Salad',
          description: 'Crisp romaine, parmesan, croutons, and creamy Caesar dressing.',
          price: 13.99,
        },
        {
          id: 8,
          image: 'https://images.unsplash.com/photo-1714281121101-fdae2ed0272a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHN0YWVhayUyMGhvdXNlJTIwc2FsYWR8ZW58MHx8MHx8fDA%3D',
          name: 'Steakhouse Salad',
          description: 'Grilled steak strips, mixed greens, blue cheese, and balsamic glaze.',
          price: 18.99,
        }
      ]
    },
    {
      id: 3,
      name: 'Main Courses',
      items: [
        {
          id: 9,
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3RlYWt8ZW58MHx8MHx8fDA%3D',
          name: 'Grilled Ribeye Steak',
          description: 'Prime cut steak with roasted vegetables and red wine sauce',
          price: 32.99,
        },
        {
          id: 10,
          image: 'https://images.unsplash.com/photo-1601556123240-462c758a50db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VHJ1ZmZsZSUyMFBhc3RhfGVufDB8fDB8fHww',
          name: 'Truffle Pasta',
          description: 'Handmade pasta with black truffle and parmesan',
          price: 24.99,
        },
        {
          id: 11,
          image: 'https://images.unsplash.com/photo-1751200884901-c1c6f43ae1d6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fFdvb2QtRmlyZWQlMjBQaXp6YXxlbnwwfHwwfHx8MA%3D%3D',
          name: 'Wood-Fired Pizza',
          description: 'Authentic Italian pizza with fresh ingredients',
          price: 18.99,
        },
        {
          id: 12,
          image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFtYiUyMHNoYW5rc3xlbnwwfHwwfHx8MA%3D%3D',
          name: 'Cooked Braised Lamb Shanks',
          description: 'Tender lamb shanks braised with red wine and herbs',
          price: 28.99,
        },
        {
          id: 13,
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmlzaHxlbnwwfHwwfHx8MA%3D%3D',
          name: 'Cooked Wet Fried Nile Perch Fish',
          description: 'Fresh Nile perch fish fried with spices and served with rice',
          price: 19.99,
        },
        {
          id: 14,
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bG9ic3RlcnxlbnwwfHwwfHx8MA%3D%3D',
          name: 'Restaurant Lobster Tail',
          description: 'Succulent lobster tail with garlic butter sauce',
          price: 34.99,
        },
        {
          id: 15,
          image: 'https://images.unsplash.com/photo-1624153064067-566cae78993d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fEZyaWVkJTIwQ2hpY2tlbnxlbnwwfHwwfHx8MA%3D%3D',
          name: 'Fried Crunchy Chicken',
          description: 'Crispy fried chicken with herbs and spices',
          price: 34.99,
        },
      ]
    },
    {
      id: 4,
      name: 'Sides & Accompaniments',
      items: [
        {
          id: 16,
          image: 'https://plus.unsplash.com/premium_photo-1701098716440-bfde3ffe8087?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2FybGljJTIwbWFzaGVkJTIwcG90YXRvZXN8ZW58MHx8MHx8fDA%3D',
          name: 'Garlic Mashed Potatoes',
          description: 'Creamy mashed potatoes with roasted garlic and herbs.',
          price: 7.99,
        },
        {
          id: 17,
          image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJ1ZmZsZSUyMGZyaWVzfGVufDB8fDB8fHww',
          name: 'Truffle Parmesan Fries',
          description: 'Crispy fries tossed with truffle oil and parmesan.',
          price: 8.99,
        },
        {
          id: 18,
          image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9hc3RlZCUyMHZlZ2V0YWJsZXN8ZW58MHx8MHx8fDA%3D',
          name: 'Seasonal Roasted Vegetables',
          description: 'Farm-fresh vegetables roasted with herbs and olive oil.',
          price: 6.99,
        },
        {
          id: 19,
          image: 'https://plus.unsplash.com/premium_photo-1667807521536-bc35c8d8b64b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjE2fHxHcmlsbGVkJTIwQXNwYXJhZ3VzJTIwZGlzaHxlbnwwfHwwfHx8MA%3D%3D',
          name: 'Grilled Asparagus',
          description: 'Fresh asparagus spears grilled with lemon and sea salt.',
          price: 7.99,
        }
      ]
    },
    {
      id: 5,
      name: "Chef's Specials",
      items: [
        {
          id: 20,
          image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhbmlzaCUyMHBhZWxsYXxlbnwwfHwwfHx8MA%3D%3D',
          name: 'Seafood Paella',
          description: 'Traditional Spanish paella with saffron rice, shrimp, mussels, and chorizo.',
          price: 29.99,
        },
        {
          id: 21,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVlZiUyMHdlbGxpbmd0b258ZW58MHx8MHx8fDA%3D',
          name: 'Beef Wellington',
          description: 'Prime beef tenderloin wrapped in puff pastry with mushroom duxelles.',
          price: 38.99,
        },
        {
          id: 22,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9idXN0ZXIlMjByYXZpb2xpfGVufDB8fDB8fHww',
          name: 'Lobster Ravioli',
          description: 'Homemade ravioli filled with lobster, served in a creamy saffron sauce.',
          price: 26.99,
        }
      ]
    },
    {
      id: 6,
      name: 'Desserts',
      items: [
        {
          id: 23,
          name: 'Chocolate Fondant',
          image: 'https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fENob2NvbGF0ZSUyMEZvbmRhbnR8ZW58MHx8MHx8fDA%3D',
          description: 'Warm chocolate cake with molten center and vanilla ice cream',
          price: 12.99,
        },
        {
          id: 24,
          image: 'https://images.unsplash.com/photo-1704743103071-42f0d84d8af7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fFRpcmFtaXN1fGVufDB8fDB8fHww',
          name: 'Tiramisu',
          description: 'Classic Italian dessert with mascarpone and espresso',
          price: 10.99,
        },
        {
          id: 25,
          image: 'https://images.unsplash.com/photo-1593469348361-5ca3b78288f0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Q3IlQzMlQThtZSUyMEJyJUMzJUJCbCVDMyVBOWV8ZW58MHx8MHx8fDA%3D',
          name: 'Crème Brûlée',
          description: 'Creamy custard with a crisp caramelized top',
          price: 10.99,
        },
        {
          id: 26,
          image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBwbGUlMjBwaWV8ZW58MHx8MHx8fDA%3D',
          name: 'Apple Pie à la Mode',
          description: 'Warm apple pie with cinnamon, served with vanilla ice cream.',
          price: 11.99,
        }
      ]
    },
    {
      id: 7,
      name: 'Drinks',
      items: [
        {
          id: 27,
          name: 'Coca Cola',
          image: 'https://images.unsplash.com/photo-1648569883125-d01072540b4c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvY2ElMjBjb2xhfGVufDB8fDB8fHww',
          description: 'Classic Coca Cola',
          price: 2.99,
        },
        {
          id: 28,
          name: 'Sprite',
          image: 'https://plus.unsplash.com/premium_photo-1721780793069-5576631f1b46?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3ByaXRlJTIwZHJpbmt8ZW58MHx8MHx8fDA%3D',
          description: 'Refreshing lemon-lime soda',
          price: 2.99,
        },
        {
          id: 29,
          image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9ja3RhaWx8ZW58MHx8MHx8fDA%3D',
          name: 'Summer Breeze Mocktail',
          description: 'Refreshing blend of citrus juices with mint and soda.',
          price: 6.99,
        },
        {
          id: 30,
          image: 'https://images.unsplash.com/photo-1610458034932-dc165f29499e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlZCUyMHdpbmV8ZW58MHx8MHx8fDA%3D',
          name: 'House Red Wine',
          description: 'Glass of our selected house red wine.',
          price: 9.99,
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
        image: item.image
      }));

      // Show checkout option
      const goToCheckout = window.confirm(`${item.name} added to cart! Would you like to proceed to checkout now?`);
      if (goToCheckout) {
        navigate('/cart');
      }
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

          {/* Special Banner for Chef's Specials */}
          <div className="mb-12 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 rounded-2xl border border-amber-200 dark:border-amber-700">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  🎯 Today's Chef's Specials
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Exclusive dishes crafted by our head chef with seasonal ingredients
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-semibold">
                  Limited Availability
                </span>
              </div>
            </div>
          </div>

          {/* Menu Categories */}
          {menuCategories.map((category) => (
            <div key={category.id} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center border-b-2 border-primary-200 dark:border-primary-600 pb-2">
                {category.name}
                {category.name === "Chef's Specials" && (
                  <span className="ml-2 text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft hover:shadow-strong transition-all duration-300 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-80 object-cover" />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.name}</h3>
                        <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">KSh {(item.price * 100).toFixed(0)}</span>
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