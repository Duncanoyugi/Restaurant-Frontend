export interface Country {
  id: string;
  name: string;
  iso2: string;
  iso3: string;
  phoneCode: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  states?: State[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryRequest {
  name: string;
  iso2: string;
  iso3: string;
  phoneCode: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
}

export interface UpdateCountryRequest {
  name?: string;
  iso2?: string;
  iso3?: string;
  phoneCode?: string;
  currency?: string;
  currencySymbol?: string;
  timezone?: string;
}

// State types
export interface State {
  id: string;
  name: string;
  code: string;
  countryId: string;
  country?: Country;
  cities?: City[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStateRequest {
  name: string;
  code: string;
  countryId: string;
}

export interface UpdateStateRequest {
  name?: string;
  code?: string;
  countryId?: string;
}

// City types
export interface City {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  stateId: string;
  state?: State;
  addresses?: Address[];
  restaurants?: any[]; // Restaurant type from restaurant module
  restaurantCount?: number;
  distance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCityRequest {
  name: string;
  latitude?: number;
  longitude?: number;
  stateId: string;
}

export interface UpdateCityRequest {
  name?: string;
  latitude?: number;
  longitude?: number;
  stateId?: string;
}

// Address types
export interface Address {
  id: string;
  userId: string;
  user?: any; // User type from user module
  street: string;
  building?: string;
  apartment?: string;
  landmark?: string;
  cityId: string;
  city?: City;
  postalCode?: string;
  isDefault: boolean;
  type: AddressType;
  deliveryInstructions?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export const AddressType = {
  HOME: 'home',
  WORK: 'work',
  OTHER: 'other',
} as const;

export type AddressType = typeof AddressType[keyof typeof AddressType];

export interface CreateAddressRequest {
  userId?: string;
  street: string;
  building?: string;
  apartment?: string;
  landmark?: string;
  cityId: string;
  postalCode?: string;
  isDefault?: boolean;
  type?: AddressType;
  deliveryInstructions?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateAddressRequest {
  street?: string;
  building?: string;
  apartment?: string;
  landmark?: string;
  cityId?: string;
  postalCode?: string;
  isDefault?: boolean;
  type?: AddressType;
  deliveryInstructions?: string;
  latitude?: number;
  longitude?: number;
}

// Delivery validation types
export interface DeliveryValidationResponse {
  valid: boolean;
  distance?: number;
  estimatedTime?: number;
  cost?: number;
}

// Location statistics
export interface LocationStatistics {
  totalCountries: number;
  totalStates: number;
  totalCities: number;
  totalAddresses: number;
  citiesWithRestaurants: number;
  coveragePercentage: string;
}

// Kenya-specific types
export interface KenyanCityWithRestaurants {
  id: string;
  name: string;
  state?: string;
  country?: string;
  restaurantCount: number;
  distance?: number;
}

export interface NairobiArea {
  name: string;
  neighborhoods?: string[];
}

// Bulk operations
export interface BulkCreateCitiesRequest {
  cities: CreateCityRequest[];
}