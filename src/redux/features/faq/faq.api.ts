/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFAQs: builder.query({
      query: (params) => ({ url: "/faq", method: "GET", params }),
      providesTags: ["FAQ"],
      transformResponse: (response: any) => response.data,
    }),
    getSingleFAQ: builder.query({
      query: (id: string) => ({ url: `/faq/${id}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "FAQ", id }],
      transformResponse: (response: any) => response.data,
    }),
    createFAQ: builder.mutation({
      query: (data) => ({ url: "/faq", method: "POST", body: data }),
      invalidatesTags: ["FAQ"],
    }),
    updateFAQ: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/faq/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["FAQ"],
    }),
    deleteFAQ: builder.mutation({
      query: (id: string) => ({ url: `/faq/${id}`, method: "DELETE" }),
      invalidatesTags: ["FAQ"],
    }),
  }),
});

export const {
  useGetAllFAQsQuery,
  useGetSingleFAQQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqApi;
