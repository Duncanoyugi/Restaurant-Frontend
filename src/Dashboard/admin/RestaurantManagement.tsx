import React, { useState } from 'react';
import { unifiedRestaurantApi } from '../../features/restaurants/unifiedRestaurantApi';
import { FaStore, FaPlus, FaSearch, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import type { Restaurant, CreateRestaurantDto } from '../../types/restaurant';

const RestaurantManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<CreateRestaurantDto>>({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    cityId: 1, // Default to 1 for now
    cuisineType: '',
    openingTime: '09:00',
    closingTime: '22:00',
  });

  // Access usage via the API object directly
  const { data: restaurantsData, isLoading } = unifiedRestaurantApi.useGetAllRestaurantsQuery();

  const [createRestaurant] = unifiedRestaurantApi.useCreateRestaurantMutation();
  const [updateRestaurant] = unifiedRestaurantApi.useUpdateRestaurantMutation();
  const [deleteRestaurant] = unifiedRestaurantApi.useDeleteRestaurantMutation();

  const restaurants = restaurantsData?.data || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Explicitly type prev to avoid implicit any errors
    setFormData((prev: Partial<CreateRestaurantDto>) => ({
      ...prev,
      [name]: name === 'cityId' ? (parseInt(value) || 1) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        await updateRestaurant({
          id: editingRestaurant.id,
          data: formData
        }).unwrap();
      } else {
        await createRestaurant(formData as any).unwrap();
      }
      setShowCreateModal(false);
      setEditingRestaurant(null);
      resetForm();
    } catch (err) {
      console.error('Failed to save restaurant:', err);
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      email: restaurant.email,
      phone: restaurant.phone,
      address: restaurant.address,
      cityId: restaurant.cityId,
      cuisineType: restaurant.cuisineType,
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this restaurant? This action cannot be undone.')) {
      try {
        await deleteRestaurant(id).unwrap();
      } catch (err) {
        console.error('Failed to delete restaurant:', err);
      }
    }
  };

  const toggleStatus = async (restaurant: Restaurant) => {
    try {
      await updateRestaurant({
        id: restaurant.id,
        data: { active: !restaurant.active }
      }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      cityId: 1,
      cuisineType: '',
      openingTime: '09:00',
      closingTime: '22:00',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Restaurant Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage restaurant profiles and operational status
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRestaurant(null);
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-md transition-all duration-200"
        >
          <FaPlus className="mr-2" />
          Add Restaurant
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:scale-[1.01] transition-all duration-200">
            <div className={`h-2 ${restaurant.active ? 'bg-green-500' : 'bg-red-500'}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 text-xl">
                  <FaStore />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(restaurant)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                {restaurant.name}
              </h3>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="font-semibold w-24">Cuisine:</span> {restaurant.cuisineType || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="font-semibold w-24">Location:</span> {restaurant.address || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <span className="font-semibold w-24">Status:</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${restaurant.active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {restaurant.active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => toggleStatus(restaurant)}
                  className={`w-full py-2 px-4 rounded-lg flex items-center justify-center font-medium transition-colors ${restaurant.active
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30'
                    : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'
                    }`}
                >
                  {restaurant.active ? (
                    <>
                      <FaTimes className="mr-2" /> Deactivate Restaurant
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" /> Activate Restaurant
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {restaurants.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-dashed border-gray-300 dark:border-gray-600">
              <FaStore className="mx-auto text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No restaurants found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Get started by creating a new restaurant profile.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingRestaurant ? 'Edit Restaurant' : 'Create New Restaurant'}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cuisine Type</label>
                  <input
                    type="text"
                    name="cuisineType"
                    required
                    value={formData.cuisineType}
                    onChange={handleInputChange}
                    placeholder="e.g., Italian, Mexican"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opening Time</label>
                    <input
                      type="time"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Closing Time</label>
                    <input
                      type="time"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-md transition-all duration-200 font-medium"
                >
                  {editingRestaurant ? 'Save Changes' : 'Create Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;