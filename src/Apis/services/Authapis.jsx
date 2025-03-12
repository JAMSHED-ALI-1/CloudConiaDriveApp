import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseURL, URL_ENDPOINTS } from '../../utils/constant/settings';

export const AuthApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL, // Set baseURL from constants
  }),
  endpoints: (builder) => ({
    getAuthentication: builder.mutation({
      query: (credentials) => ({
        url: `${baseURL}/drive/file-entries?timestamp=${new Date().getTime()}`,
        method: 'POST',
        body: credentials, 
      }),
    }),
  }),
});

// Export the hook to call the mutation
export const { useGetAuthenticationMutation } = AuthApi;
