// src/features/auth/authSlice.ts
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
  if (typeof role === 'string') {
    return role as UserRoleEnum;
  }
  
  if (role && typeof role === 'object') {
    const roleName = role.name || role.roleName || role.role || role.value;
    if (roleName && typeof roleName === 'string') {
      return roleName as UserRoleEnum;
    }
  }
  
  return UserRoleEnum.CUSTOMER;
};

// Define types locally - UPDATED with missing properties
export type User = {
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
  // ADD THESE PROPERTIES:
  createdAt?: string;
  updatedAt?: string;
  favoriteCuisines?: string[];
  dietaryPreferences?: string[];
  allergies?: string[];
  totalOrders?: number;
  totalSpent?: number;
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

      // Normalize the user data by extracting role name
      const normalizedUser = {
        ...user,
        role: extractRoleName(user.role),
      };

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
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Add this new action to update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        const updatedUser = {
          ...state.user,
          ...action.payload,
        };
        state.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
  },
});

export const { setCredentials, logout, setLoading, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;