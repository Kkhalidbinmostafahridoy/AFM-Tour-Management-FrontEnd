/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: () => ({ url: "/coupon", method: "GET" }),
      providesTags: ["COUPON"],
      transformResponse: (response: any) => response.data,
    }),
    getSingleCoupon: builder.query({
      query: (id: string) => ({ url: `/coupon/${id}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "COUPON", id }],
      transformResponse: (response: any) => response.data,
    }),
    createCoupon: builder.mutation({
      query: (data) => ({ url: "/coupon", method: "POST", body: data }),
      invalidatesTags: ["COUPON"],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/coupon/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["COUPON"],
    }),
    deleteCoupon: builder.mutation({
      query: (id: string) => ({ url: `/coupon/${id}`, method: "DELETE" }),
      invalidatesTags: ["COUPON"],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useGetSingleCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
