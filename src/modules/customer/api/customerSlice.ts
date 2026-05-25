import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface Preference {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
}

interface CustomerState {
  preferences: Preference;
  notifications: Notification[];
  quickActions: QuickAction[];
  recentSearches: string[];
}

const initialState: CustomerState = {
  preferences: {
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
  notifications: [],
  quickActions: [
    {
      id: '1',
      title: 'Reorder',
      description: 'Repeat your last order',
      icon: '🔄',
      action: 'reorder',
    },
    {
      id: '2',
      title: 'Book Again',
      description: 'Repeat your last reservation',
      icon: '📅',
      action: 'rebook',
    },
    {
      id: '3',
      title: 'Track Order',
      description: 'Follow your delivery',
      icon: '📍',
      action: 'track',
    },
  ],
  recentSearches: [],
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.preferences.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.preferences.language = action.payload;
    },
    toggleNotification: (state, action: PayloadAction<{ type: keyof CustomerState['preferences']['notifications']; enabled: boolean }>) => {
      state.preferences.notifications[action.payload.type] = action.payload.enabled;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'timestamp'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(newNotification);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      // Remove if already exists
      state.recentSearches = state.recentSearches.filter(search => search !== action.payload);
      // Add to beginning
      state.recentSearches.unshift(action.payload);
      // Keep only last 10 searches
      if (state.recentSearches.length > 10) {
        state.recentSearches.pop();
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    addQuickAction: (state, action: PayloadAction<QuickAction>) => {
      state.quickActions.push(action.payload);
    },
    removeQuickAction: (state, action: PayloadAction<string>) => {
      state.quickActions = state.quickActions.filter(actionItem => actionItem.id !== action.payload);
    },
  },
});

export const {
  setTheme,
  setLanguage,
  toggleNotification,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  addRecentSearch,
  clearRecentSearches,
  addQuickAction,
  removeQuickAction,
} = customerSlice.actions;

export default customerSlice.reducer;