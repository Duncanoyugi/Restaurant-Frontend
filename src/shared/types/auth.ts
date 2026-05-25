// Simple export without any complex syntax
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string;
  emailVerified: boolean;
  status: string;
  averageRating?: number;
  totalDeliveries?: number;
  isOnline?: boolean;
  isAvailable?: boolean;
};

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken?: string;
};