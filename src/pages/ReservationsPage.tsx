import React, { useState } from 'react';
import { LandingLayout } from '../components/layout/LandingLayout';
import { useAppSelector } from '../app/hooks';
import Button from '../components/ui/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUsers, FaEnvelope, FaPhone, FaUser, FaWheelchair, FaChild, FaBirthdayCake, FaHeart } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { useInitializePaymentMutation } from '../features/payments/paymentsApi';
import { useCreateReservationMutation } from '../features/reservations/reservationsApi';
import { PaymentMethod } from '../types/payment';
// import { useToast } from '../contexts/ToastContext'; // Available for future use

const ReservationsPage: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [initializePayment] = useInitializePaymentMutation();
  const [createReservation] = useCreateReservationMutation();
  // showToast is available for future use if needed
  // const { showToast } = useToast();

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

  const USD_TO_KES_RATE = 129.33; // Average 2025 rate as of Dec 8, 2025

  const to24HourTime = (time12h: string): string => {
    // Converts '7:30 PM' -> '19:30'
    const trimmed = (time12h || '').trim();
    const match = trimmed.match(/^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i);
    if (!match) return trimmed; // fallback: already in HH:mm or unknown
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3].toUpperCase();

    if (period === 'AM') {
      hours = hours === 12 ? 0 : hours;
    } else {
      hours = hours === 12 ? 12 : hours + 12;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

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
        const restaurantParam = searchParams.get('restaurant');
        if (!restaurantParam) {
          alert('Please select a restaurant before making a reservation.');
          return;
        }

        // Calculate reservation cost (base price + add-ons) in KSh
        const basePrice = Math.round(50 * USD_TO_KES_RATE); // KSh 6,467
        const addOnPrice = (formData.welcomeDrinks ? Math.round(12 * USD_TO_KES_RATE) : 0) + // KSh 1,552
                          (formData.winePairing ? Math.round(35 * USD_TO_KES_RATE) : 0) + // KSh 4,527
                          (formData.cakeService ? Math.round(25 * USD_TO_KES_RATE) : 0) + // KSh 3,233
                          (formData.specialDecorations ? Math.round(15 * USD_TO_KES_RATE) : 0); // KSh 1,940
        const totalPrice = basePrice + addOnPrice;
        const depositAmount = Math.round(totalPrice * 0.5); // 50% deposit required

        try {
          // 1) Create the actual reservation first so it appears in "My Reservations"
          const combinedRequests = [
            formData.specialRequests,
            formData.seatingPreference ? `Seating: ${formData.seatingPreference}` : '',
            formData.specialOccasion ? `Occasion: ${formData.specialOccasion}` : '',
            formData.dietaryRestrictions ? `Dietary: ${formData.dietaryRestrictions}` : '',
            formData.allergies ? `Allergies: ${formData.allergies}` : '',
            formData.accessibilityNeeds ? 'Accessibility needs: Yes' : '',
            formData.highchair ? 'Highchair: Yes' : '',
            formData.smoking ? `Smoking: ${formData.smoking}` : '',
          ].filter(Boolean).join(' | ');

          const createdReservation = await createReservation({
            // Backend expects numbers, frontend types use string in some places
            restaurantId: Number(restaurantParam) as any,
            userId: Number(user?.id) as any,
            reservationType: 'TABLE' as any,
            reservationDate: formData.date,
            reservationTime: to24HourTime(formData.time),
            guestCount: Number(formData.guests) + Number(formData.children),
            // Backend DTO uses `specialRequest` (singular). Use `any` to support both.
            specialRequest: combinedRequests || undefined,
            depositAmount: depositAmount,
          } as any).unwrap();

          // Initialize payment for 50% deposit
          const paymentResult = await initializePayment({
            userId: user!.id,
            reservationId: (createdReservation as any)?.id,
            amount: depositAmount,
            currency: 'KES',
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
    // Calculate pricing for step 4 and 5 display
    const basePrice = Math.round(50 * USD_TO_KES_RATE); // KSh 6,467
    const welcomeDrinksPrice = Math.round(12 * USD_TO_KES_RATE); // KSh 1,552
    const winePairingPrice = Math.round(35 * USD_TO_KES_RATE); // KSh 4,527
    const cakeServicePrice = Math.round(25 * USD_TO_KES_RATE); // KSh 3,233
    const specialDecorationsPrice = Math.round(15 * USD_TO_KES_RATE); // KSh 1,940
    const addOnPrice = (formData.welcomeDrinks ? welcomeDrinksPrice : 0) +
                      (formData.winePairing ? winePairingPrice : 0) +
                      (formData.cakeService ? cakeServicePrice : 0) +
                      (formData.specialDecorations ? specialDecorationsPrice : 0);
    const totalPrice = basePrice + addOnPrice;
    const depositAmount = Math.round(totalPrice * 0.5);

    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                Reservation Details
              </h3>
              <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full text-sm font-semibold shadow-md">
                Step 1 of 5
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-amber-600 text-lg" />
                  Date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FaClock className="text-amber-600 text-lg" />
                  Time *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 appearance-none bg-no-repeat bg-right pr-10"
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
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FaUsers className="text-amber-600 text-lg" />
                  Number of Adults *
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 appearance-none bg-no-repeat bg-right pr-10"
                  value={formData.guests}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'adult' : 'adults'}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2 italic">For groups larger than 10, please call us directly</p>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dining Duration
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 appearance-none bg-no-repeat bg-right pr-10"
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
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <FaChild className="text-amber-600 text-lg" />
                Children (under 12)
              </label>
              <select
                className="w-full md:w-1/2 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 appearance-none bg-no-repeat bg-right pr-10"
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
              <h3 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                Guest Information
              </h3>
              <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full text-sm font-semibold shadow-md">
                Step 2 of 5
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-amber-600 text-lg" />
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-amber-600 text-lg" />
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-amber-600 text-lg" />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FaPhone className="text-amber-600 text-lg" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+254 (700) 123-4567"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 shadow-sm">
              <p className="text-sm text-slate-700 flex items-center gap-2">
                <span className="text-amber-600">💡</span>
                Your contact information will be used for reservation confirmation and reminders.
                We'll never share your details with third parties.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                Preferences & Special Requests
              </h3>
              <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full text-sm font-semibold shadow-md">
                Step 3 of 5
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Seating Preference
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 appearance-none bg-no-repeat bg-right pr-10"
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Special Occasion
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 appearance-none bg-no-repeat bg-right pr-10"
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  placeholder="e.g., Vegetarian, Vegan, Gluten-free"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Food Allergies
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  placeholder="e.g., Nuts, Shellfish, Dairy"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 h-32 resize-none"
                  placeholder="Any additional requests or notes for our team..."
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <label className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50/50 cursor-pointer transition-all duration-300 hover:shadow-md group">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-amber-600 rounded focus:ring-amber-500 rounded-md"
                  checked={formData.accessibilityNeeds}
                  onChange={(e) => handleInputChange('accessibilityNeeds', e.target.checked)}
                />
                <div className="flex-1">
                  <span className="font-medium text-slate-700">Accessibility Needs</span>
                  <p className="text-sm text-slate-500">Wheelchair access required</p>
                </div>
                <FaWheelchair className="text-slate-400 text-lg ml-auto group-hover:text-amber-600 transition-colors" />
              </label>

              <label className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50/50 cursor-pointer transition-all duration-300 hover:shadow-md group">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-amber-600 rounded focus:ring-amber-500 rounded-md"
                  checked={formData.highchair}
                  onChange={(e) => handleInputChange('highchair', e.target.checked)}
                />
                <div className="flex-1">
                  <span className="font-medium text-slate-700">Highchair/Booster</span>
                  <p className="text-sm text-slate-500">For young children</p>
                </div>
                <FaChild className="text-slate-400 text-lg ml-auto group-hover:text-amber-600 transition-colors" />
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                Add-ons & Confirmation
              </h3>
              <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full text-sm font-semibold shadow-md">
                Step 4 of 5
              </span>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span>Enhance Your Experience</span>
                <span className="text-amber-600">✨</span>
              </h4>
              
              {[
                { id: 'welcomeDrinks', label: 'Welcome Drinks', desc: 'Complimentary welcome cocktails for your party', price: `KSh ${welcomeDrinksPrice.toLocaleString()}/person`, icon: '🍹' },
                { id: 'winePairing', label: 'Wine Pairing', desc: 'Sommelier-selected wine pairing with your meal', price: `KSh ${winePairingPrice.toLocaleString()}/person`, icon: '🍷' },
                { id: 'cakeService', label: 'Cake Service', desc: 'We handle your birthday/celebration cake', price: `KSh ${cakeServicePrice.toLocaleString()} service fee`, icon: '🎂' },
                { id: 'specialDecorations', label: 'Special Decorations', desc: 'Table decorations for special occasions', price: `KSh ${specialDecorationsPrice.toLocaleString()} setup`, icon: '🎉' },
              ].map((addon) => (
                <label key={addon.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50/50 cursor-pointer transition-all duration-300 group hover:shadow-md hover:border-amber-200">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-2xl p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg group-hover:from-amber-200 group-hover:to-amber-300 transition-colors">{addon.icon}</div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">{addon.label}</div>
                      <div className="text-sm text-slate-500">{addon.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-amber-600 font-semibold text-sm">{addon.price}</span>
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-amber-600 rounded focus:ring-amber-500 rounded-md"
                      checked={formData[addon.id as keyof typeof formData] as boolean}
                      onChange={(e) => handleInputChange(addon.id, e.target.checked)}
                    />
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-xl border border-slate-200/50 shadow-sm">
              <h4 className="text-xl font-semibold text-slate-900 mb-4">Reservation Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Date & Time</span>
                  <span className="font-medium text-slate-900">{formData.date} at {formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Guests</span>
                  <span className="font-medium text-slate-900">{formData.guests} adults, {formData.children} children</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duration</span>
                  <span className="font-medium text-slate-900">{formData.duration} hours</span>
                </div>
                {formData.seatingPreference && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Seating Preference</span>
                    <span className="font-medium text-slate-900">
                      {seatingOptions.find(s => s.value === formData.seatingPreference)?.label}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="text-amber-600">⚠️</span>
                    Please arrive 15 minutes before your reservation time. 
                    We hold tables for 15 minutes past the reservation time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                Payment
              </h3>
              <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full text-sm font-semibold shadow-md">
                Step 5 of 5
              </span>
            </div>

            {/* Reservation Summary */}
            <div className="bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-xl p-6 border border-slate-200/50 shadow-sm">
              <h4 className="text-xl font-semibold text-slate-900 mb-4">Reservation Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Base Reservation Fee</span>
                  <span className="text-slate-900">KSh {basePrice.toLocaleString()}</span>
                </div>
                {formData.welcomeDrinks && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Welcome Drinks</span>
                    <span className="text-amber-600">KSh {welcomeDrinksPrice.toLocaleString()}</span>
                  </div>
                )}
                {formData.winePairing && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Wine Pairing</span>
                    <span className="text-amber-600">KSh {winePairingPrice.toLocaleString()}</span>
                  </div>
                )}
                {formData.cakeService && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Cake Service</span>
                    <span className="text-amber-600">KSh {cakeServicePrice.toLocaleString()}</span>
                  </div>
                )}
                {formData.specialDecorations && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Special Decorations</span>
                    <span className="text-amber-600">KSh {specialDecorationsPrice.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span className="text-slate-900">Total Amount</span>
                  <span className="text-slate-900">KSh {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-amber-700 font-bold text-lg bg-amber-50/50 p-2 rounded-lg">
                  <span>Required Deposit (50%)</span>
                  <span>KSh {depositAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span>Payment Policy</span>
                <span className="text-blue-600">ℹ️</span>
              </h4>
              <p className="text-blue-800 text-sm">
                A 50% deposit is required to secure your reservation. The remaining balance will be charged upon completion of your dining experience.
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-slate-900">Select Payment Method</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`border rounded-xl p-4 cursor-pointer transition-all group ${
                  formData.paymentMethod === 'card' ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
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
                    <div className="text-2xl p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">💳</div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">Credit/Debit Card</div>
                      <div className="text-sm text-slate-600">Visa, Mastercard, American Express</div>
                    </div>
                  </div>
                </label>

                <label className={`border rounded-xl p-4 cursor-pointer transition-all group ${
                  formData.paymentMethod === 'mobile_money' ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
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
                    <div className="text-2xl p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg group-hover:from-green-200 group-hover:to-emerald-200 transition-colors">📱</div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">M-Pesa</div>
                      <div className="text-sm text-slate-600">Mobile money payment</div>
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
      <div className="pt-20 min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/20">
        {/* Restaurant Showcase */}
        <div className="relative h-96 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-amber-900/30 z-10" />
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent tracking-tight drop-shadow-2xl">
              Table Reservations
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-center max-w-3xl text-slate-200 leading-relaxed">
              Book your table for an unforgettable dining experience at our award-winning restaurant
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">⭐ 4.8/5 Rating</span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">🏆 Best Fine Dining 2024</span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">🍽️ Chef's Tasting Menu Available</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4, 5].map((stepNum) => (
                  <div key={stepNum} className="flex flex-col items-center flex-1 relative">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 shadow-lg transition-all duration-500
                      ${step >= stepNum ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/25' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}
                    `}>
                      {step > stepNum ? <IoIosArrowForward className="text-sm" /> : stepNum}
                    </div>
                    <span className="text-sm font-medium text-slate-600 text-center">
                      {stepNum === 1 && 'Details'}
                      {stepNum === 2 && 'Guest Info'}
                      {stepNum === 3 && 'Preferences'}
                      {stepNum === 4 && 'Add-ons'}
                      {stepNum === 5 && 'Payment'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 shadow-md"
                  style={{ width: `${(step - 1) * 25}%` }}
                />
              </div>
            </div>

            {/* Main Form Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-100/50">
              <div className="p-8">
                <form onSubmit={handleReservation}>
                  {renderStep()}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                    {step > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="px-8 py-3 text-lg font-semibold border-slate-300 hover:border-amber-400 hover:text-amber-600 transition-all duration-300"
                      >
                        ← Back
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    
                    <Button
                      type="submit"
                      variant="primary"
                      className="px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] flex items-center gap-2"
                    >
                      {step < 5 ? 'Continue' : 'Complete Payment'}
                      {step < 5 && <IoIosArrowForward className="text-white" />}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Restaurant Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-3xl mb-4 animate-pulse">🕒</div>
                <h3 className="font-bold text-xl mb-2">Opening Hours</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between"><span>Monday - Thursday</span><span>5 PM - 10 PM</span></p>
                  <p className="flex justify-between"><span>Friday - Saturday</span><span>5 PM - 11 PM</span></p>
                  <p className="flex justify-between"><span>Sunday</span><span>11 AM - 9 PM</span></p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-3xl mb-4">👥</div>
                <h3 className="font-bold text-xl mb-2">Group Bookings</h3>
                <p className="mb-4 text-sm">For parties of 8 or more, we offer special arrangements:</p>
                <ul className="space-y-2 text-sm">
                  <li>• Private dining area available</li>
                  <li>• Customized tasting menus</li>
                  <li>• Dedicated server</li>
                  <li>• 48-hour cancellation policy</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-3xl mb-4">📞</div>
                <h3 className="font-bold text-xl mb-2">Contact & Policies</h3>
                <div className="space-y-3 text-sm">
                  <p className="font-semibold">+254 (700) 123-4567</p>
                  <p>reservations@restaurant.co.ke</p>
                  <div>
                    <p className="font-semibold">Cancellation Policy:</p>
                    <p>24-hour notice required. Late cancellations may incur a KSh 3,233 fee per person.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Prompt */}
            {!isAuthenticated && step === 1 && (
              <div className="text-center mt-8 p-8 bg-gradient-to-r from-amber-50 to-orange-50/30 rounded-2xl border border-amber-200/50 shadow-lg">
                <p className="text-slate-700 mb-4 text-lg leading-relaxed">
                  Please login or create an account to make a reservation and save your preferences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/login', { state: { from: '/reservations' } })}
                    className="px-8 py-3 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Login to Reserve
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/register')}
                    className="px-8 py-3 text-lg font-semibold border-2 border-slate-300 hover:border-amber-400 hover:text-amber-600 transition-all duration-300"
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
