"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useVerifyEmailMutation } from "../api/authApi";
import { setCredentials } from "../slices/authSlice";
import type { VerifyCodeRequest } from "../types/auth.types";

export const useVerifyEmail = () => {
  const dispatch = useAppDispatch();
  const [
    verifyEmailMutation,
    { data, error, isLoading, isSuccess, isError, reset },
  ] = useVerifyEmailMutation();

  const verifyEmail = useCallback(
    async (request: VerifyCodeRequest) => {
      const response = await verifyEmailMutation(request).unwrap();

      dispatch(
        setCredentials({
          accessToken: response.accessToken,
          user: response.user,
        }),
      );

      return response;
    },
    [dispatch, verifyEmailMutation],
  );

  return {
    verifyEmail,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
