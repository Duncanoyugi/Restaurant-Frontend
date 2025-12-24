import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useGetRestaurantByIdQuery, useGetStaffAssignmentsByRestaurantQuery, useCreateStaffAssignmentMutation, useDeleteStaffAssignmentMutation } from '../../features/restaurants/unifiedRestaurantApi';
import { UserRoleEnum } from '../../features/auth/authSlice';
import type { StaffAssignment } from '../../features/restaurants/unifiedRestaurantApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { Building2, Users, Trash2, Search, UserPlus } from 'lucide-react';

const StaffManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: restaurant, isLoading: restaurantLoading } = useGetRestaurantByIdQuery(id || '', {
    skip: !id,
  });

  const { data: staffAssignments, isLoading: staffLoading, refetch: refetchStaff } = useGetStaffAssignmentsByRestaurantQuery(Number(id) || 0, {
    skip: !id,
  });

  const [createStaffAssignment] = useCreateStaffAssignmentMutation();
  const [deleteStaffAssignment] = useDeleteStaffAssignmentMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('waiter');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filteredStaff = staffAssignments?.filter((staff: StaffAssignment) =>
    staff.staff?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddStaff = async () => {
    if (!id || !newStaffEmail) return;

    try {
      // In a real app, you would first search for the user by email to get their ID
      // For this demo, we'll simulate it
      const mockUserId = Math.floor(Math.random() * 1000) + 1;

      await createStaffAssignment({
        restaurantId: Number(id),
        staffId: mockUserId,
        role: newStaffRole,
        status: 'active'
      }).unwrap();

      setSuccess('Staff member added successfully!');
      setNewStaffEmail('');
      setNewStaffRole('waiter');
      setIsDialogOpen(false);
      refetchStaff();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add staff member');
      console.error('Error adding staff:', err);
    }
  };

  const handleDeleteStaff = async (assignmentId: number) => {
    try {
      await deleteStaffAssignment(assignmentId).unwrap();
      setSuccess('Staff member removed successfully!');
      refetchStaff();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to remove staff member');
      console.error('Error deleting staff:', err);
    }
  };

  if (restaurantLoading || staffLoading) {
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
          {restaurant.name} Staff Management
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
            placeholder="Search staff..."
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
          Add Staff Member
        </button>
      </div>

      {filteredStaff.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Staff Members Found</h2>
          <p className="text-gray-600">This restaurant doesn't have any staff members yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStaff.map((assignment: StaffAssignment) => (
            <Card key={assignment.id}>
              <div className="p-4">
                <div className="flex flex-row items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{assignment.staff?.name || 'Staff Member'}</h3>
                    <p className="text-sm text-gray-500 capitalize">{assignment.role}</p>
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
                        onClick={() => handleDeleteStaff(assignment.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span>{assignment.staff?.email || 'N/A'}</span>
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
            <h2 className="text-xl font-bold mb-4">Add New Staff Member</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@example.com"
                  value={newStaffEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStaffEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={newStaffRole}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewStaffRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="manager">Manager</option>
                  <option value="chef">Chef</option>
                  <option value="waiter">Waiter</option>
                  <option value="cashier">Cashier</option>
                  <option value="host">Host</option>
                  <option value="bartender">Bartender</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button 
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddStaff}
                  disabled={!newStaffEmail}
                  className={`px-4 py-2 rounded-lg text-white ${
                    !newStaffEmail ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Add Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;