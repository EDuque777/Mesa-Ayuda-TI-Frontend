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
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetBackendHealthQuery } = healthApi;
