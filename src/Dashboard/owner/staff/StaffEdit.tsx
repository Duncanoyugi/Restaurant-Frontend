import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRestaurant } from '../../../contexts/RestaurantContext';
import { UserRoleEnum } from '../../../features/auth/authSlice';
import { ArrowLeft, Edit } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: UserRoleEnum;
  phone?: string;
  createdAt: string;
}

const StaffEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedRestaurant } = useRestaurant();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRoleEnum.RESTAURANT_STAFF as UserRoleEnum,
    phone: ''
  });

  // Fetch staff member data
  useEffect(() => {
    const fetchStaffMember = async () => {
      if (!id || !selectedRestaurant) return;

      try {
        setFetchLoading(true);
        setError(null);

        const response = await fetch(`/api/restaurants/staff/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch staff member');
        }

        const staffData: StaffMember = await response.json();

        // Verify this staff member belongs to the selected restaurant
        // Note: You might need to adjust this based on your API response structure

        setFormData({
          name: staffData.name,
          email: staffData.email,
          role: staffData.role,
          phone: staffData.phone || ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch staff member');
        console.error('Error fetching staff:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchStaffMember();
  }, [id, selectedRestaurant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !selectedRestaurant) {
      setError('Invalid staff member or restaurant');
      return;
    }

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const staffData = {
        ...formData,
        restaurantId: selectedRestaurant.id
      };

      const response = await fetch(`/api/restaurants/staff/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update staff member');
      }

      // Navigate back to staff list
      navigate('/dashboard/staff');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update staff member');
      console.error('Error updating staff:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard/staff')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Staff
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Staff Member</h1>
          <p className="text-gray-600 dark:text-gray-300">Update staff member information</p>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Role *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value={UserRoleEnum.RESTAURANT_STAFF}>Restaurant Staff</option>
                <option value={UserRoleEnum.RESTAURANT_OWNER}>Restaurant Owner</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter phone number (optional)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/staff')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Update Staff Member
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StaffEdit;
