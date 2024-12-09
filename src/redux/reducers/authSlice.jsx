import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
          'Authorization': `Bearer ${token}`
        }
      })
      response.data.user.active_workspace = 0;
      response.data.user.workspace = workspace?.data?.workspaces;
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
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
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Call backend logout endpoint if required
      // await axios.post(`${baseURL}/auth/logout`);
      
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('user');
      
      // Clear axios default headers
      delete axios.defaults.headers.common['Authorization'];
      
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
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
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.error = null;
      })
     ;
  },
});

export const { logout } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;



// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API } from "../../utils/Settings";
// import axios from 'axios';

// const initialState = {
//   user: null,
//   isLoading: false,
//   isSuccess: false,
//   isError: false,
//   errorMessage: null, // For storing error messages
// };

// // Login thunk
// export const login = createAsyncThunk(
//   'auth/login',
//   async (params, thunkApi) => {
//     console.log('loginParams:', params);
//     try {
//       const response = await API.post('/auth/login', params);
//       const token = response?.data?.user?.access_token;

//       if (!token) {
//         throw new Error('Token not found in response');
//       }

//       const workspace = await API.get('/me/workspaces?workspaceId=0', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const user = {
//         ...response.data.user,
//         active_workspace: [],
//         workspace: workspace?.data?.workspaces,
//       };
//       console.log('userinfo--', user);

//       await AsyncStorage.setItem('user', JSON.stringify(user));
//       return user;
//     } catch (error) {
//       console.error('Auth Error:', error.message);
//       return thunkApi.rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Logout thunk
// // https://drive.coniacloud.com/auth/logout?workspaceId=22

// export const logout = createAsyncThunk(
//   'auth/logout',
//   async (_, thunkApi) => {
//     try {
//       // Retrieve stored user data from AsyncStorage
//       const storedUser = await AsyncStorage.getItem('user');
//       if (!storedUser) {
//         throw new Error('No user data found to log out');
//       }

//       const user = JSON.parse(storedUser);
//       const token = user.access_token;

//       // If the user or token is not found, throw an error
//       if (!token) {
//         throw new Error('No token found for the user');
//       }

//       // Default to the first workspace if it exists
//       const workspaceId = user.workspace?.[0]?.id || null;

//       // Prepare logout request
//       const logoutResponse = await axios.post(
//         'https://drive.coniacloud.com/auth/logout',
//         null,  // No body content needed for the logout API
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           params: {
//             workspaceId: workspaceId || '',  // Send null/undefined safely
//           },
//         }
//       );

//       // Log the response for debugging purposes
//       console.log('Logout Response:', {
//         status: logoutResponse.status,
//         data: logoutResponse.data,
//       });

//       // Remove user data from AsyncStorage
//       await AsyncStorage.removeItem('user');
//       console.log(`User logged out successfully from workspaceId: ${workspaceId}`);

//       // Return null to indicate successful logout
//       return null;
//     } catch (error) {
//       // Log the error for debugging
//       console.error('Logout Error:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         headers: error.config?.headers,
//         fullError: error,
//       });

//       // Return a comprehensive error message
//       return thunkApi.rejectWithValue(
//         error.response?.data?.message ||
//         error.message ||
//         'Logout failed'
//       );
//     }
//   }
// );


// // Update user thunk
// export const updateUser = createAsyncThunk(
//   'auth/updateUser',
//   async (updatedData, thunkApi) => {
//     try {
//       const storedUser = await AsyncStorage.getItem('user');
//       if (!storedUser) {
//         throw new Error('No user data found');
//       }

//       const user = JSON.parse(storedUser);

//       // Update user fields
//       const updatedUser = {
//         ...user,
//         ...updatedData,
//       };

//       // Persist updated data
//       await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
//       console.log('User data updated:', updatedUser);

//       return updatedUser;
//     } catch (error) {
//       console.error('Update User Error:', error.message);
//       return thunkApi.rejectWithValue(error.message);
//     }
//   }
// );

// const AuthSlice = createSlice({
//   name: 'authSlice',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     // Login cases
//     builder.addCase(login.pending, (state) => {
//       state.isLoading = true;
//       state.isError = false;
//       state.errorMessage = null; // Reset errors
//     });
//     builder.addCase(login.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.isSuccess = true;
//       state.user = action.payload;
//     });
//     builder.addCase(login.rejected, (state, action) => {
//       state.isLoading = false;
//       state.isError = true;
//       state.errorMessage = action.payload || 'Something went wrong';
//     });

//     // Logout cases
//     builder.addCase(logout.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(logout.fulfilled, (state) => {
//       state.isLoading = false;
//       state.isSuccess = false; // Reset success state
//       state.user = null; // Clear user data
//       state.isError = false; // Reset error state
//       state.errorMessage = null; // Clear error messages
//     });
//     builder.addCase(logout.rejected, (state, action) => {
//       state.isLoading = false;
//       state.isError = true;
//       state.errorMessage = action.payload || 'Logout failed';
//     });

//     // Update user cases
//     builder.addCase(updateUser.pending, (state) => {
//       state.isLoading = true;
//       state.isError = false;
//       state.errorMessage = null; // Reset errors
//     });
//     builder.addCase(updateUser.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.isSuccess = true;
//       state.user = action.payload; // Update user data in state
//     });
//     builder.addCase(updateUser.rejected, (state, action) => {
//       state.isLoading = false;
//       state.isError = true;
//       state.errorMessage = action.payload || 'Update failed';
//     });
//   },
// });

// export default AuthSlice.reducer;
