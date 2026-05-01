"use client";

import { useCallback } from "react";
import { useSignInMutation } from "../api/authApi";
import type { SignInRequest } from "../types/auth.types";

export const useSignIn = () => {
  const [signInMutation, { data, error, isLoading, isSuccess, isError, reset }] =
    useSignInMutation();

  const signIn = useCallback(
    (request: SignInRequest) => signInMutation(request).unwrap(),
    [signInMutation],
  );

  return {
    signIn,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
