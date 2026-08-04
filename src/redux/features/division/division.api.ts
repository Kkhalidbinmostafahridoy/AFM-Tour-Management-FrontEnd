/* eslint-disable @typescript-eslint/no-explicit-any */
// import { baseApi } from "../baseApi";

// export const divisionApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     addDivision: builder.mutation({
//       query: (divisionData) => ({
//         url: "/division/create",
//         method: "POST",
//         body: divisionData,
//       }),
//       invalidatesTags: ["DIVISION"],
//     }),

//     getDivisionTypes: builder.query({
//       query: () => ({
//         url: "/division",
//         method: "GET",
//       }),
//       providesTags: ["DIVISION"],
//       transformResponse: (response) => response.data,
//     }),
//   }),
// });

// export const { useGetDivisionTypesQuery, useAddDivisionMutation } = divisionApi;

import { baseApi } from "../baseApi";

export const divisionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDivision: builder.mutation({
      query: (divisionData) => ({
        url: "/division/create",
        method: "POST",
        body: divisionData,
      }),
      invalidatesTags: ["DESTINATION"],
    }),

    getDivisionTypes: builder.query({
      query: () => ({
        url: "/division",
        method: "GET",
      }),
      providesTags: ["DESTINATION"],
      // This transforms the response so the component gets the array directly
      transformResponse: (response: any) => response.data,
    }),

    // NEW: Delete Mutation Hook
    deleteDivision: builder.mutation({
      query: (id) => ({
        url: `/division/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DESTINATION"], // This triggers instant live update!
    }),
  }),
});

export const {
  useGetDivisionTypesQuery,
  useAddDivisionMutation,
  useDeleteDivisionMutation,
} = divisionApi;
