import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useGetRestaurantByIdQuery } from '../../features/restaurants/unifiedRestaurantApi';
import { useGetMenuItemsQuery, useCreateMenuItemMutation, useUpdateMenuItemMutation, useDeleteMenuItemMutation, useGetCategoriesQuery, useCreateCategoryMutation } from '../../features/menu/menuApi';
import { type MenuItem, type Category } from '../../types/menu';
import { UserRoleEnum } from '../../types/user';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/input';
import { Building2, Plus, Edit, Trash2, Search, DollarSign, Clock, ChefHat } from 'lucide-react';

const MenuManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: restaurant, isLoading: restaurantLoading } = useGetRestaurantByIdQuery(id || '', {
    skip: !id,
  });

  const { data: menuItems, isLoading: menuLoading, refetch: refetchMenu } = useGetMenuItemsQuery({ restaurantId: id }, {
    skip: !id,
  });

  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery({ restaurantId: id }, {
    skip: !id,
  });

  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const [createCategory] = useCreateCategoryMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    preparationTime: '',
    available: true
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  const filteredItems = menuItems?.data?.filter((item: MenuItem) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || item.category === selectedCategory)
  ) || [];

  const handleAddItem = async () => {
    if (!id || !itemForm.name || !itemForm.price || !itemForm.categoryId) return;

    try {
      const itemData = {
        restaurantId: id,
        categoryId: itemForm.categoryId,
        name: itemForm.name,
        description: itemForm.description,
        ingredients: itemForm.description || 'No ingredients specified',
        price: parseFloat(itemForm.price),
        imageUrl: '',
        available: itemForm.available,
        preparationTime: parseInt(itemForm.preparationTime) || 15,
        allergens: []
      };

      if (editingItem) {
        await updateMenuItem({ id: editingItem.id, data: itemData }).unwrap();
        setSuccess('Menu item updated successfully!');
      } else {
        await createMenuItem(itemData).unwrap();
        setSuccess('Menu item added successfully!');
      }

      setItemForm({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        preparationTime: '',
        available: true
      });
      setEditingItem(null);
      setIsItemDialogOpen(false);
      refetchMenu();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save menu item');
      console.error('Error saving menu item:', err);
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: categories?.find(cat => cat.name === item.category)?.id.toString() || '',
      preparationTime: item.preparationTime.toString(),
      available: item.available
    });
    setIsItemDialogOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteMenuItem(itemId).unwrap();
      setSuccess('Menu item deleted successfully!');
      refetchMenu();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to delete menu item');
      console.error('Error deleting menu item:', err);
    }
  };

  const handleAddCategory = async () => {
    if (!id || !categoryForm.name) return;

    try {
      await createCategory({
        restaurantId: id,
        name: categoryForm.name,
        description: categoryForm.description
      }).unwrap();

      setSuccess('Category added successfully!');
      setCategoryForm({ name: '', description: '' });
      setIsCategoryDialogOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add category');
      console.error('Error adding category:', err);
    }
  };

  if (restaurantLoading || menuLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Restaurant not found</span>
        </div>
        <Button onClick={() => navigate('/restaurants')} className="mt-4">
          Back to Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button onClick={() => navigate(`/restaurants/${restaurant.id}/owner`)} variant="outline" className="mb-4">
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold flex items-center">
          <Building2 className="w-8 h-8 mr-3 text-primary" />
          {restaurant.name} Menu Management
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {success}</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          >
            <option value="all">All Categories</option>
            {categories?.map((category: Category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsCategoryDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </button>
          <button
            onClick={() => setIsItemDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Menu Items Found</h2>
          <p className="text-gray-600">This restaurant doesn't have any menu items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item: MenuItem) => (
            <Card key={item.id.toString()} className="hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                    {(user?.role === UserRoleEnum.RESTAURANT_OWNER || user?.role === UserRoleEnum.ADMIN) && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {item.price.toFixed(2)}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.preparationTime} min
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Menu Item Dialog */}
      {isItemDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Grilled Chicken"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe the dish..."
                  value={itemForm.description}
                  onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={itemForm.price}
                  onChange={(e) => setItemForm({...itemForm, price: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  value={itemForm.categoryId}
                  onChange={(e) => setItemForm({...itemForm, categoryId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                >
                  <option value="">Select Category</option>
                  {categories?.map((category: Category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Preparation Time (minutes)
                </label>
                <Input
                  id="prepTime"
                  type="number"
                  placeholder="15"
                  value={itemForm.preparationTime}
                  onChange={(e) => setItemForm({...itemForm, preparationTime: e.target.value})}
                />
              </div>
              <div className="flex items-center">
                <input
                  id="available"
                  type="checkbox"
                  checked={itemForm.available}
                  onChange={(e) => setItemForm({...itemForm, available: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="available" className="text-sm font-medium text-gray-700">
                  Available
                </label>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setIsItemDialogOpen(false);
                    setEditingItem(null);
                    setItemForm({
                      name: '',
                      description: '',
                      price: '',
                      categoryId: '',
                      preparationTime: '',
                      available: true
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  disabled={!itemForm.name || !itemForm.price || !itemForm.categoryId}
                  className={`px-4 py-2 rounded-lg text-white ${
                    !itemForm.name || !itemForm.price || !itemForm.categoryId
                      ? 'bg-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Dialog */}
      {isCategoryDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <Input
                  id="categoryName"
                  type="text"
                  placeholder="e.g., Main Courses"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="categoryDesc" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="categoryDesc"
                  placeholder="Describe the category..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  rows={2}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setIsCategoryDialogOpen(false);
                    setCategoryForm({ name: '', description: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!categoryForm.name}
                  className={`px-4 py-2 rounded-lg text-white ${
                    !categoryForm.name ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
