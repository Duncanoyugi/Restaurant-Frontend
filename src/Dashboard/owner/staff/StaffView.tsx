import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRestaurant } from '../../../contexts/RestaurantContext';
import { UserRoleEnum } from '../../../features/auth/authSlice';
import { ArrowLeft, Edit, User, Mail, Phone, Calendar, Shield } from 'lucide-react';
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

const StaffView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedRestaurant } = useRestaurant();

  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff member data
  useEffect(() => {
    const fetchStaffMember = async () => {
      if (!id || !selectedRestaurant) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/restaurants/staff/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch staff member');
        }

        const data: StaffMember = await response.json();
        setStaffMember(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch staff member');
        console.error('Error fetching staff:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffMember();
  }, [id, selectedRestaurant]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: UserRoleEnum) => {
    switch (role) {
      case UserRoleEnum.RESTAURANT_OWNER:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case UserRoleEnum.RESTAURANT_STAFF:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !staffMember) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {error ? 'Error' : 'Staff member not found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error || 'The requested staff member could not be found.'}
          </p>
          <Button onClick={() => navigate('/dashboard/staff')}>
            Back to Staff List
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Member Details</h1>
            <p className="text-gray-600 dark:text-gray-300">View staff member information</p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/dashboard/staff/${staffMember.id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Staff Member
        </Button>
      </div>

      {/* Staff Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {staffMember.name}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(staffMember.role)}`}>
                    {staffMember.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Mail className="w-5 h-5" />
                    <span>{staffMember.email}</span>
                  </div>
                  {staffMember.phone && (
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <Phone className="w-5 h-5" />
                      <span>{staffMember.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span>Joined {formatDate(staffMember.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Staff ID</span>
                <span className="font-medium text-gray-900 dark:text-white">#{staffMember.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Account Status</span>
                <span className="font-medium text-green-600 dark:text-green-400">Active</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-300">Role Permissions</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {staffMember.role === UserRoleEnum.RESTAURANT_OWNER ? 'Full Access' : 'Staff Access'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => navigate(`/dashboard/staff/${staffMember.id}/edit`)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Information
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/staff')}
                className="w-full"
              >
                View All Staff
              </Button>
            </div>
          </Card>

          {/* Activity Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Member since</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(staffMember.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffView;
