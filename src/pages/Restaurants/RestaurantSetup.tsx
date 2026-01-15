import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useCreateRestaurantMutation } from '../../features/restaurants/unifiedRestaurantApi';
import { useGetAllCitiesQuery } from '../../features/location/locationApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { Building2, MapPin, Phone, Mail, Clock, Globe, FileText, ChevronRight, Sparkles, CheckCircle } from 'lucide-react';
import { validatePhone } from '../../utils/validators';

const RestaurantSetup: React.FC = () => {
  const navigate = useNavigate();
  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();
  const { data: cities = [], isLoading: citiesLoading } = useGetAllCitiesQuery();
  const user = useSelector((state: RootState) => state.auth.user);
  const [phoneError, setPhoneError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  console.log('RestaurantSetup component rendered');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    streetAddress: '',
    zipCode: '',
    latitude: 0,
    longitude: 0,
    openingTime: '09:00',
    closingTime: '22:00',
    cityId: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' || name === 'cityId' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone
    if (!validatePhone(formData.phone)) {
      setPhoneError('Please enter a valid phone number (e.g., +254712345678)');
      return;
    }
    setPhoneError('');
    
    if (!user?.id) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    try {
      const restaurantData = {
        ...formData,
        ownerId: typeof user.id === 'string' ? parseInt(user.id, 10) : user.id,
      };
      const result = await createRestaurant(restaurantData).unwrap();
      // Redirect to owner dashboard with the new restaurant ID
      navigate(`/restaurants/${result.id}/owner`);
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      alert('Failed to create restaurant. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStep1Valid = () => {
    return formData.name && formData.description && formData.email && validatePhone(formData.phone);
  };

  const isStep2Valid = () => {
    return formData.streetAddress && formData.cityId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <div className="inline-block p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl mb-6">
              <Building2 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Setup Your Restaurant
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Complete these steps to launch your restaurant on our platform
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep >= step 
                          ? 'bg-gradient-to-r from-primary to-primary/80 border-primary text-white' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400'
                      }`}>
                        {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                      </div>
                      <span className={`mt-2 text-sm font-medium ${
                        currentStep >= step 
                          ? 'text-primary dark:text-primary' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step === 1 ? 'Basic Info' : step === 2 ? 'Location' : 'Schedule'}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className={`w-20 h-1 rounded-full ${
                        currentStep > step 
                          ? 'bg-gradient-to-r from-primary to-primary/80' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Form Container */}
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl mr-4">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
                        <p className="text-gray-600 dark:text-gray-400">Tell us about your restaurant</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <span className="flex items-center">
                            <Building2 className="w-4 h-4 mr-2" />
                            Restaurant Name *
                          </span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Savory Bites Restaurant"
                          className="h-12 bg-gray-50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Address *
                          </span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="contact@restaurant.com"
                          className="h-12 bg-gray-50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            Phone Number *
                          </span>
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            handleChange(e);
                            if (phoneError) setPhoneError('');
                          }}
                          required
                          placeholder="+254712345678"
                          error={phoneError}
                          className="h-12 bg-gray-50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-primary/20"
                        />
                        {phoneError && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{phoneError}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <span className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            ZIP Code
                          </span>
                        </label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="00100"
                          className="h-12 bg-gray-50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Description *
                        </span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-transparent dark:text-white resize-none"
                        placeholder="Describe your restaurant, cuisine type, atmosphere, and what makes you special..."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-xl mr-4">
                        <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Location Details</h2>
                        <p className="text-gray-600 dark:text-gray-400">Where is your restaurant located?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Street Address *
                        </label>
                        <Input
                          id="streetAddress"
                          name="streetAddress"
                          value={formData.streetAddress}
                          onChange={handleChange}
                          required
                          placeholder="123 Main Street"
                          className="h-12 bg-gray-50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <div className="relative">
                          <select
                            id="cityId"
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                            required
                            disabled={citiesLoading}
                            className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-transparent appearance-none text-gray-900 dark:text-white"
                          >
                            <option value="">Select a city</option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.id} className="bg-white dark:bg-gray-800">
                                {city.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ChevronRight className="w-5 h-5 text-gray-400 rotate-90" />
                          </div>
                        </div>
                        {citiesLoading && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading cities...</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Latitude (Optional)
                        </label>
                        <Input
                          id="latitude"
                          name="latitude"
                          type="number"
                          step="0.000001"
                          value={formData.latitude}
                          onChange={handleChange}
                          placeholder="e.g., -1.2921"
                          className="h-12 bg-gray-50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Longitude (Optional)
                        </label>
                        <Input
                          id="longitude"
                          name="longitude"
                          type="number"
                          step="0.000001"
                          value={formData.longitude}
                          onChange={handleChange}
                          placeholder="e.g., 36.8219"
                          className="h-12 bg-gray-50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                      <div className="flex items-center">
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Providing coordinates helps customers find your location more accurately.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl mr-4">
                        <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Operating Schedule</h2>
                        <p className="text-gray-600 dark:text-gray-400">Set your restaurant's hours</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="openingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Opening Time *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="openingTime"
                            name="openingTime"
                            type="time"
                            value={formData.openingTime}
                            onChange={handleChange}
                            required
                            className="h-12 pl-12 bg-gray-50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="closingTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Closing Time *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="closingTime"
                            name="closingTime"
                            type="time"
                            value={formData.closingTime}
                            onChange={handleChange}
                            required
                            className="h-12 pl-12 bg-gray-50 dark:bg-gray-700/50 border-0 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Restaurant Summary</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">Restaurant Name</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.name || 'Not set'}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">Email</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.email || 'Not set'}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">Location</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formData.streetAddress || 'Not set'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <span className="text-gray-600 dark:text-gray-400">Operating Hours</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formData.openingTime} - {formData.closingTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 mt-8 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-xl"
                      >
                        ← Back
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={
                          (currentStep === 1 && !isStep1Valid()) || 
                          (currentStep === 2 && !isStep2Valid())
                        }
                        className={`px-8 py-3 rounded-xl ${
                          (currentStep === 1 && !isStep1Valid()) || (currentStep === 2 && !isStep2Valid())
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
                        } text-white`}
                      >
                        Continue
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creating Restaurant...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Launch Restaurant
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </Card>

          {/* Tips Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mb-4">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Complete Profile</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fill in all details accurately to help customers find your restaurant easily.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mb-4">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Set Accurate Hours</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep your operating hours updated to avoid customer confusion.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Get Discovered</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete setup increases your visibility to potential customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RestaurantSetup;