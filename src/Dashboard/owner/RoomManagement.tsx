import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { PlusCircle, Edit, Trash2, Upload, Search, Bed, Hotel, Wifi, Tv, Coffee, Bath, Car } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  pricePerNight: number;
  amenities?: string[];
  imageUrl?: string;
  imageGallery?: string[];
  available: boolean;
}

const RoomManagement: React.FC = () => {
  const { selectedRestaurant } = useRestaurant();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  
  // Form state for creating/editing rooms
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: 1,
    pricePerNight: 0,
    available: true,
    amenities: ''
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch rooms for the current restaurant
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedRestaurant) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch rooms from backend
        const response = await fetch(`/api/rooms/restaurant/${selectedRestaurant.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, [selectedRestaurant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'amenities') {
      setFormData(prev => ({ ...prev, amenities: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setImageFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const uploadImages = async (): Promise<{ imageUrl?: string; imageGallery?: string[] }> => {
    if (imageFiles.length === 0) return {};
    
    try {
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to upload images');
      
      const data = await response.json();
      return {
        imageUrl: data.urls[0],
        imageGallery: data.urls
      };
    } catch (err) {
      console.error('Error uploading images:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRestaurant) {
      setError('No restaurant selected');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Upload images first if there are new images
      let imageData = {
        imageUrl: editRoom?.imageUrl,
        imageGallery: editRoom?.imageGallery
      };
      
      if (imageFiles.length > 0) {
        const uploadedImages = await uploadImages();
        imageData = {
          imageUrl: uploadedImages.imageUrl,
          imageGallery: uploadedImages.imageGallery
        };
      }
      
      const roomData = {
        ...formData,
        restaurantId: selectedRestaurant.id,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
        ...imageData
      };
      
      let response;
      if (editRoom) {
        // Update existing room
        response = await fetch(`/api/rooms/${editRoom.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(roomData)
        });
      } else {
        // Create new room
        response = await fetch('/api/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(roomData)
        });
      }
      
      if (!response.ok) {
        throw new Error(editRoom ? 'Failed to update room' : 'Failed to create room');
      }
      
      // Refresh rooms list
      const updatedResponse = await fetch(`/api/rooms/restaurant/${selectedRestaurant.id}`);
      const updatedData = await updatedResponse.json();
      setRooms(updatedData);
      
      // Reset form
      setShowCreateForm(false);
      setEditRoom(null);
      setFormData({
        name: '',
        description: '',
        capacity: 1,
        pricePerNight: 0,
        available: true,
        amenities: ''
      });
      setImageFiles([]);
      setImagePreviews([]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room: Room) => {
    setEditRoom(room);
    setFormData({
      name: room.name,
      description: room.description || '',
      capacity: room.capacity,
      pricePerNight: room.pricePerNight,
      available: room.available,
      amenities: room.amenities?.join(', ') || ''
    });
    setImagePreviews(room.imageGallery || []);
    setShowCreateForm(true);
  };

  const handleDelete = async (roomId: number) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete room');
      }
      
      // Refresh rooms list
      if (selectedRestaurant) {
        const updatedResponse = await fetch(`/api/rooms/restaurant/${selectedRestaurant.id}`);
        const updatedData = await updatedResponse.json();
        setRooms(updatedData);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete room');
      console.error('Error deleting room:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (lowerAmenity.includes('tv') || lowerAmenity.includes('television')) return <Tv className="w-4 h-4" />;
    if (lowerAmenity.includes('coffee') || lowerAmenity.includes('tea')) return <Coffee className="w-4 h-4" />;
    if (lowerAmenity.includes('bath') || lowerAmenity.includes('shower')) return <Bath className="w-4 h-4" />;
    if (lowerAmenity.includes('parking')) return <Car className="w-4 h-4" />;
    return <Bed className="w-4 h-4" />;
  };

  if (!selectedRestaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Info!</strong>
          <span className="block sm:inline"> Please select a restaurant first.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Hotel className="w-6 h-6" />
          Room Management
        </h1>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditRoom(null);
            setFormData({
              name: '',
              description: '',
              capacity: 1,
              pricePerNight: 0,
              available: true,
              amenities: ''
            });
            setImageFiles([]);
            setImagePreviews([]);
          }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {showCreateForm ? 'Cancel' : 'Add Room'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bed className="w-5 h-5" />
            {editRoom ? 'Edit Room' : 'Add New Room'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Deluxe Suite, Standard Room"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Per Night ($)</label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity (People)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available for Booking</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe the room features, size, view, etc."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amenities (comma separated)</label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="e.g., Free WiFi, TV, Mini Bar, Air Conditioning, Balcony"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Images</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {imageFiles.length > 0 ? `${imageFiles.length} Files Selected` : 'Upload Images'}
                  </button>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <img key={index} src={preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Processing...
                </span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  {editRoom ? 'Update Room' : 'Add Room'}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Hotel className="w-5 h-5" />
            Rooms List
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-8">
            <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No rooms found. Add your first room!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <div key={room.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {room.capacity} {room.capacity === 1 ? 'Person' : 'People'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {room.imageUrl && (
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{room.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{room.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    ${room.pricePerNight.toFixed(2)} / night
                  </span>
                  {room.available ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-800 dark:text-green-100">
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full dark:bg-red-800 dark:text-red-100">
                      Booked
                    </span>
                  )}
                </div>
                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;