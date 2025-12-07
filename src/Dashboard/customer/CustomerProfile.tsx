import React, { useState, useEffect } from 'react';
import { useUpdateProfileMutation, useGetLoyaltyInfoQuery } from '../../features/customer/customerApi';
import { useAppSelector } from '../../app/hooks';

// Define types for user profile
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  status: string;
  profileImage?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  favoriteCuisines?: string[];
  dietaryPreferences?: string[];
  allergies?: string[];
  totalOrders?: number;
  totalSpent?: number;
}

const ProfilePage: React.FC = () => {
  const { user: reduxUser } = useAppSelector((state) => state.auth);
  const [localUser, setLocalUser] = useState<UserProfile | null>(null);
  const { data: loyaltyInfo, isLoading: loyaltyLoading } = useGetLoyaltyInfoQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    favoriteCuisines: [] as string[],
    dietaryPreferences: [] as string[],
    allergies: [] as string[],
  });

  // Load user from localStorage on component mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        // First try to get from localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser: UserProfile = JSON.parse(storedUser);
          setLocalUser(parsedUser);
          
          // Set form data from stored user
          setFormData({
            name: parsedUser.name || '',
            phone: parsedUser.phone || '',
            favoriteCuisines: parsedUser.favoriteCuisines || [],
            dietaryPreferences: parsedUser.dietaryPreferences || [],
            allergies: parsedUser.allergies || [],
          });
        } else if (reduxUser) {
          // Fall back to Redux state - safely handle missing properties
          const userFromRedux: UserProfile = {
            id: reduxUser.id || '',
            name: reduxUser.name || '',
            email: reduxUser.email || '',
            role: reduxUser.role || '',
            emailVerified: reduxUser.emailVerified || false,
            status: reduxUser.status || 'active',
            phone: reduxUser.phone || '',
            // These properties might not exist on the User type, so use optional chaining or default
            createdAt: (reduxUser as any).createdAt || undefined,
            updatedAt: (reduxUser as any).updatedAt || undefined,
          };
          
          setLocalUser(userFromRedux);
          setFormData({
            name: userFromRedux.name || '',
            phone: userFromRedux.phone || '',
            favoriteCuisines: userFromRedux.favoriteCuisines || [],
            dietaryPreferences: userFromRedux.dietaryPreferences || [],
            allergies: userFromRedux.allergies || [],
          });
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      }
    };

    loadUserFromStorage();
  }, [reduxUser]);

  // Also ensure we update when reduxUser changes
  useEffect(() => {
    if (reduxUser && !localUser) {
      const userFromRedux: UserProfile = {
        id: reduxUser.id || '',
        name: reduxUser.name || '',
        email: reduxUser.email || '',
        role: reduxUser.role || '',
        emailVerified: reduxUser.emailVerified || false,
        status: reduxUser.status || 'active',
        phone: reduxUser.phone || '',
        // Use type assertion or optional chaining for properties that might not exist
        createdAt: (reduxUser as any).createdAt || undefined,
        updatedAt: (reduxUser as any).updatedAt || undefined,
      };
      
      setLocalUser(userFromRedux);
      setFormData(prev => ({
        ...prev,
        name: userFromRedux.name || prev.name,
        phone: userFromRedux.phone || prev.phone,
      }));
    }
  }, [reduxUser, localUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If you still want to update on backend
      await updateProfile(formData).unwrap();
      
      // Update local storage with new data
      if (localUser) {
        const updatedUser: UserProfile = {
          ...localUser,
          name: formData.name,
          phone: formData.phone,
          favoriteCuisines: formData.favoriteCuisines,
          dietaryPreferences: formData.dietaryPreferences,
          allergies: formData.allergies,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setLocalUser(updatedUser);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Even if API fails, update localStorage for better UX
      if (localUser) {
        const updatedUser: UserProfile = {
          ...localUser,
          name: formData.name,
          phone: formData.phone,
          favoriteCuisines: formData.favoriteCuisines,
          dietaryPreferences: formData.dietaryPreferences,
          allergies: formData.allergies,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setLocalUser(updatedUser);
        setIsEditing(false);
      }
    }
  };

  const addCuisine = () => {
    const cuisine = prompt('Enter a cuisine:');
    if (cuisine && !formData.favoriteCuisines.includes(cuisine)) {
      setFormData({
        ...formData,
        favoriteCuisines: [...formData.favoriteCuisines, cuisine],
      });
    }
  };

  const removeCuisine = (cuisine: string) => {
    setFormData({
      ...formData,
      favoriteCuisines: formData.favoriteCuisines.filter((c: string) => c !== cuisine),
    });
  };

  if (loyaltyLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  // Show loading if no user data yet
  if (!localUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your account information and preferences
            </p>
          </div>
          <button
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            className="mt-4 sm:mt-0 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Loyalty Card */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Loyalty Program</h2>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">🏆</span>
                <span className="text-lg font-semibold">{loyaltyInfo?.tier || 'Silver'} Member</span>
              </div>
              <p className="opacity-90">
                {loyaltyInfo?.points || 0} points • {loyaltyInfo?.pointsNeeded || 0} to next tier
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="w-32 bg-white/20 rounded-full h-4">
                <div 
                  className="bg-yellow-400 h-4 rounded-full" 
                  style={{ width: `${((loyaltyInfo?.points || 0) / (loyaltyInfo?.pointsNeeded || 1 + (loyaltyInfo?.points || 0))) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm mt-2 text-center">
                Next: {loyaltyInfo?.nextTier || 'Gold'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{localUser.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">{localUser.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white font-medium">{localUser.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {localUser.createdAt ? new Date(localUser.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Favorite Cuisines */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Favorite Cuisines
                    </label>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={addCuisine}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700"
                      >
                        + Add Cuisine
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.favoriteCuisines.map((cuisine: string) => (
                      <span
                        key={cuisine}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                      >
                        {cuisine}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeCuisine(cuisine)}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                    {formData.favoriteCuisines.length === 0 && !isEditing && (
                      <p className="text-gray-500 dark:text-gray-400">No cuisines selected</p>
                    )}
                  </div>
                </div>

                {/* Dietary Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Dietary Preferences
                  </label>
                  <div className="space-y-2">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Halal', 'Kosher'].map((preference) => (
                      <label key={preference} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.dietaryPreferences.includes(preference)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                dietaryPreferences: [...formData.dietaryPreferences, preference],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                dietaryPreferences: formData.dietaryPreferences.filter((p: string) => p !== preference),
                              });
                            }
                          }}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{preference}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Food Allergies
                  </label>
                  <div className="space-y-2">
                    {['Nuts', 'Shellfish', 'Eggs', 'Soy', 'Wheat', 'Milk', 'Fish'].map((allergy) => (
                      <label key={allergy} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.allergies.includes(allergy)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                allergies: [...formData.allergies, allergy],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                allergies: formData.allergies.filter((a: string) => a !== allergy),
                              });
                            }
                          }}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{allergy}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Stats Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Your Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Orders</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {localUser.totalOrders || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total Spent</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      KSh {(localUser.totalSpent || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Loyalty Points</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {loyaltyInfo?.points || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Account Status</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {localUser.status || 'active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <span className="block font-medium text-gray-900 dark:text-white">Change Password</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Update your security settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <span className="block font-medium text-gray-900 dark:text-white">Payment Methods</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Manage your saved cards</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <span className="block font-medium text-gray-900 dark:text-white">Notification Settings</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Control your notifications</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;