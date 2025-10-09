// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// reducers
import authReducer from './slices/authSlice';
import medicineReducer from './slices/medicineSlice';
import uiReducer from './slices/uiSlice';

// sagas
import rootSaga from './sagas';

// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
export const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authReducer),
    medicine: medicineReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore redux-persist action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/FLUSH', 'persist/PAUSE', 'persist/REGISTER', 'persist/PAUSE'],
      },
    }).concat(sagaMiddleware),
  devTools: __DEV__,
});

// Run saga
sagaMiddleware.run(rootSaga);

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
