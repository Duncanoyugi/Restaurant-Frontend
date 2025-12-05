import { baseApi } from '../../utils/baseApi';
import type {
  Country,
  CreateCountryRequest,
  UpdateCountryRequest,
  State,
  CreateStateRequest,
  UpdateStateRequest,
  City,
  CreateCityRequest,
  UpdateCityRequest,
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  DeliveryValidationResponse,
  LocationStatistics,
  KenyanCityWithRestaurants,
  BulkCreateCitiesRequest,
} from '../../types/location';

export const locationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Country endpoints
    createCountry: builder.mutation<Country, CreateCountryRequest>({
      query: (data) => ({
        url: 'location/countries',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Countries', 'LocationStats'],
    }),

    getAllCountries: builder.query<Country[], void>({
      query: () => ({
        url: 'location/countries',
        method: 'GET',
      }),
      providesTags: ['Countries'],
    }),

    getCountryById: builder.query<Country, string>({
      query: (id) => ({
        url: `location/countries/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Countries', id }],
    }),

    getCountryByIsoCode: builder.query<Country, string>({
      query: (isoCode) => ({
        url: `location/countries/iso/${isoCode}`,
        method: 'GET',
      }),
      providesTags: (result) => [{ type: 'Countries', id: result?.id }],
    }),

    updateCountry: builder.mutation<Country, { id: string; data: UpdateCountryRequest }>({
      query: ({ id, data }) => ({
        url: `location/countries/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Countries', id },
        'Countries',
        'LocationStats',
      ],
    }),

    deleteCountry: builder.mutation<void, string>({
      query: (id) => ({
        url: `location/countries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Countries', 'LocationStats'],
    }),

    // State endpoints
    createState: builder.mutation<State, CreateStateRequest>({
      query: (data) => ({
        url: 'location/states',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['States', 'LocationStats'],
    }),

    getAllStates: builder.query<State[], void>({
      query: () => ({
        url: 'location/states',
        method: 'GET',
      }),
      providesTags: ['States'],
    }),

    getStateById: builder.query<State, string>({
      query: (id) => ({
        url: `location/states/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'States', id }],
    }),

    getStatesByCountry: builder.query<State[], string>({
      query: (countryId) => ({
        url: `location/states/country/${countryId}`,
        method: 'GET',
      }),
      providesTags: ['States'],
    }),

    updateState: builder.mutation<State, { id: string; data: UpdateStateRequest }>({
      query: ({ id, data }) => ({
        url: `location/states/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'States', id },
        'States',
        'LocationStats',
      ],
    }),

    deleteState: builder.mutation<void, string>({
      query: (id) => ({
        url: `location/states/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['States', 'LocationStats'],
    }),

    // City endpoints
    createCity: builder.mutation<City, CreateCityRequest>({
      query: (data) => ({
        url: 'location/cities',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cities', 'LocationStats'],
    }),

    getAllCities: builder.query<City[], void>({
      query: () => ({
        url: 'location/cities',
        method: 'GET',
      }),
      providesTags: ['Cities'],
    }),

    getCityById: builder.query<City, string>({
      query: (id) => ({
        url: `location/cities/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Cities', id }],
    }),

    getCitiesByState: builder.query<City[], string>({
      query: (stateId) => ({
        url: `location/cities/state/${stateId}`,
        method: 'GET',
      }),
      providesTags: ['Cities'],
    }),

    updateCity: builder.mutation<City, { id: string; data: UpdateCityRequest }>({
      query: ({ id, data }) => ({
        url: `location/cities/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Cities', id },
        'Cities',
        'LocationStats',
      ],
    }),

    deleteCity: builder.mutation<void, string>({
      query: (id) => ({
        url: `location/cities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cities', 'LocationStats'],
    }),

    // Address endpoints
    createAddress: builder.mutation<Address, CreateAddressRequest>({
      query: (data) => ({
        url: 'location/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Addresses', 'MyAddresses', 'UserAddresses'],
    }),

    createMyAddress: builder.mutation<Address, CreateAddressRequest>({
      query: (data) => ({
        url: 'location/my/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Addresses', 'MyAddresses'],
    }),

    getAllAddresses: builder.query<Address[], void>({
      query: () => ({
        url: 'location/addresses',
        method: 'GET',
      }),
      providesTags: ['Addresses'],
    }),

    getAddressById: builder.query<Address, string>({
      query: (id) => ({
        url: `location/addresses/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Addresses', id }],
    }),

    getAddressesByUser: builder.query<Address[], string>({
      query: (userId) => ({
        url: `location/addresses/user/${userId}`,
        method: 'GET',
      }),
      providesTags: ['UserAddresses'],
    }),

    getDefaultAddress: builder.query<Address | null, string>({
      query: (userId) => ({
        url: `location/addresses/user/${userId}/default`,
        method: 'GET',
      }),
      providesTags: ['UserAddresses'],
    }),

    getMyAddresses: builder.query<Address[], void>({
      query: () => ({
        url: 'location/my/addresses',
        method: 'GET',
      }),
      providesTags: ['MyAddresses'],
    }),

    getMyDefaultAddress: builder.query<Address | null, void>({
      query: () => ({
        url: 'location/my/default-address',
        method: 'GET',
      }),
      providesTags: ['MyAddresses'],
    }),

    updateAddress: builder.mutation<Address, { id: string; data: UpdateAddressRequest }>({
      query: ({ id, data }) => ({
        url: `location/addresses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Addresses', id },
        'Addresses',
        'MyAddresses',
        'UserAddresses',
      ],
    }),

    deleteAddress: builder.mutation<void, string>({
      query: (id) => ({
        url: `location/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Addresses', 'MyAddresses', 'UserAddresses'],
    }),

    // Restaurant location endpoints
    getCitiesWithRestaurants: builder.query<City[], void>({
      query: () => ({
        url: 'location/cities/with-restaurants',
        method: 'GET',
      }),
      providesTags: ['Cities', 'RestaurantCities'],
    }),

    getPopularCitiesForRestaurants: builder.query<City[], { limit?: number }>({
      query: ({ limit = 10 } = {}) => ({
        url: 'location/cities/popular',
        method: 'GET',
        params: { limit },
      }),
      providesTags: ['Cities', 'RestaurantCities'],
    }),

    validateDeliveryAddress: builder.query<
      DeliveryValidationResponse, 
      { restaurantId: string; addressId: string }
    >({
      query: ({ restaurantId, addressId }) => ({
        url: `location/delivery/validate/${restaurantId}/${addressId}`,
        method: 'GET',
      }),
    }),

    // Location statistics (Admin only)
    getLocationStatistics: builder.query<LocationStatistics, void>({
      query: () => ({
        url: 'location/statistics',
        method: 'GET',
      }),
      providesTags: ['LocationStats'],
    }),

    // Bulk operations (Admin only)
    createBulkCities: builder.mutation<City[], BulkCreateCitiesRequest>({
      query: (data) => ({
        url: 'location/cities/bulk',
        method: 'POST',
        body: data.cities,
      }),
      invalidatesTags: ['Cities', 'LocationStats'],
    }),

    // Kenya-specific endpoints
    getKenyanMajorCities: builder.query<KenyanCityWithRestaurants[], void>({
      query: () => ({
        url: 'location/kenya/cities/major',
        method: 'GET',
      }),
      providesTags: ['KenyanCities'],
    }),

    findCitiesNearbyKenya: builder.query<
      KenyanCityWithRestaurants[], 
      { cityName: string; radius?: number }
    >({
      query: ({ cityName, radius = 50 }) => ({
        url: `location/kenya/cities/nearby/${cityName}`,
        method: 'GET',
        params: { radius },
      }),
      providesTags: ['KenyanCities'],
    }),

    getNairobiAreas: builder.query<string[], void>({
      query: () => ({
        url: 'location/kenya/nairobi/areas',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  // Country hooks
  useCreateCountryMutation,
  useGetAllCountriesQuery,
  useGetCountryByIdQuery,
  useGetCountryByIsoCodeQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,

  // State hooks
  useCreateStateMutation,
  useGetAllStatesQuery,
  useGetStateByIdQuery,
  useGetStatesByCountryQuery,
  useUpdateStateMutation,
  useDeleteStateMutation,

  // City hooks
  useCreateCityMutation,
  useGetAllCitiesQuery,
  useGetCityByIdQuery,
  useGetCitiesByStateQuery,
  useUpdateCityMutation,
  useDeleteCityMutation,

  // Address hooks
  useCreateAddressMutation,
  useCreateMyAddressMutation,
  useGetAllAddressesQuery,
  useGetAddressByIdQuery,
  useGetAddressesByUserQuery,
  useGetDefaultAddressQuery,
  useGetMyAddressesQuery,
  useGetMyDefaultAddressQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,

  // Restaurant location hooks
  useGetCitiesWithRestaurantsQuery,
  useGetPopularCitiesForRestaurantsQuery,
  useValidateDeliveryAddressQuery,

  // Location statistics hooks
  useGetLocationStatisticsQuery,

  // Bulk operations hooks
  useCreateBulkCitiesMutation,

  // Kenya-specific hooks
  useGetKenyanMajorCitiesQuery,
  useFindCitiesNearbyKenyaQuery,
  useGetNairobiAreasQuery,
} = locationApi;