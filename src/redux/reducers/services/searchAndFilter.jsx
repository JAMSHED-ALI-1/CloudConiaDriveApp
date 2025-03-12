import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../../utils/constant/settings";

export const fileEntriesApi = createApi({
  reducerPath: "fileEntriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.user?.access_token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFileEntries: builder.query({
      query: ({ query = "", workspaceId = 0, orderBy = "updated_at", orderDir = "desc", page = 1, filters = null, pageId = 0,folderId=0,sharedOnly=false,deletedOnly=false}) => 
        `/drive/file-entries?pageId=${pageId}&folderId=${folderId}&sharedOnly=${sharedOnly}&deletedOnly=${deletedOnly}&query=${encodeURIComponent(query)}&workspaceId=${workspaceId}&orderBy=${orderBy}&orderDir=${orderDir}&page=${page}&filters=${encodeURIComponent(filters)}`,
    }), 
  }),
});

export const { useGetFileEntriesQuery } = fileEntriesApi;
