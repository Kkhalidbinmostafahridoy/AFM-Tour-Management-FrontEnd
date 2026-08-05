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
      invalidatesTags: ["NEWSLETTER" as any],
    }),
    // GET /newsletter - get all (admin)
    getAllNewsletters: builder.query({
      query: () => ({
        url: "/newsletter",
        method: "GET",
      }),
      providesTags: ["NEWSLETTER" as any],
      transformResponse: (response: any) => response.data,
    }),
    // DELETE /newsletter/:id - delete subscriber (admin)
    deleteNewsletter: builder.mutation({
      query: (id: string) => ({
        url: `/newsletter/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NEWSLETTER" as any],
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useGetAllNewslettersQuery,
  useDeleteNewsletterMutation,
} = newsletterApi;
