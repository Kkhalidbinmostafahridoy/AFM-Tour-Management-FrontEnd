/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

export const destinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all destinations
    getAllDestinations: builder.query({
      query: (params) => ({ url: "/destination", method: "GET", params }),
      providesTags: ["DESTINATION"],
      transformResponse: (response: any) => response.data,
    }),
    // GET single destination by ID
    getDestinationById: builder.query({
      query: (id: string) => ({ url: `/destination/${id}`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "DESTINATION" as any, id }],
      transformResponse: (response: any) => response.data,
    }),
    // POST create new destination
    createDestination: builder.mutation({
      query: (body) => ({ url: "/destination", method: "POST", body }),
      invalidatesTags: ["DESTINATION"],
    }),
    // PATCH update destination
    updateDestination: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/destination/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["DESTINATION"],
    }),
    // DELETE destination
    deleteDestination: builder.mutation({
      query: (id: string) => ({ url: `/destination/${id}`, method: "DELETE" }),
      invalidatesTags: ["DESTINATION"],
    }),
  }),
});

export const {
  useGetAllDestinationsQuery,
  useGetDestinationByIdQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationApi;

