"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useVerifySignInCodeMutation } from "../api/authApi";
import { setCredentials } from "../slices/authSlice";
import type { VerifyCodeRequest } from "../types/auth.types";

export const useVerifySignInCode = () => {
  const dispatch = useAppDispatch();
  const [
    verifySignInCodeMutation,
    { data, error, isLoading, isSuccess, isError, reset },
  ] = useVerifySignInCodeMutation();

  const verifySignInCode = useCallback(
    async (request: VerifyCodeRequest) => {
      const response = await verifySignInCodeMutation(request).unwrap();

      dispatch(
        setCredentials({
          accessToken: response.accessToken,
          user: response.user,
        }),
      );

      return response;
    },
    [dispatch, verifySignInCodeMutation],
  );

  return {
    verifySignInCode,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
