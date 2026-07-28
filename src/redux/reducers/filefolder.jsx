import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { useNavigation } from '@react-navigation/native'; // Import navigation
import { baseURL } from '../../utils/constant/settings';
import { logoutAsync } from './authSlice';
import { handleLogout } from '../../helper/Logouthelper';
import { persistor } from '../store';

export const filefolderApi = createApi({
  reducerPath: 'filefolderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
      const user = getState().auth.user;
      console.log(user?.access_token,'user?.access_token')
      if (user?.access_token) {
        headers.set('Authorization', `Bearer ${user.access_token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getFileFolder: builder.query({
      query: (params = {}) => {
        return {
          url: 'drive/file-entries',
          method: 'GET',
          params: {
            timestamp: new Date().getTime(),
            pageId: params.pageId || 0,
            folderId: params.folderId || 0,
            sharedOnly: params.sharedOnly || false,
            starredOnly: params.starredOnly || false,
            recentOnly: params.recentOnly || false,
            deletedOnly: params.deletedOnly || false,
            query: encodeURI(params.query) || '',
            workspaceId: params.workspaceId || 0,
            orderBy: params.orderBy || 'updated_at',
            orderDir: params.orderDir || 'desc',
            page: params.page || 1,
            filters: params.filters || '',
          },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          // Await the query result
          await queryFulfilled;
        } catch (error) {
          // Check if the error is a 403 (Forbidden) error
          if (error.error.status === 403) {
            // Dispatch logout action to clear user data
            persistor.purge().then(() => {
                  console.log('Persisted store purged');
                });
           handleLogout(dispatch,navigation)
            // Optionally, navigate to the login screen (use useNavigation hook)
            const navigation = useNavigation();
            navigation.replace('Login'); // Replace with your login screen name
          }
        }
      }
    }),
  }),
});

export const {
  useGetFileFolderQuery,
  useLazyGetFileFolderQuery
} = filefolderApi;
