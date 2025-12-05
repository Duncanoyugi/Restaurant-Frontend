import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


export const UserRoleEnum = {
  ADMIN: 'Admin',
  RESTAURANT_OWNER: 'Restaurant Owner',
  RESTAURANT_STAFF: 'Restaurant Staff',
  CUSTOMER: 'Customer',
  DRIVER: 'Driver',
} as const;

export type UserRoleEnum = typeof UserRoleEnum[keyof typeof UserRoleEnum];

// Helper function to extract role name from object or string
const extractRoleName = (role: any): UserRoleEnum => {
  // If role is already a string, return it
  if (typeof role === 'string') {
    return role as UserRoleEnum;
  }
  
  // If role is an object, try to extract the name
  if (role && typeof role === 'object') {
    // Try different possible property names
    const roleName = role.name || role.roleName || role.role || role.value;
    if (roleName && typeof roleName === 'string') {
      console.log('🔧 Extracted role from object:', roleName);
      return roleName as UserRoleEnum;
    }
  }
  
  // Default to CUSTOMER if role is invalid
  console.warn('⚠️ Invalid role format, defaulting to Customer:', role);
  return UserRoleEnum.CUSTOMER;
};

// Define types locally
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRoleEnum;
  profileImage?: string;
  emailVerified: boolean;
  status: string;
  averageRating?: number;
  totalDeliveries?: number;
  isOnline?: boolean;
  isAvailable?: boolean;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Load user from localStorage on initialization
const loadUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }
  return null;
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken') && !!loadUserFromStorage(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any; accessToken: string }>) => {
      const { user, accessToken } = action.payload;
      
      console.log('🔐 Raw user data from backend:', user);
      console.log('🔐 Raw role data:', user?.role);
      
      // Normalize the user data by extracting role name
      const normalizedUser = {
        ...user,
        role: extractRoleName(user.role)
      };
      
      console.log('🔐 Normalized role:', normalizedUser.role);
      
      state.user = normalizedUser as User;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      
      // Store in localStorage for persistence
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;