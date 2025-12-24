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

// Helper function to extract and normalize role name
const extractRoleName = (role: any): UserRoleEnum => {
  let roleStr = '';

  if (typeof role === 'string') {
    roleStr = role;
  } else if (role && typeof role === 'object') {
    roleStr = role.name || role.roleName || role.role || role.value || '';
  }

  if (!roleStr) return UserRoleEnum.CUSTOMER;

  const normalized = roleStr.trim();

  const roleMap: Record<string, UserRoleEnum> = {
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

    // Customer variations
    'Customer': UserRoleEnum.CUSTOMER,
    'customer': UserRoleEnum.CUSTOMER,
    'CUSTOMER': UserRoleEnum.CUSTOMER,
  };

  return roleMap[normalized] || UserRoleEnum.CUSTOMER;
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