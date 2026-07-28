// store.js or redux/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

import themeSlice from './reducers/themechange';
import languageSlice, { loadLanguageFromStorage } from './reducers/languageSlice';
import AuthSlice from './reducers/authSlice';
import workspaceSlice from './reducers/workspaceSlice';
import folderSlice from './reducers/folderSlice';

import { filefolderApi } from './reducers/filefolder';
import { createFolderApi } from './reducers/services/createFolder';
import { fileEntriesApi as searchAndFilterApi } from './reducers/services/searchAndFilter';

// ✅ Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'language', 'theme','workspace'], // Only persist these reducers
};

// ✅ Combine reducers
const rootReducer = combineReducers({
  auth: AuthSlice,
  language: languageSlice,
  theme: themeSlice,
  workspace: workspaceSlice,
  folderPath: folderSlice,
  [filefolderApi.reducerPath]: filefolderApi.reducer,
  [createFolderApi.reducerPath]: createFolderApi.reducer,
  [searchAndFilterApi.reducerPath]: searchAndFilterApi.reducer,
});

// ✅ Wrap with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(
      filefolderApi.middleware,
      createFolderApi.middleware,
      searchAndFilterApi.middleware
    ),
});

// ✅ Create persistor
export const persistor = persistStore(store);

// ✅ Load language manually if needed
store.dispatch(loadLanguageFromStorage());

export default store;
