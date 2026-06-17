import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { AuthSessionResponse, AuthState } from "../types/auth.types";

type AuthCredentialsPayload = Pick<AuthSessionResponse, "accessToken" | "user">;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  authStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<AuthCredentialsPayload>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.authStatus = "authenticated";
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.authStatus = "unauthenticated";
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentUserRole = (state: RootState) =>
  state.auth.user?.role ?? "USER";
export const selectIsSuperAdmin = (state: RootState) =>
  state.auth.user?.role === "SUPER_ADMIN";
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.authStatus;

export default authSlice.reducer;
