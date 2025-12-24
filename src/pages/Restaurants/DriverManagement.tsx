import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useGetRestaurantByIdQuery, useGetDriverAssignmentsByRestaurantQuery, useCreateDriverAssignmentMutation, useDeleteDriverAssignmentMutation } from '../../features/restaurants/unifiedRestaurantApi';
import { UserRoleEnum } from '../../features/auth/authSlice';
import type { DriverAssignment } from '../../features/restaurants/unifiedRestaurantApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { Building2, Trash2, Search, UserPlus, Car } from 'lucide-react';

const DriverManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: restaurant, isLoading: restaurantLoading } = useGetRestaurantByIdQuery(id || '', {
    skip: !id,
  });

  const { data: driverAssignments, isLoading: driversLoading, refetch: refetchDrivers } = useGetDriverAssignmentsByRestaurantQuery(Number(id) || 0, {
    skip: !id,
  });

  const [createDriverAssignment] = useCreateDriverAssignmentMutation();
  const [deleteDriverAssignment] = useDeleteDriverAssignmentMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDriverEmail, setNewDriverEmail] = useState('');
  const [newDriverVehicle, setNewDriverVehicle] = useState('motorcycle');
  const [newDriverLicense, setNewDriverLicense] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredDrivers = driverAssignments?.filter((driver: DriverAssignment) =>
    driver.driver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddDriver = async () => {
    if (!id || !newDriverEmail) return;

    try {
      // In a real app, you would first search for the user by email to get their ID
      // For this demo, we'll simulate it
      const mockUserId = Math.floor(Math.random() * 1000) + 1;

      await createDriverAssignment({
        restaurantId: Number(id),
        driverId: mockUserId,
        vehicleType: newDriverVehicle,
        licensePlate: newDriverLicense,
        status: 'active',
        workingHours: {
          start: '08:00',
          end: '20:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }
      }).unwrap();

      setSuccess('Driver added successfully!');
      setNewDriverEmail('');
      setNewDriverVehicle('motorcycle');
      setNewDriverLicense('');
      setIsDialogOpen(false);
      refetchDrivers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add driver');
      console.error('Error adding driver:', err);
    }
  };

  const handleDeleteDriver = async (assignmentId: number) => {
    try {
      await deleteDriverAssignment(assignmentId).unwrap();
      setSuccess('Driver removed successfully!');
      refetchDrivers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to remove driver');
      console.error('Error deleting driver:', err);
    }
  };

  if (restaurantLoading || driversLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Restaurant not found</span>
        </div>
        <Button onClick={() => navigate('/restaurants')} className="mt-4">
          Back to Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button onClick={() => navigate(`/restaurants/${restaurant.id}`)} variant="outline" className="mb-4">
          ← Back to Restaurant
        </Button>
        <h1 className="text-3xl font-bold flex items-center">
          <Building2 className="w-8 h-8 mr-3 text-primary" />
          {restaurant.name} Driver Management
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {success}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Driver
        </button>
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="text-center py-12">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Drivers Found</h2>
          <p className="text-gray-600">This restaurant doesn't have any drivers yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDrivers.map((assignment: DriverAssignment) => (
            <Card key={assignment.id}>
              <div className="p-4">
                <div className="flex flex-row items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{assignment.driver?.name || 'Driver'}</h3>
                    <p className="text-sm text-gray-500 capitalize">{assignment.vehicleType}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      assignment.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {assignment.status}
                    </span>
                    {(user?.role === UserRoleEnum.RESTAURANT_OWNER || user?.role === UserRoleEnum.ADMIN) && (
                      <button 
                        onClick={() => handleDeleteDriver(assignment.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span>{assignment.driver?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <span>License: {assignment.licensePlate || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <span>Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Driver</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Driver Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="driver@example.com"
                  value={newDriverEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDriverEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  id="vehicle"
                  value={newDriverVehicle}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewDriverVehicle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="motorcycle">Motorcycle</option>
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                  <option value="bicycle">Bicycle</option>
                </select>
              </div>
              <div>
                <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate
                </label>
                <Input
                  id="license"
                  type="text"
                  placeholder="KAA 123A"
                  value={newDriverLicense}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDriverLicense(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDriver}
                  disabled={!newDriverEmail}
                  className={`px-4 py-2 rounded-lg text-white ${
                    !newDriverEmail ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Add Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;