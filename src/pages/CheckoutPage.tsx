import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clearCart } from '../features/cart/cartSlice';
import { useCreateOrderMutation } from '../features/customer/customerApi';
import Button from '../components/ui/Button';
import { paymentIntegration } from '../utils/paymentIntegration';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [createOrder] = useCreateOrderMutation();

  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState<'DELIVERY' | 'TAKEAWAY'>('DELIVERY');
  const [address, setAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    phone: user?.phone || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = total;
  const tax = subtotal * 0.08;
  const deliveryFee = orderType === 'DELIVERY' ? 2.99 : 0;
  const finalTotal = subtotal + tax + deliveryFee;

  const handleNextStep = () => {
    if (step === 1 && !address.addressLine1) {
      alert('Please enter your address');
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setIsProcessing(true);
    try {
      const paymentResult = await paymentIntegration.initializePayment(
        paymentMethod, 
        finalTotal, 
        'temp-order-id'
      );

      if (!paymentResult.success) {
        throw new Error('Payment initialization failed');
      }

      const orderData = {
        restaurantId: 'restaurant-1',
        orderType: orderType,
        items: items.map(item => ({
          menuItemId: item.id.toString(),
          quantity: item.quantity,
          comment: '',
        })),
        deliveryAddress: orderType === 'DELIVERY' ? address : undefined,
        paymentMethod: paymentMethod,
        paymentReference: paymentResult.reference,
        comment: '',
      };

      const orderResult = await createOrder(orderData).unwrap();
      
      if (paymentMethod !== 'cash') {
        await paymentIntegration.verifyPayment(paymentMethod, paymentResult.reference);
      }

      dispatch(clearCart());
      navigate(`/dashboard/orders/${orderResult.id}/success`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Button
                variant={orderType === 'DELIVERY' ? 'primary' : 'outline'}
                className="h-24"
                onClick={() => setOrderType('DELIVERY')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🚗</div>
                  <div className="font-semibold">Delivery</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Get it delivered to your door</div>
                </div>
              </Button>
              <Button
                variant={orderType === 'TAKEAWAY' ? 'primary' : 'outline'}
                className="h-24"
                onClick={() => setOrderType('TAKEAWAY')}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">🏪</div>
                  <div className="font-semibold">Takeaway</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pick up from restaurant</div>
                </div>
              </Button>
            </div>

            {orderType === 'DELIVERY' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
            
            <div className="space-y-4">
              <Button
                variant={paymentMethod === 'card' ? 'primary' : 'outline'}
                className="w-full justify-start h-16"
                onClick={() => setPaymentMethod('card')}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">💳</div>
                  <div className="text-left">
                    <div className="font-semibold">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pay securely with your card</div>
                  </div>
                </div>
              </Button>

              <Button
                variant={paymentMethod === 'mpesa' ? 'primary' : 'outline'}
                className="w-full justify-start h-16"
                onClick={() => setPaymentMethod('mpesa')}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📱</div>
                  <div className="text-left">
                    <div className="font-semibold">M-Pesa</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pay via M-Pesa mobile money</div>
                  </div>
                </div>
              </Button>

              <Button
                variant={paymentMethod === 'cash' ? 'primary' : 'outline'}
                className="w-full justify-start h-16"
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">💵</div>
                  <div className="text-left">
                    <div className="font-semibold">Cash on Delivery</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive your order</div>
                  </div>
                </div>
              </Button>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Order</h2>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">KSh {(item.price * item.quantity * 100).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-300 dark:border-gray-600 mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>KSh {(subtotal * 100).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>KSh {(tax * 100).toFixed(0)}</span>
                </div>
                {orderType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>KSh {(deliveryFee * 100).toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300 dark:border-gray-600">
                  <span>Total</span>
                  <span>KSh {(finalTotal * 100).toFixed(0)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Delivery Details</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {orderType === 'DELIVERY' ? 'Delivery to:' : 'Pickup from:'}
              </p>
              <p className="font-medium mt-1">
                {orderType === 'DELIVERY' 
                  ? `${address.addressLine1}, ${address.city}, ${address.state}`
                  : 'Restaurant Location'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Contact: {address.phone}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {paymentMethod === 'card' ? '💳' : 
                   paymentMethod === 'mpesa' ? '📱' : '💵'}
                </span>
                <div>
                  <p className="font-medium">
                    {paymentMethod === 'card' ? 'Credit/Debit Card' :
                     paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}
                  </p>
                  {paymentMethod === 'card' && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Card ending in **** 3456</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Add some delicious items to your cart first!</p>
            <Button variant="primary" onClick={() => navigate('/menu')}>
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-700 -z-10">
              <div 
                className="h-1 bg-primary-600 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
            
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNum ? 'bg-primary-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  {stepNum}
                </div>
                <span className={`text-sm mt-2 ${step >= stepNum ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
                  {stepNum === 1 ? 'Delivery' : stepNum === 2 ? 'Payment' : 'Review'}
                </span>
              </div>
            ))}
          </div>

          {/* Checkout Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
              {step > 1 ? (
                <Button variant="outline" onClick={handlePreviousStep}>
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={() => navigate('/cart')}>
                  Back to Cart
                </Button>
              )}
              
              {step < 3 ? (
                <Button variant="primary" onClick={handleNextStep}>
                  Continue
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;