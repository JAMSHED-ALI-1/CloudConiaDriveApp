import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from '../redux/reducers/authReducer';
import { authApi } from './services/Authapis';

const store = configureStore({
  reducer: {
    // Add the RTK Query API reducer
    [authApi.reducerPath]: authApi.reducer,
    // Add the auth slice reducer
    auth: authReducer
  },
  // Add the RTK Query middleware
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'auth/setUser',
          'authApi/executeMutation',
          'authApi/executeQuery'
        ]
      }
    }).concat(authApi.middleware)
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
export const { dispatch } = store;
export const getState = store.getState;