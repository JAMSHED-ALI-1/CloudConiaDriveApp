import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from '../../utils/constant/settings';

const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/auth/login`, credentials);
      const token = response.data.user.access_token;
      const workspace = await axios.get(`${baseURL}/me/workspaces?workspaceId=0`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      response.data.user.active_workspace = 0;
      response.data.user.workspace = workspace?.data?.workspaces;
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.user?.access_token;

      if (!token) {
        return rejectWithValue('No token available, user is not authenticated');
      }

      await axios.get(`${baseURL}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return true;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

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
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearState: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        authSlice.caseReducers.clearState(state);
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload || 'Logout failed';
      })
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
      });
  },
});

export const { clearState } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
