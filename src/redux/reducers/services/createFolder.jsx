import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../../utils/constant/settings";

export const createFolderApi = createApi({
  reducerPath: "folderApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  endpoints: (builder) => ({
    createFolder: builder.mutation({
      query: ({ workspaceId = 0, folderId, folderName, token }) => ({
        url: `/folders?workspaceId=${workspaceId}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: {
          parentId: folderId === 0 ? null : folderId,
          name: folderName,
        },
      }),
    }),
  }),
});

export const { useCreateFolderMutation } = createFolderApi;
