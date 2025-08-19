import { baseApi } from "../baseApi";

export const divisionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDivision: builder.mutation({
      query: (divisionData) => ({
        url: "/division/create",
        method: "POST",
        body: divisionData,
      }),
      invalidatesTags: ["DIVISION"],
    }),

    getDivisionTypes: builder.query({
      query: () => ({
        url: "/division",
        method: "GET",
      }),
      providesTags: ["DIVISION"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetDivisionTypesQuery, useAddDivisionMutation } = divisionApi;
