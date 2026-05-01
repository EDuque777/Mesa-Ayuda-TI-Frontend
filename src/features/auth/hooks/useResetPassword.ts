"use client";

import { useCallback } from "react";
import { useResetPasswordMutation } from "../api/authApi";
import type { ResetPasswordRequest } from "../types/auth.types";

export const useResetPassword = () => {
  const [
    resetPasswordMutation,
    { data, error, isLoading, isSuccess, isError, reset },
  ] = useResetPasswordMutation();

  const resetPassword = useCallback(
    (request: ResetPasswordRequest) => resetPasswordMutation(request).unwrap(),
    [resetPasswordMutation],
  );

  return {
    resetPassword,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
