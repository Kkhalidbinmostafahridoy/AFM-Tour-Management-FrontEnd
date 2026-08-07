import { baseApi } from "../baseApi";

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookingStats: builder.query({
      query: () => ({
        url: "/stats/booking",
        method: "GET",
      }),
      providesTags: ["BOOKING"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => response.data,
    }),
    getPaymentStats: builder.query({
      query: () => ({
        url: "/stats/payment",
        method: "GET",
      }),
      providesTags: ["BOOKING"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => response.data,
    }),
    getUserStats: builder.query({
      query: () => ({
        url: "/stats/user",
        method: "GET",
      }),
      providesTags: ["USER"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => response.data,
    }),
    getTourStats: builder.query({
      query: () => ({
        url: "/stats/tour",
        method: "GET",
      }),
      providesTags: ["TOUR"],
      keepUnusedDataFor: 300,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetBookingStatsQuery,
  useGetPaymentStatsQuery,
  useGetUserStatsQuery,
  useGetTourStatsQuery,
} = statsApi;
