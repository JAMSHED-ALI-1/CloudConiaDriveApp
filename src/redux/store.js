
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import workspaceSlice from './reducers/workspaceSlice';
import languageSlice , { loadLanguageFromStorage } from './reducers/languageSlice';
import folderSlice from './reducers/folderSlice';
import AuthSlice from '../redux/reducers/authSlice'
const store = configureStore({
  reducer: {
    // auth: authReducer,
    auth: AuthSlice,
    language: languageSlice,
    workspace:workspaceSlice,
    folderPath:folderSlice
  },
});
store.dispatch(loadLanguageFromStorage());
export default store;