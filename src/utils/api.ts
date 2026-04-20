export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

// ApiError class for error handling
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Centralized API wrapper for components using plain fetch
export class ApiClient {
  private static readonly baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

  private static getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(errorData.message || `HTTP ${response.status}`, response.status);
    }

    return response.json();
  }

  // Orders API
  static async fetchOrders(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/orders/restaurant/my-orders`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  static async updateOrderStatus(orderId: number, status: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse<any>(response);
  }

  // Rooms API
  static async fetchRooms(restaurantId: number): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/rooms/restaurant/${restaurantId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  // Reviews API
  static async fetchReviews(restaurantId: number): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/reviews/restaurant/${restaurantId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  // Reservations API
  static async fetchReservations(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/reservations/restaurant/my-reservations`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  static async createReservation(reservationData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/reservations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reservationData),
    });
    return this.handleResponse<any>(response);
  }

  // Staff API
  static async fetchStaff(restaurantId: number): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/restaurants/staff/restaurant/${restaurantId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  // Driver Assignments API
  static async fetchDriverAssignments(restaurantId: number): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/restaurants/driver-assignments/restaurant/${restaurantId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  // Users API (for creating drivers)
  static async createUser(userData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse<any>(response);
  }

  // Generic API method for any endpoint
  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const normalizedEndpoint = endpoint.startsWith('http')
      ? endpoint
      : endpoint.startsWith('/api/')
        ? endpoint
      : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(normalizedEndpoint, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });
    return this.handleResponse<T>(response);
  }
}
