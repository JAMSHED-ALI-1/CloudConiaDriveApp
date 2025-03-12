import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../utils/constant/settings";

export const filefolderApi = createApi({
    reducerPath: "filefolderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,
        prepareHeaders:(headers,{getState})=>{
          const user=getState().auth.user;
          if(user?.access_token){
            headers.set("Authorization", `Bearer ${user.access_token}`);
          }
          return headers;
        }

    }),
    endpoints: (builder) => ({
        getFileFolder: builder.query({
            query: (params) => ({
                url: "drive/file-entries",
                params, // ✅ Correct way to pass query parameters
            }),
        }),
    }),
});

export const { useGetFileFolderQuery } = filefolderApi;
