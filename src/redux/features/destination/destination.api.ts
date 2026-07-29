import { baseApi } from "../baseApi";

export const destinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllDestinations: builder.query({
      query: (params) => ({
        url: "/destination",
        method: "GET",
        params,
      }),
      providesTags: ["DESTINATION" as any], // Cast needed if tagTypes not yet updated
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetAllDestinationsQuery } = destinationApi;
