import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { useGetVehicleInfoByUserIdQuery, useUpdateVehicleInfoMutation } from '../../features/delivery/deliveryApi';
import { VehicleType } from '../../types/delivery';

const VehicleManagement: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const { data: vehicleData } = useGetVehicleInfoByUserIdQuery(user?.id || '', {
    skip: !user?.id
  });
  const [updateVehicle] = useUpdateVehicleInfoMutation();

  const vehicleInfo = vehicleData || {
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: new Date().getFullYear(),
    licensePlate: '',
    vehicleColor: '',
    vehicleType: VehicleType.CAR,
    insuranceExpiry: '',
    registrationExpiry: ''
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...vehicleInfo });

  const handleEdit = async () => {
    if (isEditing) {
      // Save changes
      try {
        await updateVehicle({
          userId: user?.id || '',
          data: formData
        }).unwrap();
        console.log('Vehicle info updated successfully');
      } catch (error) {
        console.error('Failed to update vehicle info:', error);
      }
    } else {
      setFormData({ ...vehicleInfo });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
        <p className="text-gray-600">Manage your vehicle information and maintenance</p>
      </div>

      {/* Vehicle Status Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{vehicleInfo.vehicleMake} {vehicleInfo.vehicleModel}</h3>
                <p className="text-gray-300">{vehicleInfo.licensePlate} • {vehicleInfo.vehicleYear}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-400">Vehicle Type</div>
                <div className="font-semibold">{vehicleInfo.vehicleType}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Color</div>
                <div className="font-semibold">{vehicleInfo.vehicleColor || 'Not specified'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Insurance</div>
                <div className="font-semibold">{vehicleInfo.insuranceExpiry ? 'Valid' : 'Not set'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Registration</div>
                <div className="font-semibold">{vehicleInfo.registrationExpiry ? 'Valid' : 'Not set'}</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleEdit}
            className={`px-6 py-2 rounded-lg font-medium ${isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isEditing ? 'Save Changes' : 'Edit Vehicle'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Information */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="vehicleMake"
                      value={formData.vehicleMake}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{vehicleInfo.vehicleMake}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{vehicleInfo.vehicleModel}</div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="vehicleYear"
                      value={formData.vehicleYear}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{vehicleInfo.vehicleYear}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{vehicleInfo.licensePlate}</div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="vehicleColor"
                      value={formData.vehicleColor || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{vehicleInfo.vehicleColor || 'Not specified'}</div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  {isEditing ? (
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="motorcycle">Motorcycle</option>
                      <option value="car">Car</option>
                      <option value="tricycle">Tricycle</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="van">Van</option>
                      <option value="truck">Truck</option>
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">{vehicleInfo.vehicleType}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Maintenance & Documents */}
        <div className="space-y-6">

          {/* Document Expiry */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Expiry</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-medium text-gray-900">Insurance Expiry</div>
                    <div className="text-sm text-gray-600">Third-party insurance</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${vehicleInfo.insuranceExpiry && new Date(vehicleInfo.insuranceExpiry) < new Date('2024-02-15') ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'} text-sm font-medium`}>
                    {vehicleInfo.insuranceExpiry || 'Not set'}
                  </div>
                </div>
                {isEditing && (
                  <input
                    type="date"
                    name="insuranceExpiry"
                    value={formData.insuranceExpiry}
                    onChange={handleChange}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-medium text-gray-900">Registration Expiry</div>
                    <div className="text-sm text-gray-600">Vehicle registration</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${vehicleInfo.registrationExpiry && new Date(vehicleInfo.registrationExpiry) < new Date('2024-03-15') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-sm font-medium`}>
                    {vehicleInfo.registrationExpiry || 'Not set'}
                  </div>
                </div>
                {isEditing && (
                  <input
                    type="date"
                    name="registrationExpiry"
                    value={formData.registrationExpiry}
                    onChange={handleChange}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.32 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm text-red-800">
                    Documents expiring soon! Please renew your insurance and registration to avoid penalties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Save Vehicle Information
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;