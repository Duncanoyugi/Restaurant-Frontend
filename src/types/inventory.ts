// src/types/inventory.ts

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  rating?: number;
  active: boolean;
  notes?: string;
  inventoryItems?: InventoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierRequest {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  rating?: number;
  active?: boolean;
  notes?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  rating?: number;
  active?: boolean;
  notes?: string;
}

// Inventory Item types
export interface InventoryItem {
  id: string;
  restaurantId: string;
  restaurant?: any; // Restaurant type from restaurant module
  supplierId?: string;
  supplier?: Supplier;
  name: string;
  sku?: string;
  description?: string;
  category: string;
  unit: string;
  quantity: number;
  threshold: number;
  unitPrice: number;
  expiryDate?: string;
  batchNumber?: string;
  storageLocation?: string;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  isActive: boolean;
  lastRestocked?: string;
  notes?: string;
  transactions?: StockTransaction[];
  createdAt: string;
  updatedAt: string;
}

export const UnitType = {
  KILOGRAM: 'kg',
  GRAM: 'g',
  LITER: 'L',
  MILLILITER: 'ml',
  PIECE: 'pcs',
  BOX: 'box',
  BOTTLE: 'bottle',
  CAN: 'can',
  PACK: 'pack',
  DOZEN: 'dozen',
} as const;

export type UnitType = typeof UnitType[keyof typeof UnitType];

export interface CreateInventoryItemRequest {
  restaurantId: string;
  supplierId?: string;
  name: string;
  sku?: string;
  description?: string;
  category: string;
  unit: string;
  quantity: number;
  threshold?: number;
  unitPrice: number;
  expiryDate?: string;
  batchNumber?: string;
  storageLocation?: string;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateInventoryItemRequest {
  restaurantId?: string;
  supplierId?: string;
  name?: string;
  sku?: string;
  description?: string;
  category?: string;
  unit?: string;
  quantity?: number;
  threshold?: number;
  unitPrice?: number;
  expiryDate?: string;
  batchNumber?: string;
  storageLocation?: string;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  isActive?: boolean;
  notes?: string;
}

// Stock Transaction types
export interface StockTransaction {
  id: string;
  inventoryItemId: string;
  inventoryItem?: InventoryItem;
  quantityChange: number;
  transactionType: TransactionType;
  reason: string;
  referenceId?: string;
  performedBy: string;
  performedByUser?: any; // User type from user module
  createdAt: string;
  updatedAt: string;
}

export const TransactionType = {
  IN: 'in',
  OUT: 'out',
  ADJUSTMENT: 'adjustment',
  TRANSFER: 'transfer',
  WRITE_OFF: 'write_off',
  RETURN: 'return',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface CreateStockTransactionRequest {
  inventoryItemId: string;
  quantityChange: number;
  transactionType: TransactionType;
  reason: string;
  referenceId?: string;
}

export interface StockAdjustmentRequest {
  inventoryItemId: string;
  newQuantity: number;
  reason: string;
}

export interface StockTransferRequest {
  fromInventoryItemId: string;
  toInventoryItemId: string;
  quantity: number;
  reason?: string;
}

export interface StockTransferResponse {
  fromTransaction: StockTransaction;
  toTransaction: StockTransaction;
  fromItem: InventoryItem;
  toItem: InventoryItem;
}

// Search and Filter types
export interface InventorySearchRequest {
  restaurantId?: string;
  supplierId?: string;
  category?: string;
  name?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface SupplierSearchRequest {
  name?: string;
  contactName?: string;
  active?: boolean;
}

export interface InventorySearchResponse {
  data: InventoryItem[];
  total: number;
  page: number;
  limit: number;
}

// Analytics and Reporting types
export interface LowStockItem extends InventoryItem {
  daysUntilStockOut?: number;
  reorderQuantity?: number;
}

export interface ExpiringItem extends InventoryItem {
  daysUntilExpiry?: number;
}

export interface InventoryValue {
  totalValue: number;
  itemCount: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  value: number;
}

export interface StockMovementReport {
  totalIn: number;
  totalOut: number;
  totalAdjustments: number;
  byCategory: Record<string, {
    in: number;
    out: number;
    adjustments: number;
  }>;
}

export interface InventoryAnalytics {
  restaurantId: string;
  inventoryValue: InventoryValue;
  lowStockCount: number;
  expiringCount: number;
  categoryBreakdown: CategoryBreakdown[];
  lastUpdated: string;
}

// Restaurant-specific types
export interface MyRestaurantInventorySearchRequest {
  category?: string;
  name?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}