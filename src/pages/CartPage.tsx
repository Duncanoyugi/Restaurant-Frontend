import React from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const CartPage: React.FC = () => {
  const { items, total } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleQuantityChange = (id: number | string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      showToast('Your cart is empty!', 'warning');
      return;
    }
    navigate('/checkout');
  };

  const tax = total * 0.08;
  const delivery = 299;
  const grandTotal = (total * 100) + (tax * 100) + delivery;

  if (items.length === 0) {
    return (
      <LandingLayout>
        <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/30">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-500/10 to-amber-400/20 rounded-full animate-pulse blur-sm"></div>
                <div className="absolute inset-4 bg-white/80 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center border border-white/50">
                  <span className="text-5xl drop-shadow-md">🛒</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Your cart feels lonely
              </h1>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed max-w-sm mx-auto">
                Add some delicious items from our menu and let's fill it up!
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/menu')}
                className="px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98]"
              >
                <span className="flex items-center gap-2">
                  <span className="rotate-180 transition-transform group-hover:-translate-x-0.5">←</span>
                  Explore Menu
                </span>
              </Button>
            </div>
          </div>
        </div>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/menu')}
              className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-all duration-200 mb-4 group hover:bg-amber-50/50 px-3 py-2 rounded-lg"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span className="font-medium">Continue shopping</span>
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Your Cart
                </h1>
                <p className="text-slate-600 mt-2">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
              </div>
              <button
                onClick={() => dispatch(clearCart())}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <span>🗑️</span>
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100/50 hover:border-amber-200/50"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Item Image */}
                      <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-amber-400/20 rounded-xl overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-orange-400/20 to-amber-500/30 animate-pulse"></div>
                          <div className="absolute inset-0 flex items-center justify-center p-2">
                            <span className="text-3xl drop-shadow-md">🍽️</span>
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg border border-white/30">
                          {item.quantity}x
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xl font-bold text-slate-900 truncate">{item.name}</h3>
                            <p className="text-amber-600 font-bold text-lg mt-1 bg-amber-50/50 px-2 py-1 rounded-md inline-block">
                              KSh {(item.price * 100).toFixed(0)}
                            </p>
                          </div>
                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/80 rounded-xl transition-all duration-200 ml-4 flex-shrink-0 hover:scale-110"
                            aria-label="Remove item"
                          >
                            <span className="text-xl">🗑️</span>
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                              aria-label="Decrease quantity"
                            >
                              <span className="text-xl font-bold">−</span>
                            </button>
                            <span className="font-bold text-lg w-8 text-center text-slate-900 min-w-[2rem]">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                              aria-label="Increase quantity"
                            >
                              <span className="text-xl font-bold">+</span>
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Item total</p>
                            <p className="text-xl font-bold text-slate-900 mt-1">
                              KSh {((item.price * item.quantity) * 100).toFixed(0)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gradient-to-b from-white/90 to-slate-50/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Order Summary
                    </h2>
                    
                    {/* Summary Details */}
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between py-3 border-b border-slate-100 last:border-t">
                        <span className="text-slate-600 font-medium">Subtotal</span>
                        <span className="font-semibold text-slate-900">KSh {(total * 100).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">Tax (8%)</span>
                        <span className="font-semibold text-slate-900">KSh {(tax * 100).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">Delivery</span>
                        <span className="font-semibold text-slate-900">KSh {delivery}</span>
                      </div>
                      <div className="flex justify-between py-4 border-t border-slate-200 pt-6 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-xl p-4">
                        <span className="text-xl font-bold text-slate-900">Total Amount</span>
                        <span className="text-2xl font-bold text-amber-600">KSh {grandTotal.toFixed(0)}</span>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50/30 rounded-xl p-4 mb-6 border border-amber-100/50">
                      <div className="flex items-center justify-around text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl mb-1 animate-bounce">🚚</span>
                          <span className="text-xs text-slate-600 font-medium">Free Delivery</span>
                          <span className="text-xs font-bold text-amber-700">Over 2000</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-2xl mb-1">🛡️</span>
                          <span className="text-xs text-slate-600 font-medium">Secure</span>
                          <span className="text-xs font-bold text-amber-700">Payment</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-2xl mb-1">💳</span>
                          <span className="text-xs text-slate-600 font-medium">Easy</span>
                          <span className="text-xs font-bold text-amber-700">Returns</span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-4">
                      <Button
                        variant="primary"
                        className="w-full py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] border border-amber-400/30"
                        onClick={handleCheckout}
                      >
                        <span className="flex items-center justify-center gap-2">
                          Proceed to Checkout
                          <span className="rotate-180">→</span>
                        </span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full py-4 text-lg font-semibold rounded-xl border-2 hover:border-amber-500 hover:bg-amber-50/80 transition-all duration-300 hover:text-amber-600 active:scale-[0.98]"
                        onClick={() => navigate('/menu')}
                      >
                        Continue Shopping
                      </Button>
                    </div>

                    {/* Estimated Delivery */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-sm text-slate-600 text-center flex items-center justify-center gap-2">
                        <span>🚚</span>
                        Estimated delivery: <span className="font-semibold text-amber-700">30-45 minutes</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default CartPage;