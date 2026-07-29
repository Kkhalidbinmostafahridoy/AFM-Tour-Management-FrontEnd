import { baseApi } from "../baseApi";

export const guideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGuides: builder.query({
      query: (params) => ({
        url: "/guide",
        method: "GET",
        params,
      }),
      providesTags: ["GUIDE" as any],
      transformResponse: (response: any) => response.data,
    }),
    createGuide: builder.mutation({
      query: (data) => ({
        url: "/guide",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["GUIDE" as any],
    }),
  }),
});

export const { useGetAllGuidesQuery, useCreateGuideMutation } = guideApi;
