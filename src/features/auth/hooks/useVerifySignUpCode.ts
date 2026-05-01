"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useVerifySignUpCodeMutation } from "../api/authApi";
import { setCredentials } from "../slices/authSlice";
import type { VerifyCodeRequest } from "../types/auth.types";

export const useVerifySignUpCode = () => {
  const dispatch = useAppDispatch();
  const [
    verifySignUpCodeMutation,
    { data, error, isLoading, isSuccess, isError, reset },
  ] = useVerifySignUpCodeMutation();

  const verifySignUpCode = useCallback(
    async (request: VerifyCodeRequest) => {
      const response = await verifySignUpCodeMutation(request).unwrap();

      dispatch(
        setCredentials({
          accessToken: response.accessToken,
          user: response.user,
        }),
      );

      return response;
    },
    [dispatch, verifySignUpCodeMutation],
  );

  return {
    verifySignUpCode,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
