import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../redux/reducers/authSlice';

import { showMessage } from 'react-native-flash-message';
import { baseURL } from '../utils/constant/settings';
import { useNavigation } from '@react-navigation/native';

// Create API Service Context
const APIServiceContext = createContext(null);

// APIServiceProvider Component
export const APIServiceProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation ? useNavigation() : null;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL:baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor
  const setupRequestInterceptor = useCallback(() => {
    const interceptor = api.interceptors.request.use(
      async (config) => {
        setIsLoading(true);
        setError(null);
        try {
          const userString = await AsyncStorage.getItem('user');
          const user = userString ? JSON.parse(userString) : null;
          if (user?.access_token) {
            config.headers['Authorization'] = `Bearer ${user.access_token}`;
          }
        } catch (error) {
          console.error('Token retrieval error:', error);
        }
        return config;
      },
      (error) => {
        setIsLoading(false);
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.request.eject(interceptor);
  }, []);

  // Response Interceptor
  const setupResponseInterceptor = useCallback(() => {
    const interceptor = api.interceptors.response.use(
      (response) => {
        setIsLoading(false);
        return response;
    },
   
      async (error) => {
        setIsLoading(false);

        if (error.response?.status === 401&& error.response?.status ===403) {
          try {
            await AsyncStorage.removeItem('user');
            dispatch(logoutAsync());

            showMessage({
              message: 'Session Expired',
              description: 'Please log in again.',
              type: 'danger',
            });
console.log('sucess')
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (logoutError) {
            console.error('Logout error:', logoutError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [dispatch, navigation]);

  useEffect(() => {
    const requestInterceptorEject = setupRequestInterceptor();
    const responseInterceptorEject = setupResponseInterceptor();
    return () => {
      requestInterceptorEject();
      responseInterceptorEject();
    };
  }, [setupRequestInterceptor, setupResponseInterceptor]);

  const contextValue = {
    isLoading,
    error,
    api,
  };

  return (
    <APIServiceContext.Provider value={contextValue}>
      {children}
    </APIServiceContext.Provider>
  );
};

// Custom Hook to Use API Service
export const useAPIService = () => {
  const context = useContext(APIServiceContext);
  if (!context) {
    throw new Error('useAPIService must be used within APIServiceProvider');
  }
  return context;
};
