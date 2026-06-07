import { baseApi } from "./baseApi";

interface BackendHealthResponse {
  message: string;
}

export const healthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBackendHealth: builder.query<BackendHealthResponse, void>({
      query: () => ({
        url: "/",
        method: "GET",
        responseHandler: "text",
      }),
      transformResponse: (message: string) => ({ message }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetBackendHealthQuery } = healthApi;
