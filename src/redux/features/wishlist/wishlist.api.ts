import { baseApi } from "../baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => ({
        url: "/wishlist/my-wishlist",
        method: "GET",
      }),
      providesTags: ["WISHLIST" as any],
      transformResponse: (response: any) => response.data,
    }),
    toggleWishlist: builder.mutation({
      query: (tourId: string) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body: { tour: tourId },
      }),
      invalidatesTags: ["WISHLIST" as any],
    }),
  }),
});

export const { useGetWishlistQuery, useToggleWishlistMutation } = wishlistApi;
