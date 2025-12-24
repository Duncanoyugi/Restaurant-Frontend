import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useCreateRestaurantMutation } from '../../features/restaurants/unifiedRestaurantApi';
import { useGetAllCitiesQuery } from '../../features/location/locationApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { Building2 } from 'lucide-react';

const RestaurantSetup: React.FC = () => {
  const navigate = useNavigate();
  const [createRestaurant, { isLoading }] = useCreateRestaurantMutation();
  const { data: cities = [], isLoading: citiesLoading } = useGetAllCitiesQuery();
  const user = useSelector((state: RootState) => state.auth.user);

  console.log('🏗️ RestaurantSetup component rendered');

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
    if (!user?.id) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    try {
      const restaurantData = {
        ...formData,
        ownerId: user.id,
      };
      const result = await createRestaurant(restaurantData).unwrap();
      // Redirect to owner dashboard with the new restaurant ID
      navigate(`/restaurants/${result.id}/owner`);
    } catch (error) {
      console.error('Failed to create restaurant:', error);
      alert('Failed to create restaurant. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center mb-2">
          <Building2 className="w-8 h-8 mr-3 text-primary" />
          Setup Your Restaurant
        </h1>
        <p className="text-gray-600">Enter your restaurant details to get started</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name *</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Savory Bites Restaurant"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="contact@restaurant.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+1 (123) 456-7890"
              />
            </div>

            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <Input
                id="streetAddress"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                required
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="10001"
              />
            </div>

            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="0.000001"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g., -3.9826"
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="0.000001"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g., 37.9062"
              />
            </div>

            <div>
              <label htmlFor="openingTime" className="block text-sm font-medium text-gray-700 mb-1">Opening Time *</label>
              <Input
                id="openingTime"
                name="openingTime"
                type="time"
                value={formData.openingTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="closingTime" className="block text-sm font-medium text-gray-700 mb-1">Closing Time *</label>
              <Input
                id="closingTime"
                name="closingTime"
                type="time"
                value={formData.closingTime}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <select
                id="cityId"
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                required
                disabled={citiesLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describe your restaurant, cuisine type, and unique features..."
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Restaurant'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RestaurantSetup;
