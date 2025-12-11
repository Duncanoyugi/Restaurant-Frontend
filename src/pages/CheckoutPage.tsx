import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { clearCart } from '../features/cart/cartSlice';
import { useCreateAddressMutation, useCreateOrderMutation, useGetCitiesQuery } from '../features/customer/customerApi';
import { useGetStatesQuery } from '../features/customer/customerApi';
import { useInitializePaymentMutation } from '../features/payments/paymentsApi';
import { PaymentMethod } from '../types/payment';
import Button from '../components/ui/Button';
import { FaCar, FaStore, FaCreditCard, FaMobileAlt, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';

// Type for address
interface AddressState {
  addressLine1: string;
  addressLine2: string;
  cityId: string;
  stateId: string;
  postalCode: string;
  phone: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total, restaurantId: cartRestaurantId } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();

  const [createOrder] = useCreateOrderMutation();
  const [createAddress] = useCreateAddressMutation();
  const { data: cities } = useGetCitiesQuery();
  const { data: states } = useGetStatesQuery();
  const [initializePayment] = useInitializePaymentMutation();

  const [step, setStep] = useState(1);
  const [orderType, setOrderType] = useState<'DELIVERY' | 'TAKEAWAY'>('DELIVERY');

  const [address, setAddress] = useState<AddressState>({
    addressLine1: '',
    addressLine2: '',
    cityId: '',
    stateId: '',
    postalCode: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Ensure address fields are always strings
  const updateAddressField = useCallback((field: keyof AddressState, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value ?? '',
    }));
  }, []);

  // Update phone number from user data
  useEffect(() => {
    if (user?.phone) {
      updateAddressField('phone', user.phone ?? '');
    }
  }, [user?.phone, updateAddressField]);

  // Reset city when state changes
  useEffect(() => {
    if (address.stateId) {
      updateAddressField('cityId', '');
    }
  }, [address.stateId, updateAddressField]);

  // Safe address for input values
  const safeAddress = {
    addressLine1: address.addressLine1 || '',
    addressLine2: address.addressLine2 || '',
    cityId: address.cityId || '',
    stateId: address.stateId || '',
    postalCode: address.postalCode || '',
    phone: address.phone || '',
  };

  // Totals
  const subtotal = total;
  const tax = subtotal * 0.08;
  const deliveryFee = orderType === 'DELIVERY' ? 2.99 : 0;
  const finalTotal = subtotal + tax + deliveryFee;

  const handleNextStep = () => {
    if (step === 1 && orderType === 'DELIVERY') {
      if (!safeAddress.stateId) {
        showToast('Please select a city', 'error');
        return;
      }
      if (!safeAddress.cityId) {
        showToast('Please select an area/town', 'error');
        return;
      }
      if (!safeAddress.addressLine1) {
        showToast('Please enter your address', 'error');
        return;
      }
      if (!safeAddress.postalCode) {
        showToast('Please enter your postal code', 'error');
        return;
      }
      if (!safeAddress.phone) {
        showToast('Please enter your phone number', 'error');
        return;
      }
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
      let deliveryAddressId;

      // For delivery orders, validate address data first
      if (orderType === 'DELIVERY') {
        if (!safeAddress.stateId) {
          showToast('Please select a city', 'error');
          setIsProcessing(false);
          return;
        }
        if (!safeAddress.cityId) {
          showToast('Please select an area/town', 'error');
          setIsProcessing(false);
          return;
        }
        if (!safeAddress.addressLine1) {
          showToast('Please enter your address', 'error');
          setIsProcessing(false);
          return;
        }
        if (!safeAddress.postalCode) {
          showToast('Please enter your postal code', 'error');
          setIsProcessing(false);
          return;
        }
        if (!safeAddress.phone) {
          showToast('Please enter your phone number', 'error');
          setIsProcessing(false);
          return;
        }
        if (!cities || cities.length === 0) {
          showToast('No cities available. Please try again later.', 'error');
          setIsProcessing(false);
          return;
        }

        try {
          // Validate cityId is a valid UUID
          const cityIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!safeAddress.cityId || !cityIdRegex.test(safeAddress.cityId)) {
            showToast('Please select a valid city/area', 'error');
            setIsProcessing(false);
            return;
          }

          const addressData: any = {
            streetAddress1: safeAddress.addressLine1,
            zipCode: safeAddress.postalCode || '00000', // Provide default if empty
            cityId: safeAddress.cityId,
          };

          // Only include optional fields if they have values
          if (safeAddress.addressLine2) {
            addressData.streetAddress2 = safeAddress.addressLine2;
          }
          if (safeAddress.phone) {
            // Note: phone might need to be stored separately if backend supports it
          }
          // deliveryInstructions is optional, only include if needed
          // addressData.deliveryInstructions = '';

          const addressResult = await createAddress(addressData).unwrap();
          deliveryAddressId = addressResult.id;
        } catch (addressError: any) {
          console.error('Failed to create address:', addressError);
          let errorMessage = 'Failed to create delivery address. Please try again.';

          // Handle validation errors from backend
          if (addressError?.data?.message) {
            if (Array.isArray(addressError.data.message)) {
              errorMessage = addressError.data.message.join(', ');
            } else if (typeof addressError.data.message === 'string') {
              errorMessage = addressError.data.message;
            } else if (typeof addressError.data.message === 'object') {
              errorMessage = Object.values(addressError.data.message).flat().join(', ');
            }
          }

          showToast(errorMessage, 'error');
          setIsProcessing(false);
          return;
        }
      }

      // Convert orderType to match backend enum exactly
      // Backend expects: 'delivery', 'takeaway', or 'dine-in'
      let normalizedOrderType: 'delivery' | 'takeaway' | 'dine-in';
      if (orderType === 'DELIVERY') {
        normalizedOrderType = 'delivery';
      } else if (orderType === 'TAKEAWAY') {
        normalizedOrderType = 'takeaway';
      } else {
        normalizedOrderType = 'takeaway'; // Default fallback
      }

      // Create order data
      const restaurantId = (items.length > 0 && items[0].restaurantId) || cartRestaurantId;

      if (!restaurantId) {
        showToast('Missing restaurant information. Please clear cart and try again.', 'error');
        setIsProcessing(false);
        return;
      }

      const orderData = {
        restaurantId: Number(restaurantId), // Ensure it's a number as required by backend
        userId: Number(user.id), // Ensure it's a number as required by backend
        orderType: normalizedOrderType,
        items: items.map(item => ({
          menuItemId: Number((item as any).menuItemId || item.id), // Ensure it's a number
          quantity: item.quantity,
          comment: '',
        })),
        ...(deliveryAddressId && { deliveryAddressId: Number(deliveryAddressId) }),
        comment: '',
      };

      const orderResult = await createOrder(orderData).unwrap();

      if (paymentMethod === 'cash') {
        dispatch(clearCart());
        navigate(`/dashboard/orders/${orderResult.id}/success`);
      } else {
        const paymentResult = await initializePayment({
          userId: user.id,
          orderId: orderResult.id,
          amount: finalTotal,
          customerEmail: user.email,
          customerName: user.name,
          method: paymentMethod as PaymentMethod,
          callbackUrl: `${window.location.origin}/payment/verify`,
        }).unwrap();

        if (paymentResult.success && paymentResult.data.authorizationUrl) {
          dispatch(clearCart());
          window.location.href = paymentResult.data.authorizationUrl;
        } else {
          throw new Error('Failed to get payment authorization URL');
        }
      }
    } catch (error: any) {
      console.error('Failed to place order:', error);
      let errorMessage = 'Failed to place order. Please try again.';

      // Handle validation errors from backend
      if (error?.data?.message) {
        if (Array.isArray(error.data.message)) {
          // If it's an array of validation errors, join them
          errorMessage = error.data.message.join(', ');
        } else if (typeof error.data.message === 'string') {
          // If it's a single string message
          errorMessage = error.data.message;
        } else if (typeof error.data.message === 'object') {
          // If it's an object with multiple error fields
          errorMessage = Object.values(error.data.message).flat().join(', ');
        }
      }

      showToast(errorMessage, 'error');
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
                  <div className="text-3xl mb-2 flex justify-center"><FaCar /></div>
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
                  <div className="text-3xl mb-2 flex justify-center"><FaStore /></div>
                  <div className="font-semibold">Takeaway</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pick up from restaurant</div>
                </div>
              </Button>
            </div>

            {orderType === 'DELIVERY' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <select
                    value={safeAddress.stateId}
                    onChange={(e) => updateAddressField('stateId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select a city</option>
                    {states?.map((state: any) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Area/Town *
                  </label>
                  <select
                    value={safeAddress.cityId}
                    onChange={(e) => updateAddressField('cityId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    disabled={!safeAddress.stateId}
                  >
                    <option value="">Select an area/town</option>
                    {cities?.filter((city: any) => city.stateId === safeAddress.stateId).map((city: any) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={safeAddress.addressLine1}
                    onChange={(e) => updateAddressField('addressLine1', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your street address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Apartment, Suite, etc. (Optional)
                  </label>
                  <input
                    type="text"
                    value={safeAddress.addressLine2}
                    onChange={(e) => updateAddressField('addressLine2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Apartment, suite, unit, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={safeAddress.postalCode}
                    onChange={(e) => updateAddressField('postalCode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter postal code"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={safeAddress.phone}
                    onChange={(e) => updateAddressField('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter phone number"
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
            {['card', 'mpesa', 'cash'].map((method) => (
              <Button
                key={method}
                variant={paymentMethod === method ? 'primary' : 'outline'}
                className="w-full justify-start h-16"
                onClick={() => setPaymentMethod(method)}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {method === 'card' ? <FaCreditCard /> :
                      method === 'mpesa' ? <FaMobileAlt /> :
                        <FaMoneyBillWave />}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{method === 'card' ? 'Credit/Debit Card' : method === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {method === 'card' ? 'Pay securely with your card' : method === 'mpesa' ? 'Pay via M-Pesa mobile money' : 'Pay when you receive your order'}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
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
                    <span className="text-gray-700 dark:text-gray-300">{item.name} × {item.quantity}</span>
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
          </div>
        );

      default:
        return null;
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4 flex justify-center text-gray-400"><FaShoppingCart /></div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Add some delicious items to your cart first!</p>
          <Button variant="primary" onClick={() => navigate('/menu')}>Browse Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-700 -z-10">
            <div className="h-1 bg-primary-600 transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= stepNum ? 'bg-primary-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>{stepNum}</div>
              <span className={`text-sm mt-2 ${step >= stepNum ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>{stepNum === 1 ? 'Delivery' : stepNum === 2 ? 'Payment' : 'Review'}</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 p-8">
          {renderStep()}

          <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <Button variant="outline" onClick={handlePreviousStep}>Back</Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/cart')}>Back to Cart</Button>
            )}

            {step < 3 ? (
              <Button variant="primary" onClick={handleNextStep}>Continue</Button>
            ) : (
              <Button variant="primary" onClick={handlePlaceOrder} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
