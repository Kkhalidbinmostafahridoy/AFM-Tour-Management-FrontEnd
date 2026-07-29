import { baseApi } from "../baseApi";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHotels: builder.query({
      query: (params) => ({
        url: "/hotel",
        method: "GET",
        params,
      }),
      providesTags: ["HOTEL" as any],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetAllHotelsQuery } = hotelApi;
