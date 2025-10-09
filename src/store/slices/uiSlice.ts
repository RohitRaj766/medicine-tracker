import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  selectedDate: string;
  currentView: 'calendar' | 'list' | 'stats';
  theme: 'light' | 'dark';
  notifications: {
    enabled: boolean;
    time: string;
  };
}

const initialState: UIState = {
  isLoading: false,
  error: null,
  success: null,
  selectedDate: new Date().toISOString().split('T')[0],
  currentView: 'calendar',
  theme: 'light',
  notifications: {
    enabled: true,
    time: '09:00',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<'calendar' | 'list' | 'stats'>) => {
      state.currentView = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setNotifications: (state, action: PayloadAction<{ enabled: boolean; time?: string }>) => {
      state.notifications.enabled = action.payload.enabled;
      if (action.payload.time) {
        state.notifications.time = action.payload.time;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  clearMessages,
  setSelectedDate,
  setCurrentView,
  setTheme,
  setNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
