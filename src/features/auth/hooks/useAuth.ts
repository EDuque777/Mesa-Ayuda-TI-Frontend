"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCredentials,
  selectAccessToken,
  selectAuthStatus,
  selectCurrentUser,
  selectCurrentUserRole,
  selectIsAuthenticated,
  selectIsSuperAdmin,
  setCredentials,
} from "../slices/authSlice";
import type { AuthSessionResponse } from "../types/auth.types";

type AuthCredentials = Pick<AuthSessionResponse, "accessToken" | "user">;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authStatus = useAppSelector(selectAuthStatus);
  const userRole = useAppSelector(selectCurrentUserRole);
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);

  const setAuthCredentials = useCallback(
    (credentials: AuthCredentials) => {
      dispatch(setCredentials(credentials));
    },
    [dispatch],
  );

  const clearAuthCredentials = useCallback(() => {
    dispatch(clearCredentials());
  }, [dispatch]);

  return {
    user,
    accessToken,
    isAuthenticated,
    authStatus,
    userRole,
    isSuperAdmin,
    setAuthCredentials,
    clearAuthCredentials,
  };
};
