import { baseApi } from "../baseApi";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => ({
        url: "/blog",
        method: "GET",
      }),
      providesTags: ["BLOG" as any],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetAllBlogsQuery } = blogApi;
