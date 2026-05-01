"use client";

import { useCallback } from "react";
import { useForgotPasswordMutation } from "../api/authApi";
import type { ForgotPasswordRequest } from "../types/auth.types";

export const useForgotPassword = () => {
  const [
    forgotPasswordMutation,
    { data, error, isLoading, isSuccess, isError, reset },
  ] = useForgotPasswordMutation();

  const forgotPassword = useCallback(
    (request: ForgotPasswordRequest) =>
      forgotPasswordMutation(request).unwrap(),
    [forgotPasswordMutation],
  );

  return {
    forgotPassword,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
