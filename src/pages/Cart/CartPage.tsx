import React from 'react';
import { LandingLayout } from '../../components/layout/LandingLayout';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../../features/cart/cartSlice';
import Button from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { items, total } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log('Proceeding to checkout with items:', items);
    // You can navigate to a checkout page or show a modal
  };

  if (items.length === 0) {
    return (
      <LandingLayout>
        <div className="pt-20 min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Add some delicious items from our menu!</p>
              <Button variant="primary" onClick={() => navigate('/menu')}>
                Browse Menu
              </Button>
            </div>
          </div>
        </div>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-soft p-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🍽️</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-primary-600 font-semibold">${item.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-red-500 hover:text-red-700 ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>$2.99</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${(total + total * 0.08 + 2.99).toFixed(2)}</span>
                  </div>
                </div>

                <Button variant="primary" className="w-full mb-3" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate('/menu')}>
                  Continue Shopping
                </Button>
                
                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full text-center text-red-500 hover:text-red-700 mt-4"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default CartPage;