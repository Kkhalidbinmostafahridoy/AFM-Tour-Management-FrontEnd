/* eslint-disable @typescript-eslint/no-explicit-any */
// import { baseApi } from "../baseApi";

// export const destinationApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllDestinations: builder.query({
//       query: (params) => ({
//         url: "/destination",
//         method: "GET",
//         params,
//       }),
//       providesTags: ["DESTINATION" as any], // Cast needed if tagTypes not yet updated
//       transformResponse: (response: any) => response.data,
//     }),
//   }),
// });

// export const { useGetAllDestinationsQuery } = destinationApi;

import { baseApi } from "../baseApi";

export const destinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all destinations
    getAllDestinations: builder.query({
      query: (params) => ({
        url: "/destination",
        method: "GET",
        params,
      }),
      providesTags: ["DESTINATION" as any],
      transformResponse: (response: any) => response.data,
    }),

    // GET single destination by ID
    getDestinationById: builder.query({
      query: (id: string) => ({
        url: `/destination/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "DESTINATION" as any, id },
      ],
      transformResponse: (response: any) => response.data,
    }),

    // POST create new destination
    createDestination: builder.mutation({
      query: (body) => ({
        url: "/destination",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DESTINATION" as any],
    }),

    // PATCH / PUT update destination by ID
    updateDestination: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/destination/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "DESTINATION" as any,
        { type: "DESTINATION" as any, id },
      ],
    }),
  }),
});

export const {
  useGetAllDestinationsQuery,
  useGetDestinationByIdQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
} = destinationApi;
