import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../contexts/RestaurantContext';
import { PlusCircle, Edit, Trash2, Search, LayoutGrid, Users, DollarSign } from 'lucide-react';

interface Table {
    id: number;
    tableNumber: string;
    capacity: number;
    location?: string;
    status: 'Available' | 'Reserved' | 'Occupied';
    minimumCharge?: number;
}

const TableManagement: React.FC = () => {
    const { selectedRestaurant } = useRestaurant();

    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editTable, setEditTable] = useState<Table | null>(null);

    // Form state for creating/editing tables
    const [formData, setFormData] = useState({
        tableNumber: '',
        capacity: 2,
        location: 'Indoor',
        status: 'Available',
        minimumCharge: 0
    });

    // Fetch tables for the current restaurant
    useEffect(() => {
        const fetchTables = async () => {
            if (!selectedRestaurant) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch tables from backend using /reservations/tables endpoint
                const response = await fetch(`/api/reservations/tables?restaurantId=${selectedRestaurant.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch tables');
                }

                const data = await response.json();
                setTables(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch tables');
                console.error('Error fetching tables:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, [selectedRestaurant]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
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

            const tableData = {
                ...formData,
                restaurantId: selectedRestaurant.id
            };

            let response;
            if (editTable) {
                // Update existing table
                response = await fetch(`/api/reservations/tables/${editTable.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tableData)
                });
            } else {
                // Create new table
                response = await fetch('/api/reservations/tables', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tableData)
                });
            }

            if (!response.ok) {
                throw new Error(editTable ? 'Failed to update table' : 'Failed to create table');
            }

            // Refresh tables list
            const updatedResponse = await fetch(`/api/reservations/tables?restaurantId=${selectedRestaurant.id}`);
            const updatedData = await updatedResponse.json();
            setTables(updatedData);

            // Reset form
            setShowCreateForm(false);
            setEditTable(null);
            setFormData({
                tableNumber: '',
                capacity: 2,
                location: 'Indoor',
                status: 'Available',
                minimumCharge: 0
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (table: Table) => {
        setEditTable(table);
        setFormData({
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            location: table.location || 'Indoor',
            status: table.status,
            minimumCharge: table.minimumCharge || 0
        });
        setShowCreateForm(true);
    };

    const handleDelete = async (tableId: number) => {
        if (!window.confirm('Are you sure you want to delete this table?')) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/reservations/tables/${tableId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete table');
            }

            // Refresh tables list
            if (selectedRestaurant) {
                const updatedResponse = await fetch(`/api/reservations/tables?restaurantId=${selectedRestaurant.id}`);
                const updatedData = await updatedResponse.json();
                setTables(updatedData);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete table');
            console.error('Error deleting table:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTables = tables.filter(table =>
        table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (table.location && table.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
                    <LayoutGrid className="w-6 h-6" />
                    Table Management
                </h1>
                <button
                    onClick={() => {
                        setShowCreateForm(!showCreateForm);
                        setEditTable(null);
                        setFormData({
                            tableNumber: '',
                            capacity: 2,
                            location: 'Indoor',
                            status: 'Available',
                            minimumCharge: 0
                        });
                    }}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" />
                    {showCreateForm ? 'Cancel' : 'Add Table'}
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
                        <LayoutGrid className="w-5 h-5" />
                        {editTable ? 'Edit Table' : 'Add New Table'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Table Number/Name</label>
                                <input
                                    type="text"
                                    name="tableNumber"
                                    value={formData.tableNumber}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., T1, A5, VIP-1"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Capacity (Seats)</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    max="50"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location/Zone</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Main Hall, Patio, VIP"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="Available">Available</option>
                                    <option value="Reserved">Reserved</option>
                                    <option value="Occupied">Occupied</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Charge ($)</label>
                                <input
                                    type="number"
                                    name="minimumCharge"
                                    value={formData.minimumCharge}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                                />
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
                                    {editTable ? 'Update Table' : 'Add Table'}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5" />
                        Tables List
                    </h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tables..."
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
                ) : tables.length === 0 ? (
                    <div className="text-center py-8">
                        <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No tables found. Add your first table!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredTables.map((table) => (
                            <div
                                key={table.id}
                                className={`border rounded-lg p-4 flex flex-col items-center justify-center relative hover:shadow-md transition-shadow 
                  ${table.status === 'Available' ? 'bg-green-50 border-green-200' :
                                        table.status === 'Reserved' ? 'bg-yellow-50 border-yellow-200' :
                                            'bg-red-50 border-red-200'}`}
                            >
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button
                                        onClick={() => handleEdit(table)}
                                        className="text-gray-500 hover:text-blue-600 p-1"
                                    >
                                        <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(table.id)}
                                        className="text-gray-500 hover:text-red-600 p-1"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="text-2xl font-bold mb-1">{table.tableNumber}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{table.location}</div>

                                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                                    <Users className="w-3 h-3" />
                                    <span>{table.capacity} Seats</span>
                                </div>

                                {table.minimumCharge && table.minimumCharge > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <DollarSign className="w-3 h-3" />
                                        <span>Min: ${table.minimumCharge}</span>
                                    </div>
                                )}

                                <span className={`mt-2 px-2 py-0.5 rounded-full text-xs font-medium
                  ${table.status === 'Available' ? 'bg-green-200 text-green-800' :
                                        table.status === 'Reserved' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-red-200 text-red-800'}`}>
                                    {table.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableManagement;
