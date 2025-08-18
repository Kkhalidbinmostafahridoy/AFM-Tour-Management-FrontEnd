import { baseApi } from "../baseApi";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDivision: builder.mutation({
      query: (divisionData) => ({
        url: "/division/create",
        method: "POST",
        body: divisionData,
      }),
      invalidatesTags: ["TOUR"],
    }),

    getDivisionTypes: builder.query({
      query: () => ({
        url: "/division",
        method: "GET",
      }),
      providesTags: ["TOUR"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetDivisionTypesQuery, useAddDivisionMutation } = tourApi;
