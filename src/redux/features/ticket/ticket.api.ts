import { baseApi } from "../baseApi";

export const ticketApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTickets: builder.query({
      query: () => ({
        url: "/ticket/my-tickets",
        method: "GET",
      }),
      providesTags: ["TICKET" as any],
      transformResponse: (response: any) => response.data,
    }),
    createTicket: builder.mutation({
      query: (data) => ({
        url: "/ticket",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TICKET" as any],
    }),
  }),
});

export const { useGetUserTicketsQuery, useCreateTicketMutation } = ticketApi;
