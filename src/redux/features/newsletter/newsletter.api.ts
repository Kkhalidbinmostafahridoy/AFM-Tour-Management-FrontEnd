/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /newsletter - subscribe (public)
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: "/newsletter",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NEWSLETTER"],
    }),
    // GET /newsletter - get all (admin)
    getAllNewsletters: builder.query({
      query: () => ({
        url: "/newsletter",
        method: "GET",
      }),
      providesTags: ["NEWSLETTER"],
      transformResponse: (response: any) => {
        // Handle both { data: [...] } and direct array
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data)) return response.data;
        return [];
      },
    }),
    // DELETE /newsletter/:id - delete subscriber (admin)
    deleteNewsletter: builder.mutation({
      query: (id: string) => ({
        url: `/newsletter/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NEWSLETTER"],
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useGetAllNewslettersQuery,
  useDeleteNewsletterMutation,
} = newsletterApi;
