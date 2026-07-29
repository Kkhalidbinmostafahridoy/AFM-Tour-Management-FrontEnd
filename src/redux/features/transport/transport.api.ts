import { baseApi } from "../baseApi";

export const transportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransports: builder.query({
      query: (params) => ({
        url: "/transport",
        method: "GET",
        params,
      }),
      providesTags: ["TRANSPORT" as any],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetAllTransportsQuery } = transportApi;
