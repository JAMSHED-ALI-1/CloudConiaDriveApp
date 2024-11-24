// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer from './reducers/authSlice';
import workspaceSlice from './reducers/workspaceSlice';
import languageSlice, { loadLanguageFromStorage } from './reducers/languageSlice';
import folderSlice from './reducers/folderSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'language'] // Only auth and language will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  language: languageSlice,
  workspace: workspaceSlice,
  folderPath: folderSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE', 'persist/REGISTER'],
      }
    })
});

store.dispatch(loadLanguageFromStorage());

export const persistor = persistStore(store);
export default store;