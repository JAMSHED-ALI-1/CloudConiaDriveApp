import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseURL } from '../../../utils/constant/settings';

export const filefolderApi = createApi({
  reducerPath: 'filefolderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
      const user = getState().auth.user;
      if (user?.access_token) {
        headers.set('Authorization', `Bearer ${user.access_token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getFileFolder: builder.query({
      query: (params = {}) => {
        // Log filters before sending the query
        console.log('Filters:', encodeURIComponent(params.filters));
        console.log('Qury',params.query)

        return {
          url: 'drive/file-entries',
          method: 'GET',
          params: {
            timestamp: new Date().getTime(),
            pageId: params.pageId || 0,
            folderId: params.folderId || 0,
            sharedOnly: params.sharedOnly || false,
            starredOnly:params.starredOnly||false,
            recentOnly:params.recentOnly||false,
            deletedOnly: params.deletedOnly || false,
            query: encodeURI(params.query) || '',
            workspaceId: params.workspaceId || 0,
            orderBy: params.orderBy || params.sortingInfo?.sortBy || 'updated_at',
            orderDir: params.orderDir || params.sortingInfo?.sortDir || 'desc',
            page: params.page || 1,
            filters: encodeURIComponent(params.filters) || '',
          },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error) {
          if (error.error.status === 403) {
            dispatch(logoutAction());
            // Navigate to login page
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
