import React, { useState } from 'react';
import { useGetMyRestaurantTablesQuery } from '../../features/reservations/reservationsApi';
import { useAppSelector } from '../../app/hooks';
import { TableStatusEnum } from '../../types/reservation';
import type { Table } from '../../types/reservation';

interface TableManagementProps {
  restaurantId: string;
}

const TableManagement: React.FC<TableManagementProps> = ({ }) => {
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied' | 'reserved' | 'cleaning'>('all');
  const [floorView, setFloorView] = useState<'grid' | 'floorplan'>('floorplan');

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Debug logs for authentication state
  console.log('TableManagement - isAuthenticated:', isAuthenticated, 'user:', user);
  console.log('Query condition (should run when true):', isAuthenticated && !!user);

  const { data: tablesData } = useGetMyRestaurantTablesQuery(undefined, {
    skip: !(isAuthenticated && !!user),
  });

  const tables = tablesData || [];

  const updateTableStatus = async (tableId: string, status: string, notes?: string) => {
    console.log('Updating table status:', tableId, status, notes);
    // TODO: Implement table status update
  };

  const getStatusFilter = (filterValue: string): string => {
    switch (filterValue) {
      case 'available': return TableStatusEnum.AVAILABLE;
      case 'occupied': return TableStatusEnum.OCCUPIED;
      case 'reserved': return TableStatusEnum.RESERVED;
      case 'cleaning': return TableStatusEnum.OUT_OF_SERVICE;
      default: return '';
    }
  };

  const filteredTables = tables.filter(table =>
    filter === 'all' || table.status === getStatusFilter(filter)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case TableStatusEnum.AVAILABLE: return 'bg-green-100 text-green-800 border-green-300';
      case TableStatusEnum.OCCUPIED: return 'bg-red-100 text-red-800 border-red-300';
      case TableStatusEnum.RESERVED: return 'bg-blue-100 text-blue-800 border-blue-300';
      case TableStatusEnum.OUT_OF_SERVICE: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case TableStatusEnum.AVAILABLE: return '✅';
      case TableStatusEnum.OCCUPIED: return '👥';
      case TableStatusEnum.RESERVED: return '📅';
      case TableStatusEnum.OUT_OF_SERVICE: return '🧹';
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
              {tables.filter(t => t.status === TableStatusEnum.AVAILABLE).length}
            </div>
            <div className="text-sm text-green-600">Available</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-700">
              {tables.filter(t => t.status === TableStatusEnum.OCCUPIED).length}
            </div>
            <div className="text-sm text-red-600">Occupied</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              {tables.filter(t => t.status === TableStatusEnum.RESERVED).length}
            </div>
            <div className="text-sm text-blue-600">Reserved</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700">
              {tables.filter(t => t.status === TableStatusEnum.OUT_OF_SERVICE).length}
            </div>
            <div className="text-sm text-yellow-600">Out of Service</div>
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
                {tables.filter(t => status === 'all' || t.status === getStatusFilter(status)).length}
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
  table: Table;
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => string;
}> = ({ table, onUpdateStatus, getStatusColor, getStatusIcon }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={`relative rounded-lg border-2 p-4 transition-all ${
      table.status === TableStatusEnum.AVAILABLE ? 'border-green-300 bg-green-50' :
      table.status === TableStatusEnum.OCCUPIED ? 'border-red-300 bg-red-50' :
      table.status === TableStatusEnum.RESERVED ? 'border-blue-300 bg-blue-50' :
      'border-yellow-300 bg-yellow-50'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-lg">Table {table.tableNumber}</div>
          <div className="text-sm text-gray-600">{table.location}</div>
          <div className="text-sm">Capacity: {table.capacity} seats</div>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(table.status)}`}>
          {getStatusIcon(table.status)} {table.status}
        </span>
      </div>

      {/* Upcoming Reservation */}
      {table.reservations && table.reservations.length > 0 && table.status !== TableStatusEnum.OCCUPIED && (
        <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
          <div className="font-medium text-sm text-blue-700">Reservation:</div>
          <div className="text-sm">{table.reservations[0].user?.name || 'Customer'}</div>
          <div className="text-xs text-gray-600">
            {table.reservations[0].guestCount} guests at {table.reservations[0].reservationTime}
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
          {table.status === TableStatusEnum.AVAILABLE && (
            <>
              <button
                onClick={() => onUpdateStatus(table.id, TableStatusEnum.OCCUPIED, 'Customer seated')}
                className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
              >
                Mark as Occupied
              </button>
              <button
                onClick={() => onUpdateStatus(table.id, TableStatusEnum.RESERVED)}
                className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
              >
                Mark as Reserved
              </button>
            </>
          )}
          {table.status === TableStatusEnum.OCCUPIED && (
            <>
              <button
                onClick={() => onUpdateStatus(table.id, TableStatusEnum.OUT_OF_SERVICE, 'Customer left')}
                className="w-full px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-sm"
              >
                Mark for Cleaning
              </button>
              <button
                onClick={() => onUpdateStatus(table.id, TableStatusEnum.AVAILABLE, 'Cleared manually')}
                className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
              >
                Mark as Available
              </button>
            </>
          )}
          {table.status === TableStatusEnum.RESERVED && (
            <>
              <button
                onClick={() => onUpdateStatus(table.id, TableStatusEnum.OCCUPIED, 'Reservation arrived')}
                className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
              >
                Customer Arrived
              </button>
              <button
                onClick={() => onUpdateStatus(table.id, TableStatusEnum.AVAILABLE, 'Reservation cancelled')}
                className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
              >
                Cancel Reservation
              </button>
            </>
          )}
          {table.status === TableStatusEnum.OUT_OF_SERVICE && (
            <button
              onClick={() => onUpdateStatus(table.id, TableStatusEnum.AVAILABLE, 'Cleaning completed')}
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