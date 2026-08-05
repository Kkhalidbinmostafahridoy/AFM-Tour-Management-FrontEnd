/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchedules: builder.query({
      query: (params) => ({ url: "/schedule", method: "GET", params }),
      providesTags: ["SCHEDULE"],
      transformResponse: (response: any) => response.data,
    }),
    getSchedulesByTour: builder.query({
      query: (tourId: string) => ({ url: "/schedule", method: "GET", params: { tourId } }),
      providesTags: ["SCHEDULE"],
      transformResponse: (response: any) => response.data,
    }),
    getSingleSchedule: builder.query({
      query: (id: string) => ({ url: `/schedule/${id}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "SCHEDULE", id }],
      transformResponse: (response: any) => response.data,
    }),
    createSchedule: builder.mutation({
      query: (data) => ({ url: "/schedule", method: "POST", body: data }),
      invalidatesTags: ["SCHEDULE"],
    }),
    updateSchedule: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/schedule/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["SCHEDULE"],
    }),
    deleteSchedule: builder.mutation({
      query: (id: string) => ({ url: `/schedule/${id}`, method: "DELETE" }),
      invalidatesTags: ["SCHEDULE"],
    }),
  }),
});

export const {
  useGetAllSchedulesQuery,
  useGetSchedulesByTourQuery,
  useGetSingleScheduleQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = scheduleApi;
