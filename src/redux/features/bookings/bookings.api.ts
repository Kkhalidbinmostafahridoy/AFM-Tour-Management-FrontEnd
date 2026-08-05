import { baseApi } from "../baseApi";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/booking",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["BOOKING"],
    }),
    getAllBookings: builder.query({
      query: () => ({
        url: "/booking",
        method: "GET",
      }),
      providesTags: ["BOOKING"],
      transformResponse: (response) => response.data,
    }),
    getUserBookings: builder.query({
      query: () => ({
        url: "/booking/my-bookings",
        method: "GET",
      }),
      providesTags: ["BOOKING"],
      transformResponse: (response) => response.data,
    }),
    getSingleBooking: builder.query({
      query: (id: string) => ({
        url: `/booking/${id}`,
        method: "GET",
      }),
      providesTags: ["BOOKING"],
      transformResponse: (response) => response.data,
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `/booking/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["BOOKING"],
    }),
    verifyPayment: builder.query({
      query: (bookingId: string) => ({
        url: `/booking/${bookingId}/verify-payment`,
        method: "GET",
      }),
      providesTags: ["BOOKING"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetAllBookingsQuery,
  useGetUserBookingsQuery,
  useGetSingleBookingQuery,
  useUpdateBookingStatusMutation,
  useVerifyPaymentQuery,
} = bookingApi;

