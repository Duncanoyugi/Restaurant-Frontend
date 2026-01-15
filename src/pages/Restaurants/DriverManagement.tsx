import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useGetRestaurantByIdQuery, useGetDriverAssignmentsByRestaurantQuery, useCreateDriverAssignmentMutation, useDeleteDriverAssignmentMutation } from '../../features/restaurants/unifiedRestaurantApi';
import { UserRoleEnum } from '../../features/auth/authSlice';
import type { DriverAssignment } from '../../features/restaurants/unifiedRestaurantApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { Building2, Trash2, Search, UserPlus, Car, Mail, Calendar, FileText, Filter, X, Check, AlertCircle, Clock, Phone } from 'lucide-react';
import Badge from '../../components/ui/Badge';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredDrivers = driverAssignments?.filter((driver: DriverAssignment) => {
    // Search filter
    const matchesSearch = 
      driver.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.driver?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    
    // Vehicle filter
    const matchesVehicle = vehicleFilter === 'all' || driver.vehicleType === vehicleFilter;

    return matchesSearch && matchesStatus && matchesVehicle;
  }) || [];

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
      setError('Failed to add driver. Please try again.');
      console.error('Error adding driver:', err);
    }
  };

  const handleDeleteDriver = async (assignmentId: number) => {
    if (!window.confirm('Are you sure you want to remove this driver?')) return;

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

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'motorcycle': return '🏍️';
      case 'car': return '🚗';
      case 'van': return '🚐';
      case 'bicycle': return '🚲';
      default: return '🚗';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'on_delivery': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'offline': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getVehicleColor = (vehicleType: string) => {
    switch (vehicleType) {
      case 'motorcycle': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'car': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'van': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'bicycle': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setVehicleFilter('all');
    setSearchTerm('');
  };

  if (restaurantLoading || driversLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto mt-12">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Restaurant Not Found</h3>
                  <p className="mt-2 text-gray-600">The restaurant you're looking for doesn't exist or you don't have access.</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/restaurants')} 
                className="mt-6 bg-red-600 hover:bg-red-700 text-white"
              >
                Back to Restaurants
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <Button 
                onClick={() => navigate(`/restaurants/${restaurant.id}`)} 
                variant="outline" 
                className="mb-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                ← Back to Restaurant
              </Button>
              <div className="flex items-center">
                <div className="p-3 bg-primary/10 rounded-lg mr-4">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Driver Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {restaurant.name} • {driverAssignments?.length || 0} drivers
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-6 py-3 rounded-lg flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Driver
            </Button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search drivers by name, email, or license plate..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="h-12 px-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(statusFilter !== 'all' || vehicleFilter !== 'all') && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {(statusFilter !== 'all' ? 1 : 0) + (vehicleFilter !== 'all' ? 1 : 0)}
                  </span>
                )}
              </Button>

              {(statusFilter !== 'all' || vehicleFilter !== 'all' || searchTerm) && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  className="h-12 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'active', 'inactive', 'on_delivery', 'offline'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          statusFilter === status
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {status === 'all' ? 'All Statuses' : status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Vehicle Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'motorcycle', 'car', 'van', 'bicycle'].map((vehicle) => (
                      <button
                        key={vehicle}
                        onClick={() => setVehicleFilter(vehicle)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          vehicleFilter === vehicle
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {vehicle === 'all' ? 'All Vehicles' : vehicle}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredDrivers.length}</span> drivers
          </p>
        </div>

        {/* Drivers List */}
        {filteredDrivers.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Car className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                No Drivers Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {searchTerm || statusFilter !== 'all' || vehicleFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first driver'}
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add First Driver
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDrivers.map((assignment: DriverAssignment) => (
              <Card 
                key={assignment.id} 
                className="hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center mr-4">
                        <span className="text-2xl">{getVehicleIcon(assignment.vehicleType!)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {assignment.driver?.name || 'Unknown Driver'}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getVehicleColor(assignment.vehicleType!)}>
                            {assignment.vehicleType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {(user?.role === UserRoleEnum.RESTAURANT_OWNER || user?.role === UserRoleEnum.ADMIN) && (
                      <button 
                        onClick={() => handleDeleteDriver(assignment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove driver"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="truncate">{assignment.driver?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{assignment.driver?.phone || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <FileText className="w-4 h-4 mr-3 text-gray-400" />
                        <span>License: {assignment.licensePlate || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{assignment.workingHours?.start} - {assignment.workingHours?.end}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          Assigned {new Date(assignment.assignedAt).toLocaleDateString()}
                        </div>
                        <button 
                          onClick={() => {/* Navigate to driver details */}}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Driver Modal */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Driver</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Assign a driver to this restaurant</p>
                  </div>
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Driver Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="driver@example.com"
                        value={newDriverEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDriverEmail(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Vehicle Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
                        { value: 'car', label: 'Car', icon: '🚗' },
                        { value: 'van', label: 'Van', icon: '🚐' },
                        { value: 'bicycle', label: 'Bicycle', icon: '🚲' }
                      ].map((vehicle) => (
                        <button
                          key={vehicle.value}
                          type="button"
                          onClick={() => setNewDriverVehicle(vehicle.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            newDriverVehicle === vehicle.value
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="text-2xl mb-2">{vehicle.icon}</div>
                          <span className="text-sm font-medium">{vehicle.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="license" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      License Plate
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="license"
                        type="text"
                        placeholder="e.g., KAA 123A"
                        value={newDriverLicense}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDriverLicense(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary/20 uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    variant="outline"
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddDriver}
                    disabled={!newDriverEmail}
                    className={`px-8 ${
                      !newDriverEmail
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
                    }`}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Driver
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverManagement;