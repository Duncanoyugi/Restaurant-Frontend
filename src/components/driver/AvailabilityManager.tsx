import React, { useState } from 'react';

interface AvailabilityManagerProps {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
}

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ isOnline, setIsOnline }) => {
  const [workingHours, setWorkingHours] = useState({
    start: '08:00',
    end: '17:00'
  });
  const [breakTime, setBreakTime] = useState({
    start: '13:00',
    end: '14:00'
  });
  const [autoAccept, setAutoAccept] = useState(true);
  const [maxDistance, setMaxDistance] = useState(10); // in km

  const toggleAvailability = () => {
    setIsOnline(!isOnline);
  };

  const handleSaveSettings = () => {
    // In real app, this would save to backend
    console.log('Saving settings:', { workingHours, breakTime, autoAccept, maxDistance });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Availability Manager</h2>
        <p className="text-gray-600">Manage your working hours and availability settings</p>
      </div>

      {/* Availability Status Card */}
      <div className={`rounded-xl p-6 mb-8 ${isOnline ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'} text-white`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              {isOnline ? 'You are currently ONLINE' : 'You are currently OFFLINE'}
            </h3>
            <p className="opacity-90">
              {isOnline 
                ? 'You are receiving delivery requests and earning money!' 
                : 'Go online to start receiving delivery requests.'}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={toggleAvailability}
              className={`px-8 py-3 rounded-lg font-bold text-lg ${isOnline ? 'bg-white text-green-600 hover:bg-gray-100' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
            {isOnline && (
              <div className="absolute -top-2 -right-2">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" />
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm opacity-80">Working Hours</div>
            <div className="font-semibold">{workingHours.start} - {workingHours.end}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Auto Accept</div>
            <div className="font-semibold">{autoAccept ? 'Enabled' : 'Disabled'}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">Max Distance</div>
            <div className="font-semibold">{maxDistance} km</div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Working Hours */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={workingHours.start}
                  onChange={(e) => setWorkingHours({...workingHours, start: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={workingHours.end}
                  onChange={(e) => setWorkingHours({...workingHours, end: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Auto Accept Settings */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Auto Accept</h3>
                <p className="text-sm text-gray-600">Automatically accept incoming delivery requests</p>
              </div>
              <button
                onClick={() => setAutoAccept(!autoAccept)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${autoAccept ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${autoAccept ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className={`p-4 rounded-lg ${autoAccept ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-start">
                <svg className={`w-5 h-5 mt-0.5 mr-2 ${autoAccept ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">
                  {autoAccept 
                    ? 'Delivery requests will be automatically accepted based on your preferences.'
                    : 'You will need to manually accept each delivery request.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Break Time */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Break Time</h3>
            <p className="text-sm text-gray-600 mb-4">Set your preferred break time to avoid receiving requests</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break Start</label>
                <input
                  type="time"
                  value={breakTime.start}
                  onChange={(e) => setBreakTime({...breakTime, start: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break End</label>
                <input
                  type="time"
                  value={breakTime.end}
                  onChange={(e) => setBreakTime({...breakTime, end: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Distance Preferences */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distance Preferences</h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Maximum Delivery Distance</span>
                <span className="text-sm font-semibold text-blue-600">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">
                  Setting a lower maximum distance helps optimize your routes and reduces travel time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;