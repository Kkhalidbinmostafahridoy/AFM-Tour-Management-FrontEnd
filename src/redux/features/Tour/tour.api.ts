/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IResponse } from "@/types/index.type";
import { baseApi } from "../baseApi";
import type { ITourPackage } from "@/types/tour.type";

export const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTourType: builder.mutation({
      query: (tourTypeName) => ({
        url: "/tour/create-tour-type",
        method: "POST",
        body: tourTypeName,
      }),
      invalidatesTags: ["TOUR"],
    }),
    addTour: builder.mutation({
      query: (tourData) => ({
        url: "/tour/create",
        method: "POST",
        body: tourData,
      }),
      invalidatesTags: ["TOUR"],
    }),
    deleteTourType: builder.mutation({
      query: (tourTypeId) => ({
        url: `/tour/tour-types/${tourTypeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TOUR"],
    }),
    getTourTypes: builder.query({
      query: () => ({
        url: "/tour/tour-types",
        method: "GET",
      }),
      providesTags: ["TOUR"],
      transformResponse: (response) => response.data,
    }),
    getAllTour: builder.query<ITourPackage[], any>({
      query: (params) => ({
        url: "/tour",
        method: "GET",
        params,
      }),
      providesTags: ["TOUR"],
      transformResponse: (response: IResponse<ITourPackage[]>) => response.data,
    }),

    // ✅ NEW: Single tour by ID — hits /tour/:id
    getSingleTour: builder.query<ITourPackage, string>({
      query: (id) => ({
        url: `/tour/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "TOUR", id }],
      transformResponse: (response: IResponse<ITourPackage>) => response.data,
    }),
  }),
});

export const {
  useGetTourTypesQuery,
  useAddTourTypeMutation,
  useDeleteTourTypeMutation,
  useAddTourMutation,
  useGetAllTourQuery,
  useGetSingleTourQuery,
} = tourApi;
