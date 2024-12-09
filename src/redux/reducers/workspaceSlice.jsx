import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logoutAsync } from './authSlice'; 

const initialState = {
  workspace: 0,
};

export const updateWorkspaceAsync = createAsyncThunk(
  'workspace/updateWorkspace',
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    // Optional: Add a direct reset method if needed
    resetWorkspace: (state) => {
      state.workspace = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateWorkspaceAsync.fulfilled, (state, action) => {
        console.log('action.payload', action.payload);
        state.workspace = action.payload;
      })
      // Add a case to reset workspace when logout is fulfilled
      
  },
});

export default workspaceSlice.reducer;
export const { resetWorkspace } = workspaceSlice.actions;

