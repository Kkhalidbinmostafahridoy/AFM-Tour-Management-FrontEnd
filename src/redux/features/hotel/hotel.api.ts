/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllHotels: builder.query({
      query: (params) => ({
        url: "/hotel",
        method: "GET",
        params,
      }),
      providesTags: ["HOTEL"],
      transformResponse: (response: any) => response.data,
    }),
    getSingleHotel: builder.query({
      query: (id: string) => ({
        url: `/hotel/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "HOTEL", id }],
      transformResponse: (response: any) => response.data,
    }),
    createHotel: builder.mutation({
      query: (data) => ({
        url: "/hotel",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HOTEL"],
    }),
    updateHotel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/hotel/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["HOTEL"],
    }),
    deleteHotel: builder.mutation({
      query: (id: string) => ({
        url: `/hotel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HOTEL"],
    }),
  }),
});

export const {
  useGetAllHotelsQuery,
  useGetSingleHotelQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelApi;
