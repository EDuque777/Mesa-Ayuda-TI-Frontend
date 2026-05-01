"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useRefreshTokenMutation } from "../api/authApi";
import { setCredentials } from "../slices/authSlice";

export const useRefreshToken = () => {
  const dispatch = useAppDispatch();
  const [
    refreshTokenMutation,
    { data, error, isLoading, isSuccess, isError, reset },
  ] = useRefreshTokenMutation();

  const refreshToken = useCallback(async () => {
    const response = await refreshTokenMutation().unwrap();

    dispatch(
      setCredentials({
        accessToken: response.accessToken,
        user: response.user,
      }),
    );

    return response;
  }, [dispatch, refreshTokenMutation]);

  return {
    refreshToken,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
