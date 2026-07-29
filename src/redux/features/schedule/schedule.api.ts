import { baseApi } from "../baseApi";

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchedulesByTour: builder.query({
      query: (tourId: string) => ({
        url: "/schedule",
        method: "GET",
        params: { tourId },
      }),
      providesTags: ["SCHEDULE" as any],
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetSchedulesByTourQuery } = scheduleApi;
