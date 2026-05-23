"use client";

import { useCallback } from "react";
import { useResendVerificationCodeMutation } from "../api/authApi";
import type { ResendVerificationCodeRequest } from "../types/auth.types";

export const useResendVerificationCode = () => {
  const [
    resendVerificationCodeMutation,
    { data, error, isLoading, isSuccess, isError, reset },
  ] = useResendVerificationCodeMutation();

  const resendVerificationCode = useCallback(
    (request: ResendVerificationCodeRequest) =>
      resendVerificationCodeMutation(request).unwrap(),
    [resendVerificationCodeMutation],
  );

  return {
    resendVerificationCode,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
