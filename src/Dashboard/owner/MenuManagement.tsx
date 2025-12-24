import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { PlusCircle, Edit, Trash2, Upload, List, Search, Utensils, Coffee, Dessert } from 'lucide-react';

interface MenuCategory {
  id: number;
  name: string;
  description?: string;
}

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
  available: boolean;
  isFeatured: boolean;
  preparationTime?: number;
  calories?: number;
  allergens?: string[];
}

const MenuManagement: React.FC = () => {
  const { selectedRestaurant } = useRestaurant();
  
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  
  // Form state for creating/editing menu items
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    available: true,
    isFeatured: false,
    preparationTime: 0,
    calories: 0,
    allergens: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories and menu items
  useEffect(() => {
    const fetchMenuData = async () => {
      if (!selectedRestaurant) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        const categoriesResponse = await fetch(`/api/menu/categories/restaurant/${selectedRestaurant.id}`);
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        // Fetch menu items
        const itemsResponse = await fetch(`/api/menu/items/restaurant/${selectedRestaurant.id}`);
        if (!itemsResponse.ok) throw new Error('Failed to fetch menu items');
        const itemsData = await itemsResponse.json();
        setMenuItems(itemsData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu data');
        console.error('Error fetching menu data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, [selectedRestaurant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'allergens') {
      setFormData(prev => ({ ...prev, allergens: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      return data.url; // Assuming the backend returns the URL
    } catch (err) {
      console.error('Error uploading image:', err);
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
      
      // Upload image first if there's a new image
      let imageUrl = editItem?.imageUrl || '';
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      
      const menuItemData = {
        ...formData,
        restaurantId: selectedRestaurant.id,
        imageUrl,
        allergens: formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : []
      };
      
      let response;
      if (editItem) {
        // Update existing menu item
        response = await fetch(`/api/menu/items/${editItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(menuItemData)
        });
      } else {
        // Create new menu item
        response = await fetch('/api/menu/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(menuItemData)
        });
      }
      
      if (!response.ok) {
        throw new Error(editItem ? 'Failed to update menu item' : 'Failed to create menu item');
      }
      
      // Refresh menu items
      const updatedResponse = await fetch(`/api/menu/items/restaurant/${selectedRestaurant.id}`);
      const updatedData = await updatedResponse.json();
      setMenuItems(updatedData);
      
      // Reset form
      setShowCreateForm(false);
      setEditItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        available: true,
        isFeatured: false,
        preparationTime: 0,
        calories: 0,
        allergens: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      categoryId: String(item.categoryId),
      available: item.available,
      isFeatured: item.isFeatured,
      preparationTime: item.preparationTime || 0,
      calories: item.calories || 0,
      allergens: item.allergens?.join(', ') || ''
    });
    setImagePreview(item.imageUrl || null);
    setShowCreateForm(true);
  };

  const handleDelete = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/menu/items/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }
      
      // Refresh menu items
      if (selectedRestaurant) {
        const updatedResponse = await fetch(`/api/menu/items/restaurant/${selectedRestaurant.id}`);
        const updatedData = await updatedResponse.json();
        setMenuItems(updatedData);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete menu item');
      console.error('Error deleting menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (categoryName: string) => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('food') || lowerName.includes('main')) return <Utensils className="w-4 h-4" />;
    if (lowerName.includes('drink') || lowerName.includes('beverage')) return <Coffee className="w-4 h-4" />;
    if (lowerName.includes('dessert')) return <Dessert className="w-4 h-4" />;
    return <List className="w-4 h-4" />;
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
          <Utensils className="w-6 h-6" />
          Menu Management
        </h1>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditItem(null);
            setFormData({
              name: '',
              description: '',
              price: 0,
              categoryId: '',
              available: true,
              isFeatured: false,
              preparationTime: 0,
              calories: 0,
              allergens: ''
            });
            setImageFile(null);
            setImagePreview(null);
          }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          {showCreateForm ? 'Cancel' : 'Add Menu Item'}
        </button>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'items' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            <List className="w-4 h-4" />
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'categories' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            <List className="w-4 h-4" />
            Categories
          </button>
        </div>
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
            <Utensils className="w-5 h-5" />
            {editItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preparation Time (min)</label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calories</label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allergens (comma separated)</label>
                <input
                  type="text"
                  name="allergens"
                  value={formData.allergens}
                  onChange={handleInputChange}
                  placeholder="e.g., nuts, dairy, gluten"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {imageFile ? 'Change Image' : 'Upload Image'}
                  </button>
                  {imagePreview && (
                    <div className="flex items-center gap-2">
                      <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{imageFile?.name}</span>
                    </div>
                  )}
                </div>
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
                  {editItem ? 'Update Menu Item' : 'Add Menu Item'}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Menu Items
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search menu items..."
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
                <div key={index} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No menu items found. Add your first menu item!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const category = categories.find(c => c.id === item.categoryId);
                return (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category?.name || '')}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {category?.name || 'Uncategorized'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                    )}
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{item.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary-600 dark:text-primary-400">${item.price.toFixed(2)}</span>
                      <div className="flex gap-2">
                        {item.available && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-800 dark:text-green-100">
                            Available
                          </span>
                        )}
                        {item.isFeatured && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-800 dark:text-blue-100">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <List className="w-5 h-5" />
              Menu Categories
            </h2>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(category.name)}
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;