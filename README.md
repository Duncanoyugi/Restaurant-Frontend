# Restaurant Management System - Frontend

A modern, responsive React frontend for a comprehensive restaurant management system built with TypeScript, Redux Toolkit, and Tailwind CSS.

## Overview

This frontend application provides a complete user interface for multi-restaurant operations, supporting five user roles:
- **Customer** - End users who browse, order, and make reservations
- **Restaurant Staff** - Kitchen and front-of-house employees
- **Driver** - Delivery drivers
- **Restaurant Owner** - Business owners managing their restaurants
- **Administrator** - Platform-wide system administration

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Date Handling**: date-fns

---

## User Roles & Dashboards

### 1. Customer Portal (`/Dashboard/customer`)
**Features:**
- `CustomerDashboard.tsx` - Overview with recent orders, reservations
- `CustomerOrders.tsx` - Order history with filtering
- `OrderDetails.tsx` - Individual order details
- `OrderTracking.tsx` - Real-time order/delivery tracking
- `CustomerReservations.tsx` - Table and room bookings
- `ReservationDetails.tsx` - Booking details
- `CustomerProfile.tsx` - Profile management
- `CustomerReviews.tsx` - Leave and view reviews
- `Favourites.tsx` - Favorite restaurants
- `Rewards.tsx` - Loyalty program points
- `roomBooking.tsx` - Accommodation bookings

### 2. Restaurant Staff Dashboard (`/Dashboard/staff`)
**Features:**
- `StaffDashboard.tsx` - Staff overview
- `KitchenDashboard.tsx` - Kitchen order queue management
- `StaffOrders.tsx` - View and manage restaurant orders
- `DailyReservations.tsx` - Today's reservations
- `TableManagement.tsx` - Table status management
- `StockOverview.tsx` - Low stock alerts

### 3. Driver Portal (`/Dashboard/driver`)
**Features:**
- `DriverDashboard.tsx` - Delivery overview
- Active deliveries list
- Delivery status updates
- Vehicle information management

### 4. Restaurant Owner Dashboard (`/Dashboard/owner`)
**Features:**
- `OwnerDashboard.tsx` - Business overview with metrics
- `MenuManagement.tsx` - Menu items and categories CRUD
- `RestaurantOrders.tsx` - All restaurant orders
- `ReservationManagement.tsx` - Table reservations
- `RoomManagement.tsx` - Room/venue bookings
- `StaffManagement.tsx` - Staff CRUD operations
  - `StaffList.tsx` - Staff listing
  - `StaffCreate.tsx` - Add new staff
  - `StaffEdit.tsx` - Edit staff
  - `StaffView.tsx` - Staff details
- `TableManagement.tsx` - Restaurant table management
- `DriverManagement.tsx` - Driver assignments
- `RestaurantInventory.tsx` - Stock management
- `RestaurantReviews.tsx` - View and respond to reviews
- `PaymentHistory.tsx` - Payment transactions

### 5. Admin Dashboard (`/Dashboard/admin`)
**Features:**
- `AdminDashboard.tsx` - Platform-wide overview
- `UserManagement.tsx` - User CRUD operations
- `RestaurantManagement.tsx` - Restaurant onboarding/management
- `OrderManagement.tsx` - All orders across restaurants
- `ReservationManagement.tsx` - All reservations
- `RoomBookingManagement.tsx` - All room bookings
- `PaymentManagement.tsx` - Payment monitoring
- `InventoryOverview.tsx` - Cross-restaurant inventory
- `Deliverymanagement.tsx` - Delivery tracking
- `ReviewModeration.tsx` - Review approval
- `NotificationCenter.tsx` - System notifications

---

## Features & API Integration

### 1. Authentication (`features/auth`)
**API Endpoints:**
- `useLoginMutation` - User login
- `useRegisterMutation` - User registration
- `useVerifyOtpMutation` - Email verification
- `useResendOtpMutation` - Resend OTP
- `useLogoutMutation` - User logout
- `useGetProfileQuery` - Get user profile
- `useRefreshTokenMutation` - Refresh JWT token
- `useUpdateProfileMutation` - Update profile
- `useChangePasswordMutation` - Change password
- `useForgotPasswordMutation` - Password reset request
- `useResetPasswordMutation` - Reset password

**Pages:**
- `LoginPage.tsx` - Login form
- `RegisterPage.tsx` - Registration form
- `VerifyOtp.tsx` - OTP verification
- `ForgotPasswordPage.tsx` - Forgot password
- `ResetPasswordPage.tsx` - Reset password

### 2. Menu Management (`features/menu`)
**API Endpoints:**
- `useCreateCategoryMutation` - Create menu category
- `useGetCategoriesQuery` - List categories
- `useGetCategoryByIdQuery` - Get category by ID
- `useUpdateCategoryMutation` - Update category
- `useDeleteCategoryMutation` - Delete category
- `useCreateMenuItemMutation` - Create menu item
- `useCreateBulkMenuItemsMutation` - Bulk create items
- `useGetMenuItemsQuery` - List menu items
- `useGetMenuItemByIdQuery` - Get item by ID
- `useUpdateMenuItemMutation` - Update item
- `useToggleMenuItemAvailabilityMutation` - Toggle availability
- `useDeleteMenuItemMutation` - Delete item
- `useGetRestaurantMenuQuery` - Restaurant menu
- `useGetRestaurantFeaturedItemsQuery` - Featured items
- `useGetRestaurantPriceRangeQuery` - Price range
- `useGetRestaurantMenuStatisticsQuery` - Menu stats
- `useSearchMenuItemsQuery` - Search items
- `useFilterMenuItemsByAllergensQuery` - Filter by allergens
- `useGetGlobalFeaturedItemsQuery` - Global featured
- `useGetMyRestaurantMenuQuery` - Owner's menu
- `useGetMyRestaurantStatisticsQuery` - Owner's stats

### 3. Order Management (`features/orders`)
**API Endpoints:**
- `useGetAllOrdersQuery` - All orders (admin/owner)
- `useGetOrderByIdQuery` - Order by ID
- `useGetOrderByNumberQuery` - Order by number
- `useUpdateOrderMutation` - Update order
- `useDeleteOrderMutation` - Delete order
- `useUpdateOrderStatusMutation` - Update status
- `useGetOrderStatusHistoryQuery` - Status history
- `useAssignDriverMutation` - Assign driver
- `useGetKitchenOrdersQuery` - Kitchen queue
- `useGetDeliveryOrdersQuery` - Delivery orders
- `useGetOrderStatisticsQuery` - Order analytics
- `useGetRestaurantOrdersTodayQuery` - Today's orders
- `useGetMyOrdersQuery` - Customer's orders
- `useCancelMyOrderMutation` - Cancel order
- `useGetMyDeliveriesQuery` - Driver's deliveries
- `useGetMyRestaurantOrdersQuery` - Owner's orders

### 4. Shopping Cart (`features/cart`)
**Features:**
- `addToCart` - Add item to cart
- `removeFromCart` - Remove item
- `updateQuantity` - Update quantity
- `clearCart` - Clear cart

**Properties:**
- Cart items with id, name, price, quantity, image
- Restaurant ID tracking (one restaurant per cart)
- Total price calculation

### 5. Reservations (`features/reservations`)
**API Endpoints:**
- `useCreateTableMutation` - Create table
- `useGetAllTablesQuery` - List tables
- `useGetTableByIdQuery` - Table by ID
- `useUpdateTableMutation` - Update table
- `useDeleteTableMutation` - Delete table
- `useCreateReservationMutation` - Create reservation
- `useGetAllReservationsQuery` - List reservations
- `useGetReservationByIdQuery` - Reservation by ID
- `useGetReservationByNumberQuery` - By number
- `useUpdateReservationMutation` - Update reservation
- `useUpdateReservationStatusMutation` - Update status
- `useCancelReservationMutation` - Cancel
- `useCheckAvailabilityQuery` - Check table availability
- `useFindAvailableTablesQuery` - Find available tables
- `useGetReservationStatsQuery` - Reservation analytics
- `useGetUpcomingReservationsQuery` - Upcoming
- `useGetDailyReservationsQuery` - Daily list
- `useGetMyReservationsQuery` - User's reservations
- `useGetMyRestaurantReservationsQuery` - Owner's reservations
- `useGetMyRestaurantTablesQuery` - Owner's tables

### 6. Room/Accommodation Booking (`features/booking`)
**API Endpoints:**
- `useCreateRoomMutation` - Create room
- `useGetAllRoomsQuery` - List rooms
- `useSearchAvailableRoomsQuery` - Search available
- `useGetRoomByIdQuery` - Room by ID
- `useUpdateRoomMutation` - Update room
- `useDeleteRoomMutation` - Delete room
- `useCreateRoomBookingMutation` - Book room
- `useGetAllRoomBookingsQuery` - List bookings
- `useGetBookingByIdQuery` - Booking by ID
- `useGetBookingByNumberQuery` - By booking number
- `useUpdateBookingMutation` - Update booking
- `useUpdateBookingStatusMutation` - Update status
- `useCancelBookingMutation` - Cancel booking
- `useCheckRoomAvailabilityQuery` - Check availability
- `useGetRoomOccupancyQuery` - Occupancy stats
- `useGetUpcomingCheckInsQuery` - Upcoming check-ins
- `useGetUpcomingCheckOutsQuery` - Upcoming check-outs

**Pages:**
- `AccommodationPage.tsx` - Browse rooms
- `RoomDetailsPage.tsx` - Room details

### 7. Payments (`features/payments`)
**API Endpoints:**
- `useInitializePaymentMutation` - Initialize Paystack
- `useVerifyPaymentMutation` - Verify payment
- `useGetAllPaymentsQuery` - All payments (admin)
- `useGetPaymentByIdQuery` - Payment by ID
- `useGetPaymentByReferenceQuery` - By reference
- `useGetUserPaymentsQuery` - User payment history
- `useGetMyPaymentsQuery` - Current user payments
- `useGetRestaurantPaymentsQuery` - Restaurant payments
- `useUpdatePaymentMutation` - Update payment (admin)
- `useDeletePaymentMutation` - Delete payment (admin)
- `useInitiateRefundMutation` - Initiate refund
- `useGetInvoiceQuery` - Get invoice

**Pages:**
- `CheckoutPage.tsx` - Payment checkout
- `PaymentVerificationPage.tsx` - Verify payment
- `PaymentCallbackPage.tsx` - Paystack callback

### 8. Delivery Management (`features/delivery`)
**API Endpoints:**
- `useCreateVehicleInfoMutation` - Add vehicle info
- `useGetVehicleInfoByUserIdQuery` - Get vehicle
- `useUpdateVehicleInfoMutation` - Update vehicle
- `useDeleteVehicleInfoMutation` - Delete vehicle
- `useCreateDeliveryTrackingMutation` - Create tracking
- `useUpdateDriverLocationMutation` - Update location
- `useGetDeliveryTrackingByOrderIdQuery` - Get tracking
- `useGetLiveDeliveryTrackingQuery` - Live tracking
- `useAssignDeliveryMutation` - Assign driver
- `useFindAvailableDriversQuery` - Available drivers
- `useCalculateDeliveryEstimateMutation` - Calculate estimate
- `useGetDriverDeliveryStatsQuery` - Driver stats
- `useGetDeliveryPerformanceQuery` - Performance analytics
- `useGetMyDeliveryStatsQuery` - My stats
- `useGetMyActiveDeliveriesQuery` - Active deliveries
- `useGetActiveDeliveryTrackingQuery` - Active tracking
- `useGetDriverDeliveriesQuery` - Driver history

**Components:**
- `VehicleManagement.tsx` - Driver vehicle CRUD

### 9. Inventory Management (`features/inventory`)
**API Endpoints:**
- `useCreateSupplierMutation` - Add supplier
- `useGetAllSuppliersQuery` - List suppliers
- `useGetSupplierByIdQuery` - Supplier by ID
- `useUpdateSupplierMutation` - Update supplier
- `useDeleteSupplierMutation` - Delete supplier
- `useCreateInventoryItemMutation` - Add item
- `useGetAllInventoryItemsQuery` - List items
- `useGetInventoryItemByIdQuery` - Item by ID
- `useUpdateInventoryItemMutation` - Update item
- `useDeleteInventoryItemMutation` - Delete item
- `useCreateStockTransactionMutation` - Stock transaction
- `useGetStockTransactionsQuery` - Transaction history
- `useAdjustStockMutation` - Adjust stock
- `useTransferStockMutation` - Transfer between locations
- `useGetLowStockItemsQuery` - Low stock alerts
- `useGetExpiringItemsQuery` - Expiring items
- `useGetInventoryValueQuery` - Total value
- `useGetCategoryBreakdownQuery` - Category breakdown
- `useGetStockMovementReportQuery` - Movement report
- `useGetItemsNeedingReorderQuery` - Reorder suggestions
- `useGetMyRestaurantInventoryItemsQuery` - Owner's items
- `useGetMyRestaurantLowStockItemsQuery` - Owner's low stock
- `useGetMyRestaurantInventoryAnalyticsQuery` - Owner's analytics
- `useCheckItemStockQuery` - Check stock level

### 10. Reviews (`features/reviews`)
**API Endpoints:**
- `useCreateReviewMutation` - Create review
- `useGetAllReviewsQuery` - List reviews
- `useGetRestaurantReviewsQuery` - Restaurant reviews
- `useGetMenuItemReviewsQuery` - Menu item reviews
- `useGetReviewByIdQuery` - Review by ID
- `useUpdateReviewMutation` - Update review
- `useDeleteReviewMutation` - Delete review
- `useGetReviewStatisticsQuery` - Global stats
- `useGetRestaurantReviewStatsQuery` - Restaurant stats
- `useGetMenuItemReviewStatsQuery` - Item stats
- `useAddReviewResponseMutation` - Add response
- `useUpdateReviewResponseMutation` - Update response
- `useDeleteReviewResponseMutation` - Delete response
- `useVerifyReviewMutation` - Approve review
- `useRejectReviewMutation` - Reject review
- `useGetMyReviewsQuery` - User's reviews
- `useCanReviewQuery` - Check if can review
- `useMarkHelpfulMutation` - Mark helpful
- `useReportReviewMutation` - Report review

### 11. Restaurants (`features/restaurants`)
**API Endpoints:**
- `useGetAllRestaurantsQuery` - List restaurants
- `useGetRestaurantByIdQuery` - Restaurant by ID
- `useCreateRestaurantMutation` - Create restaurant
- `useUpdateRestaurantMutation` - Update restaurant
- `useDeleteRestaurantMutation` - Delete restaurant
- `useGetRestaurantStatisticsQuery` - Statistics
- `useGetDefaultRestaurantQuery` - Default restaurant
- `useFindNearbyRestaurantsQuery` - Nearby search
- `useGetPopularRestaurantsInCityQuery` - Popular in city
- `useCreateStaffAssignmentMutation` - Assign staff
- `useGetStaffAssignmentsByRestaurantQuery` - Staff assignments
- `useDeleteStaffAssignmentMutation` - Remove assignment
- `useCreateDriverAssignmentMutation` - Assign driver
- `useGetDriverAssignmentsByRestaurantQuery` - Driver assignments
- `useDeleteDriverAssignmentMutation` - Remove driver
- `useCreateStaffMutation` - Create staff member
- `useGetAllStaffQuery` - List all staff
- `useGetStaffByIdQuery` - Staff by ID
- `useUpdateStaffMutation` - Update staff
- `useDeleteStaffMutation` - Delete staff
- `useCreateShiftMutation` - Create shift
- `useGetShiftsByStaffQuery` - Staff shifts
- `useGetShiftsByRestaurantQuery` - Restaurant shifts
- `useUpdateShiftMutation` - Update shift
- `useDeleteShiftMutation` - Delete shift

### 12. Notifications (`features/notifications`)
- Push notifications
- In-app notifications
- Notification preferences

### 13. Analytics (`features/analytics`)
- Business metrics
- User behavior tracking

---

## Public Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `LandingPage.tsx` | Home page |
| `/menu` | `MenuPage.tsx` | Browse menu |
| `/accommodation` | `AccommodationPage.tsx` | Room booking |
| `/reservations` | `ReservationsPage.tsx` | Table booking |
| `/about` | `AboutPage.tsx` | About |
| `/contact` | `ContactPage.tsx` | Contact |
| `/restaurants` | `RestaurantList.tsx` | Restaurant listing |
| `/restaurants/:id` | `RestaurantDetail.tsx` | Restaurant details |
| `/cart` | `CartPage.tsx` | Shopping cart |

---

## Routing Structure (`routing/AppRouter.tsx`)

```tsx
// Public Routes
/                     -> LandingPage
/login                -> LoginPage (redirect if authenticated)
/register             -> RegisterPage
/verify-otp           -> VerifyOtpPage
/forgot-password      -> ForgotPasswordPage
/reset-password       -> ResetPasswordPage
/menu                 -> MenuPage
/accommodation        -> AccommodationPage
/rooms/:id            -> RoomDetailsPage
/reservations        -> ReservationsPage
/about                -> AboutPage
/contact              -> ContactPage
/restaurants          -> RestaurantList
/restaurants/:id      -> RestaurantDetail

// Protected Routes
/select-restaurant    -> SelectRestaurant (authenticated)
/restaurant-setup    -> RestaurantSetup (owner only)
/cart                 -> CartPage
/checkout             -> CheckoutPage
/payment/verify       -> PaymentVerificationPage
/payments/callback    -> PaymentCallbackPage
/dashboard/*         -> RoleBasedDashboard (all authenticated)
```

---

## State Management

### Redux Slices (`features/*/`)
- `auth/authSlice.ts` - Authentication state
- `cart/cartSlice.ts` - Shopping cart
- `booking/bookingSlice.ts` - Booking data
- `customer/customerSlice.ts` - Customer data
- `notifications/notificationsSlice.ts` - Notifications

### RTK Query APIs
API integration handled via RTK Query with base API configured in `utils/baseApi.ts`

---

## Components

### UI Components (`components/ui/`)
- `Button.tsx` - Button component
- `Card.tsx` - Card component
- `Input.tsx` - Input field
- `Modal.tsx` - Modal dialog
- `Table.tsx` - Data table
- `Badge.tsx` - Status badges
- `Toast.tsx` - Toast notifications
- `Loader.tsx` - Loading spinner
- `Pagination.tsx` - Pagination
- `ImageSlider.tsx` - Image gallery
- `HeroSection.tsx` - Hero banner
- `PasswordInput.tsx` - Password field
- `ThemeToggle.tsx` - Dark/light mode
- `AnimatedSection.tsx` - Animations

### Contexts (`contexts/`)
- `ThemeContext.tsx` - Theme management
- `ToastContext.tsx` - Toast notifications
- `RestaurantContext.tsx` - Restaurant selection
- `StaffContext.tsx` - Staff data
- `SocketContext.tsx` - WebSocket connection
- `WebSocketContext.tsx` - Real-time updates

---

## Project Structure

```
frontend/src/
├── app/                    # Redux store configuration
│   └── hooks.ts           # Typed Redux hooks
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── layout/            # Layout components
│   ├── dashboard/         # Dashboard layouts
│   ├── admin/             # Admin components
│   ├── customer/          # Customer components
│   ├── driver/            # Driver components
│   ├── staff/             # Staff components
│   └── restaurant/        # Restaurant components
├── contexts/              # React contexts
├── Dashboard/             # Role-based dashboards
│   ├── admin/
│   ├── customer/
│   ├── driver/
│   ├── owner/
│   └── staff/
├── features/              # Redux slices and RTK Query APIs
│   ├── analytics/
│   ├── auth/
│   ├── booking/
│   ├── cart/
│   ├── customer/
│   ├── delivery/
│   ├── inventory/
│   ├── menu/
│   ├── notifications/
│   ├── orders/
│   ├── payments/
│   ├── reservations/
│   ├── restaurant/
│   └── reviews/
├── pages/                 # Route page components
│   ├── Auth/
│   ├── Restaurants/
│   └── (other pages)
├── routing/               # Router configuration
├── types/                 # TypeScript definitions
└── utils/                 # Utilities and API config
```

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_key
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Backend API running

### Installation
```bash
npm install
npm run dev
```

Application runs at `http://localhost:5173`

---

## Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run lint` - ESLint

---

## License

UNLICENSED
