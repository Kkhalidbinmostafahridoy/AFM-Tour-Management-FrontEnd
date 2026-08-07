import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "@/config";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    credentials: "include",
  }),
  tagTypes: [
    "TOUR", "AUTH", "USER", "DESTINATION", "SCHEDULE", "BOOKING",
    "WISHLIST", "HOTEL", "TRANSPORT", "GUIDE", "TICKET", "BLOG",
    "BANNER", "COUPON", "FAQ", "NEWSLETTER"
  ],
  endpoints: () => ({}),
});
