import React, { useState } from 'react';

const LocationTracker: React.FC = () => {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    lat: -1.286389,
    lng: 36.817223,
    address: 'Nairobi CBD, Kenya'
  });

  // Mock current delivery location
  const [deliveryLocation] = useState({
    lat: -1.290000,
    lng: 36.820000,
    address: 'Westlands, Nairobi',
    customerName: 'John Smith',
    estimatedArrival: '15 min'
  });

  const toggleLocation = () => {
    setLocationEnabled(!locationEnabled);
    if (!locationEnabled) {
      // In real app, this would trigger geolocation API
      setCurrentLocation({
        lat: -1.286389,
        lng: 36.817223,
        address: 'Nairobi CBD, Kenya'
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Location Tracker</h2>
        <p className="text-gray-600">Track your location and navigation</p>
      </div>

      {/* Location Status Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold mb-2">Location Services</h3>
            <p className="opacity-90 mb-4">
              {locationEnabled 
                ? 'Your location is being shared with the system for optimal delivery routing.' 
                : 'Location services are disabled. Enable to receive deliveries.'}
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLocation}
                className={`px-6 py-2 rounded-lg font-medium ${locationEnabled ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {locationEnabled ? 'Disable Location' : 'Enable Location'}
              </button>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${locationEnabled ? 'bg-green-400' : 'bg-red-400'}`} />
                <span>{locationEnabled ? 'Location Active' : 'Location Inactive'}</span>
              </div>
            </div>
          </div>
          <div className="text-5xl opacity-20">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Map Visualization (Mock) */}
      <div className="bg-gray-800 rounded-xl overflow-hidden mb-8">
        <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Navigation Map</h4>
            <p className="text-sm text-gray-300">Route to customer location</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">ETA: {deliveryLocation.estimatedArrival}</span>
            <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-sm">
              Start Navigation
            </button>
          </div>
        </div>
        
        <div className="relative h-64 bg-gray-900">
          {/* Mock map visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Route line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-500 transform -translate-y-1/2" />
              
              {/* Current location marker */}
              <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white text-gray-900 px-2 py-1 rounded text-sm shadow">
                    You are here
                  </div>
                </div>
              </div>
              
              {/* Destination marker */}
              <div className="absolute right-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg" />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white text-gray-900 px-2 py-1 rounded text-sm shadow">
                    {deliveryLocation.customerName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-900 text-white border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-400">Current Location</div>
              <div className="font-medium">{currentLocation.address}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Destination</div>
              <div className="font-medium">{deliveryLocation.address}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Distance</div>
              <div className="font-medium">3.2 km • {deliveryLocation.estimatedArrival}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Current Location</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Address</div>
              <div className="font-medium">{currentLocation.address}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Latitude</div>
                <div className="font-medium">{currentLocation.lat}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Longitude</div>
                <div className="font-medium">{currentLocation.lng}</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500 mb-2">Last Updated</div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span className="font-medium">Just now</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Delivery Details</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Customer</div>
              <div className="font-medium">{deliveryLocation.customerName}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Delivery Address</div>
              <div className="font-medium">{deliveryLocation.address}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Distance</div>
                <div className="font-medium">3.2 km</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">ETA</div>
                <div className="font-medium">{deliveryLocation.estimatedArrival}</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Navigate with Google Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationTracker;