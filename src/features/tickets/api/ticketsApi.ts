import { baseApi } from "@/shared/api/baseApi";
import {
  TICKET_STATUSES,
  type AddTicketCommentRequest,
  type CreateTicketRequest,
  type ExportTicketsCsvResponse,
  type Ticket,
  type TicketComment,
  type TicketDetail,
  type TicketExportQuery,
  type TicketHistoryItem,
  type TicketKanbanQuery,
  type TicketKanbanResponse,
  type TicketListQuery,
  type TicketListResponse,
  type TicketMetrics,
  type TicketMetricsQuery,
  type UpdateTicketRequest,
  type UpdateTicketStatusRequest,
} from "../types/ticket.types";

const cleanParams = (query?: object | void) => {
  if (!query) {
    return undefined;
  }

  const params: Record<string, string | number> = {};

  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === "string" && value.trim()) {
      params[key] = value.trim();
      return;
    }

    if (typeof value === "number") {
      params[key] = value;
    }
  });

  return params;
};

const normalizeKanbanResponse = (
  response: Partial<TicketKanbanResponse>,
): TicketKanbanResponse =>
  TICKET_STATUSES.reduce((accumulator, status) => {
    accumulator[status] = response[status] ?? [];
    return accumulator;
  }, {} as TicketKanbanResponse);

const getExportFilename = (headerValue: string | null) => {
  if (!headerValue) {
    return "tickets.csv";
  }

  const match = headerValue.match(/filename="?([^";]+)"?/i);

  return match?.[1] ?? "tickets.csv";
};

export const ticketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation<Ticket, CreateTicketRequest>({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tickets", "Kanban", "Metrics"],
    }),
    listTickets: builder.query<TicketListResponse, TicketListQuery | void>({
      query: (query) => ({
        url: "/tickets",
        params: cleanParams(query),
      }),
      providesTags: (result) =>
        result
          ? [
              "Tickets",
              ...result.data.map((ticket) => ({
                type: "Ticket" as const,
                id: ticket.id,
              })),
            ]
          : ["Tickets"],
    }),
    getTicketsKanban: builder.query<TicketKanbanResponse, TicketKanbanQuery | void>({
      query: (query) => ({
        url: "/tickets/kanban",
        params: cleanParams(query),
      }),
      transformResponse: normalizeKanbanResponse,
      providesTags: ["Kanban"],
    }),
    getTicketMetrics: builder.query<TicketMetrics, TicketMetricsQuery | void>({
      query: (query) => ({
        url: "/tickets/metrics",
        params: cleanParams(query),
      }),
      providesTags: ["Metrics"],
    }),
    exportTicketsCsv: builder.mutation<ExportTicketsCsvResponse, TicketExportQuery | void>({
      query: (query) => ({
        url: "/tickets/export.csv",
        method: "GET",
        params: cleanParams(query),
        responseHandler: "text",
      }),
      transformResponse: (csv: string, meta) => ({
        csv,
        filename: getExportFilename(meta?.response?.headers.get("content-disposition") ?? null),
      }),
    }),
    getTicket: builder.query<TicketDetail, string>({
      query: (id) => `/tickets/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Ticket", id },
        { type: "Comments", id },
        { type: "History", id },
      ],
    }),
    updateTicket: builder.mutation<
      TicketDetail,
      { id: string; body: UpdateTicketRequest }
    >({
      query: ({ id, body }) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Tickets",
        "Kanban",
        "Metrics",
        { type: "Ticket", id },
        { type: "History", id },
      ],
    }),
    updateTicketStatus: builder.mutation<
      TicketDetail,
      { id: string; body: UpdateTicketStatusRequest }
    >({
      query: ({ id, body }) => ({
        url: `/tickets/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Tickets",
        "Kanban",
        "Metrics",
        { type: "Ticket", id },
        { type: "History", id },
      ],
    }),
    addTicketComment: builder.mutation<
      TicketComment,
      { id: string; body: AddTicketCommentRequest }
    >({
      query: ({ id, body }) => ({
        url: `/tickets/${id}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Ticket", id },
        { type: "Comments", id },
        { type: "History", id },
      ],
    }),
    listTicketComments: builder.query<TicketComment[], string>({
      query: (id) => `/tickets/${id}/comments`,
      providesTags: (_result, _error, id) => [{ type: "Comments", id }],
    }),
    listTicketHistory: builder.query<TicketHistoryItem[], string>({
      query: (id) => `/tickets/${id}/history`,
      providesTags: (_result, _error, id) => [{ type: "History", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddTicketCommentMutation,
  useCreateTicketMutation,
  useExportTicketsCsvMutation,
  useGetTicketMetricsQuery,
  useGetTicketQuery,
  useGetTicketsKanbanQuery,
  useListTicketCommentsQuery,
  useListTicketHistoryQuery,
  useListTicketsQuery,
  useUpdateTicketMutation,
  useUpdateTicketStatusMutation,
} = ticketsApi;
