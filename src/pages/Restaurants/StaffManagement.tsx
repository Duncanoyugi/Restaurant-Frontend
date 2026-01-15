import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useGetRestaurantByIdQuery, useGetStaffAssignmentsByRestaurantQuery, useCreateStaffAssignmentMutation, useDeleteStaffAssignmentMutation } from '../../features/restaurants/unifiedRestaurantApi';
import { UserRoleEnum } from '../../features/auth/authSlice';
import type { StaffAssignment } from '../../features/restaurants/unifiedRestaurantApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { Building2, Users, Trash2, Search, UserPlus, Mail, Calendar, Shield, ChevronRight, Filter, X, Crown, ChefHat, Utensils, CreditCard, UserCheck, Award } from 'lucide-react';

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
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredStaff = staffAssignments?.filter((staff: StaffAssignment) => {
    const matchesSearch = 
      staff.staff?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staff?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  const handleAddStaff = async () => {
    if (!id || !newStaffEmail) return;

    try {
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
      setError('Failed to add staff member. Please try again.');
      console.error('Error adding staff:', err);
    }
  };

  const handleDeleteStaff = async (assignmentId: number) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'manager': return <Crown className="w-4 h-4" />;
      case 'chef': return <ChefHat className="w-4 h-4" />;
      case 'waiter': return <Users className="w-4 h-4" />;
      case 'cashier': return <CreditCard className="w-4 h-4" />;
      case 'bartender': return <Utensils className="w-4 h-4" />;
      default: return <UserCheck className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'chef': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'waiter': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cashier': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'bartender': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'host': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'on_break': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const clearFilters = () => {
    setRoleFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
  };

  if (restaurantLoading || staffLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4 mb-8"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
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
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 p-8 rounded-2xl shadow-lg">
              <div className="flex items-start">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl mr-4">
                  <Building2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Restaurant Not Found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">The restaurant you're looking for doesn't exist or you don't have access.</p>
                  <Button 
                    onClick={() => navigate('/restaurants')}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl"
                  >
                    Back to Restaurants
                  </Button>
                </div>
              </div>
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
                <div className="p-3 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg mr-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Staff Management
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {restaurant.name} • {staffAssignments?.length || 0} staff members
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Staff Member
            </Button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-fade-in">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-xl animate-fade-in">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="text-green-800 font-medium">{success}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search staff by name, email, or role..."
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
                {(roleFilter !== 'all' || statusFilter !== 'all') && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {(roleFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0)}
                  </span>
                )}
              </Button>

              {(roleFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
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
                    Role
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'manager', 'chef', 'waiter', 'cashier', 'bartender', 'host'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                          roleFilter === role
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {role !== 'all' && <span className="mr-2">{getRoleIcon(role)}</span>}
                        {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'active', 'inactive', 'on_break'].map((status) => (
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
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredStaff.length}</span> staff members
          </p>
        </div>

        {/* Staff List */}
        {filteredStaff.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                No Staff Members Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first staff member'}
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Add First Staff Member
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStaff.map((assignment: StaffAssignment) => (
              <Card 
                key={assignment.id} 
                className="hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center mr-4">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-full">
                          {getRoleIcon(assignment.role)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {assignment.staff?.name || 'Staff Member'}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(assignment.role)}`}>
                            {assignment.role.charAt(0).toUpperCase() + assignment.role.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {(user?.role === UserRoleEnum.RESTAURANT_OWNER || user?.role === UserRoleEnum.ADMIN) && (
                      <button 
                        onClick={() => handleDeleteStaff(assignment.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove staff member"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="truncate">{assignment.staff?.email || 'No email provided'}</span>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Joined {new Date(assignment.assignedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500 dark:text-gray-400">
                          ID: {assignment.id}
                        </div>
                        <button 
                          onClick={() => {/* Navigate to staff details */}}
                          className="text-primary hover:text-primary/80 font-medium flex items-center"
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Staff Modal */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Staff Member</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Assign a staff member to this restaurant</p>
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
                      Staff Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="staff@example.com"
                        value={newStaffEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewStaffEmail(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'manager', label: 'Manager', icon: <Crown className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800' },
                        { value: 'chef', label: 'Chef', icon: <ChefHat className="w-5 h-5" />, color: 'bg-orange-100 text-orange-800' },
                        { value: 'waiter', label: 'Waiter', icon: <Users className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800' },
                        { value: 'cashier', label: 'Cashier', icon: <CreditCard className="w-5 h-5" />, color: 'bg-green-100 text-green-800' },
                        { value: 'bartender', label: 'Bartender', icon: <Utensils className="w-5 h-5" />, color: 'bg-amber-100 text-amber-800' },
                        { value: 'host', label: 'Host', icon: <UserCheck className="w-5 h-5" />, color: 'bg-pink-100 text-pink-800' },
                      ].map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setNewStaffRole(role.value)}
                          className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                            newStaffRole === role.value
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${role.color} mb-2`}>
                            {role.icon}
                          </div>
                          <span className="text-sm font-medium">{role.label}</span>
                        </button>
                      ))}
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
                    onClick={handleAddStaff}
                    disabled={!newStaffEmail}
                    className={`px-8 ${
                      !newStaffEmail
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
                    }`}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add Staff Member
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
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

export default StaffManagement;