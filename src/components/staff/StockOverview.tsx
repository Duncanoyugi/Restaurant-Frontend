import React, { useState } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  threshold: number;
  unitPrice: number;
  totalValue: number;
  supplier: string;
  lastUpdated: string;
  status: 'normal' | 'low' | 'critical' | 'out_of_stock';
}

interface StockOverviewProps {
  restaurantId: string;
}

const StockOverview: React.FC<StockOverviewProps> = ({ }) => {
  const [categories] = useState<string[]>(['all', 'Vegetables', 'Meat', 'Dairy', 'Beverages', 'Grains']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);

  // Mock data
  const mockItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Tomatoes',
      category: 'Vegetables',
      quantity: 25,
      unit: 'kg',
      threshold: 10,
      unitPrice: 120,
      totalValue: 3000,
      supplier: 'Fresh Farm',
      lastUpdated: '2024-01-15T10:00:00Z',
      status: 'normal'
    },
    {
      id: '2',
      name: 'Chicken Breast',
      category: 'Meat',
      quantity: 8,
      unit: 'kg',
      threshold: 15,
      unitPrice: 450,
      totalValue: 3600,
      supplier: 'Prime Meats',
      lastUpdated: '2024-01-15T09:30:00Z',
      status: 'low'
    },
    {
      id: '3',
      name: 'Milk',
      category: 'Dairy',
      quantity: 5,
      unit: 'liters',
      threshold: 20,
      unitPrice: 80,
      totalValue: 400,
      supplier: 'Dairy Fresh',
      lastUpdated: '2024-01-15T08:45:00Z',
      status: 'critical'
    },
    {
      id: '4',
      name: 'Rice',
      category: 'Grains',
      quantity: 0,
      unit: 'kg',
      threshold: 25,
      unitPrice: 150,
      totalValue: 0,
      supplier: 'Grain Co.',
      lastUpdated: '2024-01-14T16:20:00Z',
      status: 'out_of_stock'
    },
    {
      id: '5',
      name: 'Coca Cola',
      category: 'Beverages',
      quantity: 48,
      unit: 'cans',
      threshold: 24,
      unitPrice: 60,
      totalValue: 2880,
      supplier: 'Beverage Distributors',
      lastUpdated: '2024-01-15T11:15:00Z',
      status: 'normal'
    },
    {
      id: '6',
      name: 'Beef',
      category: 'Meat',
      quantity: 12,
      unit: 'kg',
      threshold: 10,
      unitPrice: 600,
      totalValue: 7200,
      supplier: 'Prime Meats',
      lastUpdated: '2024-01-15T10:30:00Z',
      status: 'normal'
    }
  ];

  const items = mockItems;
  const lowStockItems = items.filter(item => item.status === 'low' || item.status === 'critical' || item.status === 'out_of_stock');

  const updateStockQuantity = async (itemId: string, newQuantity: number, reason: string) => {
    console.log('Updating stock:', itemId, newQuantity, reason);
    // Mock implementation
  };

  const filteredItems = items.filter(item => {
    // Filter by category
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    
    // Filter by low stock only
    if (showLowStockOnly && item.status === 'normal') {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-300';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'critical': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'out_of_stock': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return '✅';
      case 'low': return '⚠️';
      case 'critical': return '🚨';
      case 'out_of_stock': return '❌';
      default: return '❓';
    }
  };

  const calculateTotalValue = () => {
    return filteredItems.reduce((total, item) => total + item.totalValue, 0);
  };

  const calculateCategoryBreakdown = () => {
    const breakdown: Record<string, { count: number, value: number }> = {};
    
    filteredItems.forEach(item => {
      if (!breakdown[item.category]) {
        breakdown[item.category] = { count: 0, value: 0 };
      }
      breakdown[item.category].count++;
      breakdown[item.category].value += item.totalValue;
    });
    
    return Object.entries(breakdown).map(([category, data]) => ({
      category,
      ...data
    })).sort((a, b) => b.value - a.value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Stock Overview</h2>
            <p className="text-gray-600">Monitor inventory levels and stock alerts</p>
          </div>
          <button
            onClick={() => console.log('Refresh clicked')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800">{items.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">
              {lowStockItems.filter(item => item.status === 'critical' || item.status === 'out_of_stock').length}
            </div>
            <div className="text-sm text-red-600">Critical</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700">
              {lowStockItems.filter(item => item.status === 'low').length}
            </div>
            <div className="text-sm text-yellow-600">Low Stock</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              KSh {calculateTotalValue().toLocaleString()}
            </div>
            <div className="text-sm text-blue-600">Total Value</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowStockOnly"
                checked={showLowStockOnly}
                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="lowStockOnly" className="ml-2 text-sm text-gray-700">
                Show low stock only
              </label>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {calculateCategoryBreakdown().map((category) => (
            <div key={category.category} className="flex items-center">
              <div className="w-32 text-sm font-medium text-gray-700">
                {category.category}
              </div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(category.value / calculateTotalValue()) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-32 text-right text-sm font-medium">
                {category.count} items • KSh {category.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🚨</div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Low Stock Alert</h3>
                <p className="text-red-600">{lowStockItems.length} items need attention</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Generate Order List
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.slice(0, 6).map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-red-300">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{item.name}</div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)} {item.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{item.category}</div>
                <div className="flex justify-between text-sm">
                  <span>Current: {item.quantity} {item.unit}</span>
                  <span className="text-red-600">Threshold: {item.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">All Inventory Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{item.quantity} {item.unit}</div>
                    <div className="text-xs text-gray-500">Threshold: {item.threshold}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)} {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    KSh {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    KSh {item.totalValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => updateStockQuantity(item.id, item.quantity + 10, 'Restocked')}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Restock
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Items Found</h3>
            <p className="text-gray-500">No inventory items match your current filter</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-center">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium">Generate Stock Report</div>
          </button>
          <button className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-center">
            <div className="text-2xl mb-2">🛒</div>
            <div className="font-medium">Create Purchase Order</div>
          </button>
          <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">View Stock History</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockOverview;