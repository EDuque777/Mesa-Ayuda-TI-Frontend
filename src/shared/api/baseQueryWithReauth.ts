import { fetchBaseQuery, type FetchArgs } from "@reduxjs/toolkit/query";
import { clearCredentials, setCredentials } from "@/features/auth/slices/authSlice";
import {
  USER_ROLES,
  type AuthSessionResponse,
  type User,
} from "@/features/auth/types/auth.types";
import type { RootState } from "@/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as RootState).auth;

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

type RawBaseQuery = typeof rawBaseQuery;
type RawBaseQueryApi = Parameters<RawBaseQuery>[1];
type RawBaseQueryExtraOptions = Parameters<RawBaseQuery>[2];

const REAUTH_EXCLUDED_PATHS = new Set([
  "/auth/sign-up",
  "/auth/verify-sign-up-code",
  "/auth/verify-email",
  "/auth/resend-verification-code",
  "/auth/sign-in",
  "/auth/verify-sign-in-code",
  "/auth/refresh-token",
  "/auth/log-out",
  "/auth/forgot-password",
  "/auth/reset-password",
]);

let refreshPromise: Promise<AuthSessionResponse | null> | null = null;

const normalizePath = (url: string) => {
  try {
    return new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    const [path] = url.split("?");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return normalizedPath.replace(/\/$/, "") || "/";
  }
};

const getRequestPath = (args: string | FetchArgs) => {
  const url = typeof args === "string" ? args : args.url;

  return normalizePath(url);
};

const shouldSkipReauth = (args: string | FetchArgs) =>
  REAUTH_EXCLUDED_PATHS.has(getRequestPath(args));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isUserRole = (value: unknown): value is User["role"] =>
  typeof value === "string" && USER_ROLES.includes(value as User["role"]);

const isUser = (value: unknown): value is User =>
  isRecord(value) &&
  typeof value.id === "string" &&
  typeof value.firstName === "string" &&
  typeof value.lastName === "string" &&
  typeof value.email === "string" &&
  isUserRole(value.role) &&
  typeof value.isEmailVerified === "boolean";

const isAuthSessionResponse = (value: unknown): value is AuthSessionResponse =>
  isRecord(value) &&
  typeof value.status === "number" &&
  typeof value.message === "string" &&
  typeof value.accessToken === "string" &&
  isUser(value.user);

const refreshSession = (
  api: RawBaseQueryApi,
  extraOptions: RawBaseQueryExtraOptions,
) => {
  refreshPromise ??= (async () => {
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (isAuthSessionResponse(refreshResult.data)) {
      api.dispatch(
        setCredentials({
          accessToken: refreshResult.data.accessToken,
          user: refreshResult.data.user,
        }),
      );

      return refreshResult.data;
    }

    api.dispatch(clearCredentials());

    return null;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

export const baseQueryWithReauth: RawBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !shouldSkipReauth(args)) {
    const session = await refreshSession(api, extraOptions);

    if (session) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
