import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/modules/restaurants/contexts/RestaurantContext';
import { PlusCircle, Edit, Trash2, Eye, Search, Users } from 'lucide-react';
import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import { useGetAllStaffQuery, useDeleteStaffMutation } from '@/modules/restaurants/api/unifiedRestaurantApi';



const StaffList: React.FC = () => {
  const navigate = useNavigate();
  const { selectedRestaurant } = useRestaurant();

  const [searchTerm, setSearchTerm] = useState('');

  // Use RTK Query hooks
  const { data: staffMembers = [], isLoading: loading, error: queryError } = useGetAllStaffQuery(
    selectedRestaurant?.id || '',
    { skip: !selectedRestaurant?.id }
  );

  const [deleteStaff] = useDeleteStaffMutation();

  const handleDelete = async (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      await deleteStaff(staffId).unwrap();
    } catch (err) {
      console.error('Error deleting staff:', err);
    }
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (queryError) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error</p>
          <p>{queryError instanceof Error ? queryError.message : 'An unknown error occurred'}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your restaurant staff members</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/staff/create')}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Staff Member
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search staff members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </Card>

      {/* Staff List */}
      <Card className="p-6">
        {filteredStaff.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {staffMembers.length === 0 ? 'No staff members yet' : 'No staff members found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {staffMembers.length === 0
                ? 'Get started by adding your first staff member'
                : 'Try adjusting your search terms'
              }
            </p>
            {staffMembers.length === 0 && (
              <Button onClick={() => navigate('/dashboard/staff/create')}>
                Add First Staff Member
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{staff.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.user?.email || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.position || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{staff.user?.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/staff/${staff.id}`)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/staff/${staff.id}/edit`)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
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
      </Card>
    </div>
  );
};

export default StaffList;
