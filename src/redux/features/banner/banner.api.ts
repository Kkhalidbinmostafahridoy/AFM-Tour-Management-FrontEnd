/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query({
      query: () => ({ url: "/banner", method: "GET" }),
      providesTags: ["BANNER"],
      transformResponse: (response: any) => response.data,
    }),
    getSingleBanner: builder.query({
      query: (id: string) => ({ url: `/banner/${id}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "BANNER", id }],
      transformResponse: (response: any) => response.data,
    }),
    createBanner: builder.mutation({
      query: (data) => ({ url: "/banner", method: "POST", body: data }),
      invalidatesTags: ["BANNER"],
    }),
    updateBanner: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/banner/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["BANNER"],
    }),
    deleteBanner: builder.mutation({
      query: (id: string) => ({ url: `/banner/${id}`, method: "DELETE" }),
      invalidatesTags: ["BANNER"],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useGetSingleBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
