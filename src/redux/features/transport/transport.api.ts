/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

export const transportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransports: builder.query({
      query: (params) => ({
        url: "/transport",
        method: "GET",
        params,
      }),
      providesTags: ["TRANSPORT"],
      transformResponse: (response: any) => response.data,
    }),
    getSingleTransport: builder.query({
      query: (id: string) => ({
        url: `/transport/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "TRANSPORT", id }],
      transformResponse: (response: any) => response.data,
    }),
    createTransport: builder.mutation({
      query: (data) => ({
        url: "/transport",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TRANSPORT"],
    }),
    updateTransport: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transport/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["TRANSPORT"],
    }),
    deleteTransport: builder.mutation({
      query: (id: string) => ({
        url: `/transport/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TRANSPORT"],
    }),
  }),
});

export const {
  useGetAllTransportsQuery,
  useGetSingleTransportQuery,
  useCreateTransportMutation,
  useUpdateTransportMutation,
  useDeleteTransportMutation,
} = transportApi;
