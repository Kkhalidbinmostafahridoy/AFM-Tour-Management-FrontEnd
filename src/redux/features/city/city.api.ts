import { baseApi } from "../baseApi";
import type { City, CityApiResponse } from "@/types/destination";

export const cityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCities: builder.query<CityApiResponse, void>({
      query: () => ({
        url: "/cities",
        method: "GET",
      }),
      providesTags: [{ type: "DESTINATION" as const, id: "LIST" }],
      keepUnusedDataFor: 600,
    }),

    getSingleCity: builder.query<City, string>({
      query: (id) => ({
        url: `/cities/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "DESTINATION" as const, id },
      ],
    }),
  }),
});

export const { useGetAllCitiesQuery, useGetSingleCityQuery } = cityApi;
