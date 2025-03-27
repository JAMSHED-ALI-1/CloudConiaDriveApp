import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from '../../utils/constant/settings';
import { getData, storeData } from '../../helper/functionHelper';

// Initial state for auth slice
const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
};

// Async Thunks

// Login async action
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/auth/login`, credentials);
      const token = response.data.user.access_token;

      const workspace = await axios.get(`${baseURL}/me/workspaces?workspaceId=0`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      response.data.user.active_workspace = 0;
      response.data.user.workspace = workspace?.data?.workspaces;

      // Store user data
      // await storeData(response.data.user);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update user async action
export const updateUserAsync = createAsyncThunk(
  'auth/updateUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.user.access_token;

      const response = await axios.post(`${baseURL}/users/me?_method=PUT`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Return updated user data
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Logout async action
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getData(); // Get data from AsyncStorage
      if (!user) throw new Error('No user found');
      const token = user.access_token;

      // Call logout API
      await axios.post(`${baseURL}/auth/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear storage
      await AsyncStorage.removeItem('user'); // Remove the user data from AsyncStorage

      return null; // Indicate successful logout
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login actions
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user actions
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout actions
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

// Selectors to access the state
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;

// Reducer export
export default authSlice.reducer;
