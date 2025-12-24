import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { UserRoleEnum } from '../../features/auth/authSlice';
import { PlusCircle, Edit, Trash2, UserPlus, Users, Search, Car, Truck } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  vehicleType?: string;
  createdAt: string;
}

interface DriverAssignment {
  id: number;
  driverId: number;
  restaurantId: number;
  assignedAt: string;
  driver: Driver;
}

const DriverManagement: React.FC = () => {
  const { selectedRestaurant } = useRestaurant();

  const [driverAssignments, setDriverAssignments] = useState<DriverAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDriver, setEditDriver] = useState<Driver | null>(null);

  // Form state for creating/editing drivers
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: '',
    vehicleType: 'Car'
  });

  // Fetch driver assignments for the current restaurant
  useEffect(() => {
    const fetchDriverAssignments = async () => {
      if (!selectedRestaurant) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch driver assignments from backend
        const response = await fetch(`/api/restaurants/driver-assignments/restaurant/${selectedRestaurant.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch driver assignments');
        }

        const data = await response.json();
        setDriverAssignments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch driver assignments');
        console.error('Error fetching driver assignments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverAssignments();
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

      const driverData = {
        ...formData,
        restaurantId: selectedRestaurant.id,
        role: UserRoleEnum.DRIVER
      };

      let response;
      if (editDriver) {
        // Update existing driver
        response = await fetch(`/api/users/${editDriver.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(driverData)
        });
      } else {
        // Create new driver
        response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(driverData)
        });
      }

      if (!response.ok) {
        throw new Error(editDriver ? 'Failed to update driver' : 'Failed to create driver');
      }


      // Refresh driver assignments list
      const updatedResponse = await fetch(`/api/restaurants/driver-assignments/restaurant/${selectedRestaurant.id}`);
      const updatedData = await updatedResponse.json();
      setDriverAssignments(updatedData);

      // Reset form
      setShowCreateForm(false);
      setEditDriver(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        licenseNumber: '',
        vehicleType: 'Car'
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (driver: Driver) => {
    setEditDriver(driver);
    setFormData({
      name: driver.name,
      email: driver.email,
      password: '',
      phone: driver.phone || '',
      licenseNumber: driver.licenseNumber || '',
      vehicleType: driver.vehicleType || 'Car'
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (driverId: number) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${driverId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete driver');
      }

      // Refresh driver assignments list
      if (selectedRestaurant) {
        const updatedResponse = await fetch(`/api/restaurants/driver-assignments/restaurant/${selectedRestaurant.id}`);
        const updatedData = await updatedResponse.json();
        setDriverAssignments(updatedData);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete driver');
      console.error('Error deleting driver:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = driverAssignments.map(assignment => assignment.driver).filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Truck className="w-6 h-6" />
          Driver Management
        </h1>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditDriver(null);
            setFormData({
              name: '',
              email: '',
              password: '',
              phone: '',
              licenseNumber: '',
              vehicleType: 'Car'
            });
          }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          {showCreateForm ? 'Cancel' : 'Add Driver'}
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
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Car className="w-5 h-5" />
            {editDriver ? 'Edit Driver' : 'Add New Driver'}
          </h2>
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
              {!editDriver && (
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Bicycle">Bicycle</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
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
                  {editDriver ? 'Update Driver' : 'Add Driver'}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            Drivers List
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search drivers..."
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
        ) : filteredDrivers.length === 0 ? (
          <div className="text-center py-8">
            <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No drivers found. Add your first driver!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">License</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{driver.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{driver.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{driver.licenseNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{driver.vehicleType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{driver.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => handleEdit(driver)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id)}
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

export default DriverManagement;