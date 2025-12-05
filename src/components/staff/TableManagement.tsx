import React, { useState } from 'react';

interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  location: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrder?: {
    id: string;
    orderNumber: string;
    customerName: string;
    startedAt: string;
    elapsedTime: number;
  };
  reservation?: {
    id: string;
    customerName: string;
    time: string;
    guestCount: number;
  };
}

interface TableManagementProps {
  restaurantId: string;
}

const TableManagement: React.FC<TableManagementProps> = ({ }) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied' | 'reserved'>('all');
  const [floorView, setFloorView] = useState<'grid' | 'floorplan'>('floorplan');

  // Mock data
  const mockTables: RestaurantTable[] = [
    {
      id: '1',
      tableNumber: '1',
      capacity: 2,
      location: 'Window',
      status: 'available',
      currentOrder: undefined,
      reservation: undefined
    },
    {
      id: '2',
      tableNumber: '2',
      capacity: 4,
      location: 'Center',
      status: 'occupied',
      currentOrder: {
        id: 'ORD-001',
        orderNumber: 'ORD-001',
        customerName: 'John Smith',
        startedAt: '2024-01-15T18:30:00Z',
        elapsedTime: 45
      },
      reservation: undefined
    },
    {
      id: '3',
      tableNumber: '3',
      capacity: 6,
      location: 'Patio',
      status: 'reserved',
      currentOrder: undefined,
      reservation: {
        id: 'RES-001',
        customerName: 'Sarah Johnson',
        time: '19:30',
        guestCount: 4
      }
    },
    {
      id: '4',
      tableNumber: '4',
      capacity: 2,
      location: 'Corner',
      status: 'cleaning',
      currentOrder: undefined,
      reservation: undefined
    },
    {
      id: '5',
      tableNumber: '5',
      capacity: 4,
      location: 'Window',
      status: 'available',
      currentOrder: undefined,
      reservation: undefined
    },
    {
      id: '6',
      tableNumber: '6',
      capacity: 8,
      location: 'Private Room',
      status: 'occupied',
      currentOrder: {
        id: 'ORD-002',
        orderNumber: 'ORD-002',
        customerName: 'Mike Wilson',
        startedAt: '2024-01-15T19:00:00Z',
        elapsedTime: 30
      },
      reservation: undefined
    },
    {
      id: '7',
      tableNumber: '7',
      capacity: 4,
      location: 'Center',
      status: 'available',
      currentOrder: undefined,
      reservation: undefined
    },
    {
      id: '8',
      tableNumber: '8',
      capacity: 2,
      location: 'Bar',
      status: 'occupied',
      currentOrder: {
        id: 'ORD-003',
        orderNumber: 'ORD-003',
        customerName: 'Emily Brown',
        startedAt: '2024-01-15T19:15:00Z',
        elapsedTime: 15
      },
      reservation: undefined
    }
  ];

  const tables = mockTables;

  const updateTableStatus = async (tableId: string, status: string, notes?: string) => {
    console.log('Updating table status:', tableId, status, notes);
    // Mock implementation
  };

  const filteredTables = tables.filter(table => 
    filter === 'all' || table.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-300';
      case 'occupied': return 'bg-red-100 text-red-800 border-red-300';
      case 'reserved': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cleaning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return '✅';
      case 'occupied': return '👥';
      case 'reserved': return '📅';
      case 'cleaning': return '🧹';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Table Management</h2>
            <p className="text-gray-600">Real-time table status and reservations</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => console.log('Refresh clicked')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {tables.filter(t => t.status === 'available').length}
            </div>
            <div className="text-sm text-green-600">Available</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">
              {tables.filter(t => t.status === 'occupied').length}
            </div>
            <div className="text-sm text-red-600">Occupied</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              {tables.filter(t => t.status === 'reserved').length}
            </div>
            <div className="text-sm text-blue-600">Reserved</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700">
              {tables.filter(t => t.status === 'cleaning').length}
            </div>
            <div className="text-sm text-yellow-600">Cleaning</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'available', 'occupied', 'reserved', 'cleaning'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-white/30">
                {tables.filter(t => status === 'all' || t.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Floor Plan View */}
      {floorView === 'floorplan' ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Floor Plan</h3>
          <div className="relative bg-gray-50 rounded-lg p-8 min-h-[600px] border-2 border-gray-200">
            {/* Simulated restaurant floor layout */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {filteredTables.map((table) => (
                <TableCard 
                  key={table.id} 
                  table={table} 
                  onUpdateStatus={updateTableStatus}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                />
              ))}
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow border border-gray-200">
              <h4 className="font-medium mb-2">Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                  <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
                  <span className="text-sm">Reserved</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                  <span className="text-sm">Cleaning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map((table) => (
            <TableCard 
              key={table.id} 
              table={table} 
              onUpdateStatus={updateTableStatus}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => console.log('Mark all for cleaning')}
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 text-center"
          >
            <div className="text-2xl mb-2">🧹</div>
            <div className="font-medium">Mark All for Cleaning</div>
          </button>
          <button
            onClick={() => console.log('Clear all occupied')}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 text-center"
          >
            <div className="text-2xl mb-2">✅</div>
            <div className="font-medium">Clear All Occupied</div>
          </button>
          <button
            onClick={() => setFloorView(floorView === 'grid' ? 'floorplan' : 'grid')}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-center"
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium">
              Switch to {floorView === 'grid' ? 'Floor Plan' : 'Grid'} View
            </div>
          </button>
          <button
            onClick={() => console.log('Refresh all')}
            className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 text-center"
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium">Refresh All</div>
          </button>
        </div>
      </div>
    </div>
  );
};

const TableCard: React.FC<{
  table: RestaurantTable;
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
}> = ({ table, onUpdateStatus, getStatusColor, getStatusIcon }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={`relative rounded-lg border-2 p-4 transition-all ${
      table.status === 'available' ? 'border-green-300 bg-green-50' :
      table.status === 'occupied' ? 'border-red-300 bg-red-50' :
      table.status === 'reserved' ? 'border-blue-300 bg-blue-50' :
      'border-yellow-300 bg-yellow-50'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-lg">Table {table.tableNumber}</div>
          <div className="text-sm text-gray-600">{table.location}</div>
          <div className="text-sm">Capacity: {table.capacity} seats</div>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(table.status)}`}>
          {getStatusIcon(table.status)} {table.status.toUpperCase()}
        </span>
      </div>

      {/* Current Order Info */}
      {table.currentOrder && (
        <div className="mb-3 p-3 bg-white/50 rounded border border-gray-200">
          <div className="font-medium text-sm">Current Order:</div>
          <div className="text-sm">#{table.currentOrder.orderNumber}</div>
          <div className="text-xs text-gray-600">{table.currentOrder.customerName}</div>
          <div className="text-xs text-gray-600">Time: {table.currentOrder.elapsedTime}m</div>
        </div>
      )}

      {/* Upcoming Reservation */}
      {table.reservation && table.status !== 'occupied' && (
        <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
          <div className="font-medium text-sm text-blue-700">Reservation:</div>
          <div className="text-sm">{table.reservation.customerName}</div>
          <div className="text-xs text-gray-600">
            {table.reservation.guestCount} guests at {table.reservation.time}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => setShowActions(!showActions)}
        className="w-full mt-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
      >
        {showActions ? 'Hide Actions' : 'Show Actions'}
      </button>

      {/* Action Menu */}
      {showActions && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
          {table.status === 'available' && (
            <>
              <button
                onClick={() => onUpdateStatus(table.id, 'occupied', 'Customer seated')}
                className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
              >
                Mark as Occupied
              </button>
              <button
                onClick={() => onUpdateStatus(table.id, 'reserved')}
                className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
              >
                Mark as Reserved
              </button>
            </>
          )}
          {table.status === 'occupied' && (
            <>
              <button
                onClick={() => onUpdateStatus(table.id, 'cleaning', 'Customer left')}
                className="w-full px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm"
              >
                Mark for Cleaning
              </button>
              <button
                onClick={() => onUpdateStatus(table.id, 'available', 'Cleared manually')}
                className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
              >
                Mark as Available
              </button>
            </>
          )}
          {table.status === 'reserved' && (
            <>
              <button
                onClick={() => onUpdateStatus(table.id, 'occupied', 'Reservation arrived')}
                className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
              >
                Customer Arrived
              </button>
              <button
                onClick={() => onUpdateStatus(table.id, 'available', 'Reservation cancelled')}
                className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
              >
                Cancel Reservation
              </button>
            </>
          )}
          {table.status === 'cleaning' && (
            <button
              onClick={() => onUpdateStatus(table.id, 'available', 'Cleaning completed')}
              className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
            >
              Mark as Clean & Available
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableManagement;