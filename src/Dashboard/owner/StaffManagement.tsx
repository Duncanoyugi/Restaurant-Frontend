import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { UserRoleEnum } from '../../features/auth/authSlice';
import { PlusCircle, Edit, Trash2, UserPlus, Users, Search } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: UserRoleEnum;
  phone?: string;
  createdAt: string;
}

const StaffManagement: React.FC = () => {
  const { selectedRestaurant } = useRestaurant();

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editStaff, setEditStaff] = useState<StaffMember | null>(null);

  // Form state for creating/editing staff
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRoleEnum.RESTAURANT_STAFF as UserRoleEnum,
    phone: ''
  });

  // Fetch staff members for the current restaurant
  useEffect(() => {
    const fetchStaff = async () => {
      if (!selectedRestaurant) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch staff members from backend
        const response = await fetch(`/api/restaurants/staff/restaurant/${selectedRestaurant.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch staff members');
        }

        const data = await response.json();
        setStaffMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch staff members');
        console.error('Error fetching staff:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [selectedRestaurant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRestaurant) {
      setError('No restaurant selected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const staffData = {
        ...formData,
        restaurantId: selectedRestaurant.id,
        role: formData.role
      };

      let response;
      if (editStaff) {
        // Update existing staff
        response = await fetch(`/api/users/${editStaff.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(staffData)
        });
      } else {
        // Create new staff
        response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(staffData)
        });
      }

      if (!response.ok) {
        throw new Error(editStaff ? 'Failed to update staff' : 'Failed to create staff');
      }

      await response.json();

      // Refresh staff list
      const updatedResponse = await fetch(`/api/restaurants/staff/restaurant/${selectedRestaurant.id}`);
      const updatedData = await updatedResponse.json();
      setStaffMembers(updatedData);

      // Reset form
      setShowCreateForm(false);
      setEditStaff(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: UserRoleEnum.RESTAURANT_STAFF as UserRoleEnum,
        phone: ''
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staff: StaffMember) => {
    setEditStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: '',
      role: staff.role as UserRoleEnum,
      phone: staff.phone || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (staffId: number) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${staffId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff');
      }

      // Refresh staff list
      if (selectedRestaurant) {
        const updatedResponse = await fetch(`/api/restaurants/staff/restaurant/${selectedRestaurant.id}`);
        const updatedData = await updatedResponse.json();
        setStaffMembers(updatedData);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete staff');
      console.error('Error deleting staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!selectedRestaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Info!</strong>
          <span className="block sm:inline"> Please select a restaurant first.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Staff Management</h1>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditStaff(null);
            setFormData({
              name: '',
              email: '',
              password: '',
              role: UserRoleEnum.RESTAURANT_STAFF as UserRoleEnum,
              phone: ''
            });
          }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {showCreateForm ? 'Cancel' : 'Add Staff'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">{editStaff ? 'Edit Staff' : 'Create New Staff'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              {!editStaff && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={UserRoleEnum.RESTAURANT_STAFF}>Restaurant Staff</option>
                  <option value={UserRoleEnum.DRIVER}>Driver</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Processing...
                </span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  {editStaff ? 'Update Staff' : 'Create Staff'}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Staff Members</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        ) : staffMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No staff members found. Add your first staff member!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => handleEdit(staff)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(staff.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagement;