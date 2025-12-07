import React, { useState } from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { useAppSelector } from '../app/hooks';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUsers, FaEnvelope, FaPhone, FaUser, FaWheelchair, FaChild, FaBirthdayCake, FaHeart } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { useInitializePaymentMutation } from '../features/payments/paymentsApi';
import { PaymentMethod } from '../types/payment';

const ReservationsPage: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [initializePayment] = useInitializePaymentMutation();

  const [step, setStep] = useState(1);
  // Split user's full name into first and last name for form prefill
  const nameParts = user?.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const [formData, setFormData] = useState({
    // Step 1: Reservation Details
    date: '',
    time: '',
    duration: '1.5',
    guests: 2,
    children: 0,

    // Step 2: Guest Information
    firstName: firstName,
    lastName: lastName,
    email: user?.email || '',
    phone: user?.phone || '',

    // Step 3: Preferences & Special Requests
    seatingPreference: '',
    specialOccasion: '',
    specialRequests: '',
    dietaryRestrictions: '',
    allergies: '',
    accessibilityNeeds: false,
    highchair: false,
    smoking: 'non-smoking',

    // Step 4: Add-ons
    welcomeDrinks: false,
    winePairing: false,
    cakeService: false,
    specialDecorations: false,

    // Step 5: Payment
    paymentMethod: 'card' as PaymentMethod,
  });

  // Restaurant photos from Unsplash
  const restaurantPhotos = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=80',
  ];

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', 
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'
  ];

  const occasions = [
    { value: '', label: 'No special occasion' },
    { value: 'birthday', label: 'Birthday', icon: <FaBirthdayCake /> },
    { value: 'anniversary', label: 'Anniversary', icon: <FaHeart /> },
    { value: 'engagement', label: 'Engagement' },
    { value: 'business', label: 'Business Dinner' },
    { value: 'date', label: 'Date Night' },
    { value: 'family', label: 'Family Gathering' },
    { value: 'graduation', label: 'Graduation' },
  ];

  const seatingOptions = [
    { value: '', label: 'No preference' },
    { value: 'window', label: 'Window Table' },
    { value: 'private', label: 'Private Booth' },
    { value: 'outdoor', label: 'Outdoor Patio' },
    { value: 'quiet', label: 'Quiet Area' },
    { value: 'bar', label: 'Bar Seating' },
    { value: 'chef-table', label: "Chef's Table" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/reservations' } });
    } else {
      if (step < 5) {
        setStep(step + 1);
      } else {
        // Calculate reservation cost (base price + add-ons)
        const basePrice = 50; // Base reservation price
        const addOnPrice = (formData.welcomeDrinks ? 12 : 0) +
                          (formData.winePairing ? 35 : 0) +
                          (formData.cakeService ? 25 : 0) +
                          (formData.specialDecorations ? 15 : 0);
        const totalPrice = basePrice + addOnPrice;
        const depositAmount = totalPrice * 0.5; // 50% deposit required

        try {
          // Initialize payment for 50% deposit
          const paymentResult = await initializePayment({
            userId: user!.id,
            amount: depositAmount,
            currency: 'USD',
            method: formData.paymentMethod,
            customerEmail: formData.email,
            customerName: `${formData.firstName} ${formData.lastName}`,
          }).unwrap();

          if (paymentResult.success) {
            // Redirect to payment gateway
            window.location.href = paymentResult.data.authorizationUrl;
          } else {
            alert('Payment initialization failed. Please try again.');
          }
        } catch (error) {
          console.error('Payment initialization error:', error);
          alert('Failed to initialize payment. Please try again.');
        }
      }
    }
  };


  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Reservation Details</h3>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Step 1 of 4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-600" />
                  Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaClock className="text-primary-600" />
                  Time *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUsers className="text-primary-600" />
                  Number of Adults *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.guests}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'adult' : 'adults'}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">For groups larger than 10, please call us directly</p>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dining Duration
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                >
                  <option value="1">1 hour</option>
                  <option value="1.5">1.5 hours</option>
                  <option value="2">2 hours</option>
                  <option value="2.5">2.5 hours</option>
                  <option value="3">3 hours</option>
                </select>
              </div>
            </div>

            {/* Children */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaChild className="text-primary-600" />
                Children (under 12)
              </label>
              <select
                className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                value={formData.children}
                onChange={(e) => handleInputChange('children', parseInt(e.target.value))}
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'child' : 'children'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Guest Information</h3>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Step 2 of 4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-primary-600" />
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-primary-600" />
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-primary-600" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FaPhone className="text-primary-600" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-700">
                💡 Your contact information will be used for reservation confirmation and reminders.
                We'll never share your details with third parties.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Preferences & Special Requests</h3>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Step 3 of 4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seating Preference
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.seatingPreference}
                  onChange={(e) => handleInputChange('seatingPreference', e.target.value)}
                >
                  {seatingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Occasion
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  value={formData.specialOccasion}
                  onChange={(e) => handleInputChange('specialOccasion', e.target.value)}
                >
                  {occasions.map((occasion) => (
                    <option key={occasion.value} value={occasion.value}>
                      {occasion.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., Vegetarian, Vegan, Gluten-free"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Food Allergies
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  placeholder="e.g., Nuts, Shellfish, Dairy"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 h-32"
                  placeholder="Any additional requests or notes for our team..."
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                  checked={formData.accessibilityNeeds}
                  onChange={(e) => handleInputChange('accessibilityNeeds', e.target.checked)}
                />
                <div>
                  <span className="font-medium text-gray-700">Accessibility Needs</span>
                  <p className="text-sm text-gray-500">Wheelchair access required</p>
                </div>
                <FaWheelchair className="text-gray-400 ml-auto" />
              </label>

              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                  checked={formData.highchair}
                  onChange={(e) => handleInputChange('highchair', e.target.checked)}
                />
                <div>
                  <span className="font-medium text-gray-700">Highchair/Booster</span>
                  <p className="text-sm text-gray-500">For young children</p>
                </div>
                <FaChild className="text-gray-400 ml-auto" />
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add-ons & Confirmation</h3>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Step 4 of 5</span>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Enhance Your Experience</h4>
              
              {[
                { id: 'welcomeDrinks', label: 'Welcome Drinks', desc: 'Complimentary welcome cocktails for your party', price: '$12/person', icon: '🍹' },
                { id: 'winePairing', label: 'Wine Pairing', desc: 'Sommelier-selected wine pairing with your meal', price: '$35/person', icon: '🍷' },
                { id: 'cakeService', label: 'Cake Service', desc: 'We handle your birthday/celebration cake', price: '$25 service fee', icon: '🎂' },
                { id: 'specialDecorations', label: 'Special Decorations', desc: 'Table decorations for special occasions', price: '$15 setup', icon: '🎉' },
              ].map((addon) => (
                <label key={addon.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{addon.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900">{addon.label}</div>
                      <div className="text-sm text-gray-500">{addon.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-primary-600 font-semibold">{addon.price}</span>
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
                      checked={formData[addon.id as keyof typeof formData] as boolean}
                      onChange={(e) => handleInputChange(addon.id, e.target.checked)}
                    />
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Reservation Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium">{formData.date} at {formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{formData.guests} adults, {formData.children} children</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{formData.duration} hours</span>
                </div>
                {formData.seatingPreference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seating Preference</span>
                    <span className="font-medium">
                      {seatingOptions.find(s => s.value === formData.seatingPreference)?.label}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm text-gray-500">
                    ⚠️ Please arrive 15 minutes before your reservation time. 
                    We hold tables for 15 minutes past the reservation time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        // Calculate pricing for display
        const basePrice = 50;
        const addOnPrice = (formData.welcomeDrinks ? 12 : 0) +
                          (formData.winePairing ? 35 : 0) +
                          (formData.cakeService ? 25 : 0) +
                          (formData.specialDecorations ? 15 : 0);
        const totalPrice = basePrice + addOnPrice;
        const depositAmount = totalPrice * 0.5;

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Payment</h3>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">Step 5 of 5</span>
            </div>

            {/* Reservation Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Reservation Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Reservation Fee</span>
                  <span>${basePrice}</span>
                </div>
                {formData.welcomeDrinks && (
                  <div className="flex justify-between">
                    <span>Welcome Drinks</span>
                    <span>$12</span>
                  </div>
                )}
                {formData.winePairing && (
                  <div className="flex justify-between">
                    <span>Wine Pairing</span>
                    <span>$35</span>
                  </div>
                )}
                {formData.cakeService && (
                  <div className="flex justify-between">
                    <span>Cake Service</span>
                    <span>$25</span>
                  </div>
                )}
                {formData.specialDecorations && (
                  <div className="flex justify-between">
                    <span>Special Decorations</span>
                    <span>$15</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-primary-600 font-semibold">
                  <span>Required Deposit (50%)</span>
                  <span>${depositAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Payment Policy</h4>
              <p className="text-blue-800 text-sm">
                A 50% deposit is required to secure your reservation. The remaining balance will be charged upon completion of your dining experience.
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Select Payment Method</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  formData.paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">💳</div>
                    <div>
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                    </div>
                  </div>
                </label>

                <label className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  formData.paymentMethod === 'mobile_money' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mobile_money"
                    checked={formData.paymentMethod === 'mobile_money'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📱</div>
                    <div>
                      <div className="font-semibold">M-Pesa</div>
                      <div className="text-sm text-gray-600">Mobile money payment</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <LandingLayout>
      <div className="pt-20 min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Restaurant Showcase */}
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
          <div className="absolute inset-0 flex">
            {restaurantPhotos.map((photo, index) => (
              <div key={index} className="flex-1">
                <img 
                  src={photo} 
                  alt={`Restaurant view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">Table Reservations</h1>
            <p className="text-xl md:text-2xl mb-6 text-center max-w-3xl">
              Book your table for an unforgettable dining experience at our award-winning restaurant
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">⭐ 4.8/5 Rating</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">🏆 Best Fine Dining 2024</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">🍽️ Chef's Tasting Menu Available</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5].map((stepNum) => (
                  <div key={stepNum} className="flex flex-col items-center flex-1">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2
                      ${step >= stepNum ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      {stepNum}
                    </div>
                    <span className="text-sm font-medium">
                      {stepNum === 1 && 'Details'}
                      {stepNum === 2 && 'Guest Info'}
                      {stepNum === 3 && 'Preferences'}
                      {stepNum === 4 && 'Add-ons'}
                      {stepNum === 5 && 'Payment'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all duration-500"
                  style={{ width: `${(step - 1) * 25}%` }}
                />
              </div>
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <form onSubmit={handleReservation}>
                  {renderStep()}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    {step > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                      >
                        ← Back
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    
                    <Button
                      type="submit"
                      variant="primary"
                      className="px-8"
                    >
                      {step < 5 ? 'Continue' : 'Complete Payment'}
                      {step < 5 && <IoIosArrowForward className="ml-2" />}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Restaurant Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl p-6">
                <div className="text-3xl mb-4">🕒</div>
                <h3 className="font-bold text-xl mb-2">Opening Hours</h3>
                <div className="space-y-2">
                  <p className="flex justify-between"><span>Monday - Thursday</span><span>5 PM - 10 PM</span></p>
                  <p className="flex justify-between"><span>Friday - Saturday</span><span>5 PM - 11 PM</span></p>
                  <p className="flex justify-between"><span>Sunday</span><span>11 AM - 9 PM</span></p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white rounded-2xl p-6">
                <div className="text-3xl mb-4">👥</div>
                <h3 className="font-bold text-xl mb-2">Group Bookings</h3>
                <p className="mb-4">For parties of 8 or more, we offer special arrangements:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Private dining area available</li>
                  <li>• Customized tasting menus</li>
                  <li>• Dedicated server</li>
                  <li>• 48-hour cancellation policy</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="font-bold text-xl mb-2">Contact & Policies</h3>
                <div className="space-y-3">
                  <p className="font-semibold">+1 (555) 123-4567</p>
                  <p>reservations@restaurant.com</p>
                  <div className="text-sm">
                    <p className="font-semibold">Cancellation Policy:</p>
                    <p>24-hour notice required. Late cancellations may incur a $25 fee per person.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Prompt */}
            {!isAuthenticated && step === 1 && (
              <div className="text-center mt-8 p-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
                <p className="text-gray-700 mb-4 text-lg">
                  Please login or create an account to make a reservation and save your preferences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/login', { state: { from: '/reservations' } })}
                    className="px-8"
                  >
                    Login to Reserve
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/register')}
                    className="px-8"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default ReservationsPage;