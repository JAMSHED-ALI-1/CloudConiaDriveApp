// import { configureStore } from '@reduxjs/toolkit';
// filefolderApi
// import authReducer from './reducers/authSlice';
// import workspaceSlice from './reducers/workspaceSlice';
// import languageSlice, { loadLanguageFromStorage } from './reducers/languageSlice';
// import folderSlice from './reducers/folderSlice';
// import AuthSlice from '../redux/reducers/authSlice';
// // import { filefolderApi } from './reducers/services/filefolderApi';
// import {createFolderApi} from './reducers/services/createFolder'
// import { filefolderApi } from './reducers/filefolder';
// import { fileEntriesApi as searchAndFilterApi } from "./reducers/services/searchAndFilter"; 
// const store = configureStore({
//   reducer: {
//     auth: AuthSlice,
//     language: languageSlice,
//     workspace: workspaceSlice,
//     folderPath: folderSlice,
//     [filefolderApi.reducerPath]: filefolderApi.reducer, 
//     [createFolderApi.reducerPath]: createFolderApi.reducer, 
//     [searchAndFilterApi.reducerPath]: searchAndFilterApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) => 
//     getDefaultMiddleware().concat(
//       filefolderApi.middleware,
//       createFolderApi.middleware,
//       searchAndFilterApi.middleware
//     ),
// });

// store.dispatch(loadLanguageFromStorage());

// export default store;







import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import workspaceSlice from './reducers/workspaceSlice';
import languageSlice, { loadLanguageFromStorage } from './reducers/languageSlice';
import folderSlice from './reducers/folderSlice';
import AuthSlice from '../redux/reducers/authSlice';
import { filefolderApi } from './reducers/filefolder';
import { createFolderApi } from './reducers/services/createFolder';
import { fileEntriesApi as searchAndFilterApi } from "./reducers/services/searchAndFilter"; 

const store = configureStore({
  reducer: {
    auth: AuthSlice,
    language: languageSlice,
    workspace: workspaceSlice,
    folderPath: folderSlice,
    [filefolderApi.reducerPath]: filefolderApi.reducer, 
    [createFolderApi.reducerPath]: createFolderApi.reducer, 
    [searchAndFilterApi.reducerPath]: searchAndFilterApi.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      // Disable serializable state invariant check
      serializableCheck: false,
    }).concat(
      filefolderApi.middleware,
      createFolderApi.middleware,
      searchAndFilterApi.middleware
    ),
});

store.dispatch(loadLanguageFromStorage());

export default store;