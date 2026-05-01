"use client";

import { useCallback } from "react";
import { useSignUpMutation } from "../api/authApi";
import type { SignUpRequest } from "../types/auth.types";

export const useSignUp = () => {
  const [signUpMutation, { data, error, isLoading, isSuccess, isError, reset }] =
    useSignUpMutation();

  const signUp = useCallback(
    (request: SignUpRequest) => signUpMutation(request).unwrap(),
    [signUpMutation],
  );

  return {
    signUp,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  };
};
