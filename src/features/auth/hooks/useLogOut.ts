"use client";

import { useCallback } from "react";
import { useLogOutMutation } from "../api/authApi";

export const useLogOut = () => {
  const [logOutMutation, { data, error, isLoading, isSuccess, isError, reset }] =
    useLogOutMutation();

  const logOut = useCallback(async () => {
    return logOutMutation().unwrap();
  }, [logOutMutation]);

  return {
    logOut,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
