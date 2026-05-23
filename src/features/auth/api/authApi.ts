import { baseApi } from "@/shared/api/baseApi";
import type {
  AuthSessionResponse,
  BaseAuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendVerificationCodeRequest,
  SignInRequest,
  SignUpRequest,
  VerifyCodeRequest,
} from "../types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<BaseAuthResponse, SignUpRequest>({
      query: (body) => ({
        url: "/auth/sign-up",
        method: "POST",
        body,
      }),
    }),
    verifySignUpCode: builder.mutation<AuthSessionResponse, VerifyCodeRequest>({
      query: (body) => ({
        url: "/auth/verify-sign-up-code",
        method: "POST",
        body,
      }),
    }),
    verifyEmail: builder.mutation<AuthSessionResponse, VerifyCodeRequest>({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
    }),
    resendVerificationCode: builder.mutation<
      BaseAuthResponse,
      ResendVerificationCodeRequest
    >({
      query: (body) => ({
        url: "/auth/resend-verification-code",
        method: "POST",
        body,
      }),
    }),
    signIn: builder.mutation<BaseAuthResponse, SignInRequest>({
      query: (body) => ({
        url: "/auth/sign-in",
        method: "POST",
        body,
      }),
    }),
    verifySignInCode: builder.mutation<AuthSessionResponse, VerifyCodeRequest>({
      query: (body) => ({
        url: "/auth/verify-sign-in-code",
        method: "POST",
        body,
      }),
    }),
    refreshToken: builder.mutation<AuthSessionResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
    logOut: builder.mutation<BaseAuthResponse, void>({
      query: () => ({
        url: "/auth/log-out",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation<
      BaseAuthResponse,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<BaseAuthResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignUpMutation,
  useVerifySignUpCodeMutation,
  useVerifyEmailMutation,
  useResendVerificationCodeMutation,
  useSignInMutation,
  useVerifySignInCodeMutation,
  useRefreshTokenMutation,
  useLogOutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
