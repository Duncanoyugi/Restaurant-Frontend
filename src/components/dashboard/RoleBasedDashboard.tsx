import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import CustomerDashboard from '../../Dashboard/customer/CustomerDashboard';
import AdminDashboard from '../../Dashboard/admin/AdminDashboard';
import DriverDashboard from '../../Dashboard/driver/DriverDashboard';
import StaffDashboard from '../../Dashboard/staff/StaffDashboard'; // NEW IMPORT
import OwnerDashboard from '../../Dashboard/owner/OwnerDashboard';
import { UserRoleEnum } from '../../features/auth/authSlice';

// Helper to safely extract and normalize role name
const extractRoleName = (role: any): string => {
  if (typeof role === 'string') {
    // Normalize the role string
    const normalized = role.trim();
    
    // Map all possible variations to the UserRoleEnum values
    const roleMap: Record<string, string> = {
      // Driver variations
      'Driver': UserRoleEnum.DRIVER,
      'driver': UserRoleEnum.DRIVER,
      'DRIVER': UserRoleEnum.DRIVER,
      'Drvr': UserRoleEnum.DRIVER,
      'drvr': UserRoleEnum.DRIVER,
      
      // Admin variations
      'Admin': UserRoleEnum.ADMIN,
      'admin': UserRoleEnum.ADMIN,
      'ADMIN': UserRoleEnum.ADMIN,
      
      // Restaurant Owner variations
      'Restaurant Owner': UserRoleEnum.RESTAURANT_OWNER,
      'Restaurant_Owner': UserRoleEnum.RESTAURANT_OWNER,
      'RestaurantOwner': UserRoleEnum.RESTAURANT_OWNER,
      'Restaurant owner': UserRoleEnum.RESTAURANT_OWNER,
      'restaurant_owner': UserRoleEnum.RESTAURANT_OWNER,
      'Owner': UserRoleEnum.RESTAURANT_OWNER,
      'owner': UserRoleEnum.RESTAURANT_OWNER,
      
      // Restaurant Staff variations
      'Restaurant Staff': UserRoleEnum.RESTAURANT_STAFF,
      'Restaurant_Staff': UserRoleEnum.RESTAURANT_STAFF,
      'RestaurantStaff': UserRoleEnum.RESTAURANT_STAFF,
      'Restaurant staff': UserRoleEnum.RESTAURANT_STAFF,
      'restaurant_staff': UserRoleEnum.RESTAURANT_STAFF,
      'Staff': UserRoleEnum.RESTAURANT_STAFF,
      'staff': UserRoleEnum.RESTAURANT_STAFF,
      
      // Customer variations (default)
      'Customer': UserRoleEnum.CUSTOMER,
      'customer': UserRoleEnum.CUSTOMER,
      'CUSTOMER': UserRoleEnum.CUSTOMER,
    };
    
    return roleMap[normalized] || UserRoleEnum.CUSTOMER;
  }
  
  if (role && typeof role === 'object') {
    // Extract role name from object
    const roleName = role.name || role.roleName || role.role || role.value;
    if (roleName && typeof roleName === 'string') {
      return extractRoleName(roleName); // Recursively process
    }
  }
  
  return UserRoleEnum.CUSTOMER;
};

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log('🔍 RoleBasedDashboard Debug:');
      console.log('User object:', user);
      console.log('Raw role property:', user.role);
      console.log('Extracted role name:', extractRoleName(user.role));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Extract and normalize role name
  const roleName = extractRoleName(user.role);
  
  console.log('🎯 Final decision - Role:', roleName);

  // Route to appropriate dashboard
  if (roleName === UserRoleEnum.DRIVER) {
    console.log('✅ Rendering DriverDashboard');
    return <DriverDashboard />;
  } else if (roleName === UserRoleEnum.ADMIN) {
    console.log('✅ Rendering AdminDashboard');
    return <AdminDashboard />;
  } else if (roleName === UserRoleEnum.RESTAURANT_OWNER || roleName === 'Restaurant Owner') {
    console.log('✅ Rendering OwnerDashboard');
    return <OwnerDashboard />;
  } else if (roleName === UserRoleEnum.RESTAURANT_STAFF) {
    console.log('✅ Rendering StaffDashboard');
    return <StaffDashboard />;
  } else {
    console.log('✅ Rendering CustomerDashboard');
    return <CustomerDashboard />;
  }
};

export default RoleBasedDashboard;