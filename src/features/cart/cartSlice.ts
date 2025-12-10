import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId?: string; // Add restaurantId to cart items
  menuItemId?: string; // Add menuItemId for backend compatibility
}

interface CartState {
  items: CartItem[];
  total: number;
  restaurantId?: string; // Store restaurantId at cart level
}

const initialState: CartState = {
  items: [],
  total: 0,
  restaurantId: undefined,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
        // Set restaurantId from first item or if it's provided
        if (action.payload.restaurantId && !state.restaurantId) {
          state.restaurantId = action.payload.restaurantId;
        }
      }
      state.total = state.items.reduce((total, item) => total + (parseFloat(item.price.toString().replace('$', '')) * item.quantity), 0);
    },
    removeFromCart: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((total, item) => total + (parseFloat(item.price.toString().replace('$', '')) * item.quantity), 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number | string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      state.total = state.items.reduce((total, item) => total + (parseFloat(item.price.toString().replace('$', '')) * item.quantity), 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.restaurantId = undefined;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;