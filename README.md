# Restaurant Management System - Frontend

A modern, responsive React frontend for a comprehensive restaurant management system built with TypeScript, Redux Toolkit, and Tailwind CSS.

## Overview

This frontend application provides a complete user interface for restaurant operations, supporting multiple user roles including customers, staff, drivers, restaurant owners, and administrators.

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## Features

### 🎯 Multi-Role Support

#### 👤 Customer Portal
- Browse restaurant menu and categories
- Place orders with cart functionality
- Make reservations for tables/accommodation
- Track order status and delivery
- View order history
- Payment processing with Paystack
- Leave reviews and ratings

#### 👨‍🍳 Restaurant Staff
- Kitchen order management
- Table and reservation management
- Inventory stock monitoring
- Daily reservations overview
- Order processing and status updates

#### 🚚 Driver Portal
- Delivery assignment management
- Real-time delivery tracking
- Vehicle information management
- Delivery status updates
- Route optimization

#### 👑 Restaurant Owner
- Complete business oversight
- Analytics and reporting
- Staff management
- Menu management
- Financial reports
- Customer insights

#### 🛡️ Administrator
- System-wide user management
- Restaurant onboarding
- Platform analytics
- Payment monitoring
- System configuration

### 🛒 Core Functionality

#### Shopping Cart
- Add/remove menu items
- Quantity management
- Price calculations
- Persistent cart state

#### Menu Management
- Category-based browsing
- Search and filtering
- Item details and customization
- Availability status

#### Order Management
- Real-time order tracking
- Status notifications
- Order history
- Reordering functionality

#### Reservation System
- Table booking
- Accommodation booking
- Date/time selection
- Guest management

#### Payment Integration
- Paystack payment gateway
- Secure payment processing
- Invoice generation
- Payment verification

## Project Structure

```
frontend/src/
├── app/                    # Redux store configuration
├── components/             # Reusable UI components
│   ├── admin/             # Admin-specific components
│   ├── customer/          # Customer components
│   ├── driver/            # Driver components
│   ├── staff/             # Staff components
│   ├── dashboard/         # Dashboard layout components
│   ├── Forms/             # Form components
│   ├── layout/            # Layout components
│   ├── ui/                # Base UI components
│   └── ...
├── contexts/              # React contexts
├── Dashboard/             # Role-based dashboard pages
│   ├── admin/
│   ├── customer/
│   ├── driver/
│   ├── owner/
│   └── staff/
├── features/              # Redux slices and API logic
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
│   ├── reviews/
│   └── users/
├── pages/                 # Route-based page components
├── routing/               # Routing configuration
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions and API setup
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## State Management

### Redux Store Structure

The application uses Redux Toolkit with the following slices:

- **auth**: User authentication and profile
- **cart**: Shopping cart state
- **booking**: Reservation and booking data
- **customer**: Customer-specific data
- **notifications**: System notifications

### RTK Query APIs

API integration is handled through RTK Query with endpoints for:
- Authentication
- Menu management
- Order processing
- User management
- Analytics
- Notifications

## Routing

### Public Routes
- `/` - Landing page
- `/menu` - Restaurant menu
- `/accommodation` - Accommodation booking
- `/reservations` - Table reservations
- `/about` - About page
- `/contact` - Contact page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset
- `/reset-password` - Password reset confirmation
- `/verify-otp` - Email verification

### Protected Routes
- `/dashboard/*` - Role-based dashboard (auto-routed based on user role)
- `/cart` - Shopping cart
- `/checkout` - Payment checkout

## User Roles & Permissions

### Customer
- View menu and place orders
- Make reservations
- Track deliveries
- Manage profile

### Restaurant Staff
- Manage kitchen orders
- Handle reservations
- Monitor inventory
- Update order status

### Driver
- View assigned deliveries
- Update delivery status
- Manage vehicle info
- Track routes

### Restaurant Owner
- All staff permissions
- Financial reporting
- Staff management
- Menu configuration

### Administrator
- System administration
- User management across restaurants
- Platform analytics
- Payment monitoring

## UI Components

### Design System
- **Tailwind CSS** for styling
- **Responsive design** for all screen sizes
- **Dark/Light theme** support
- **Consistent component library**

### Key Components
- **Navigation**: Responsive header with role-based menus
- **Dashboard Layout**: Sidebar navigation with content areas
- **Forms**: Validated forms with error handling
- **Modals**: Confirmation and data entry modals
- **Tables**: Data tables with sorting and filtering
- **Charts**: Analytics visualizations

## API Integration

The frontend communicates with the NestJS backend API:

- **Base URL**: Configurable via environment variables
- **Authentication**: JWT tokens with automatic refresh
- **Error Handling**: Global error boundaries and toast notifications
- **Loading States**: Skeleton loaders and loading indicators

## Development Guidelines

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component composition over inheritance

### State Management
- Redux for global state
- RTK Query for server state
- Local component state for UI concerns

### Performance
- Code splitting with React.lazy
- Image optimization
- Bundle analysis
- Caching strategies

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider (Netlify, Vercel, etc.)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the established code style
2. Add TypeScript types for new features
3. Test components and functionality
4. Update documentation as needed

## License

This project is licensed under the UNLICENSED license.
