import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { StatusMeta } from "./types";
import type { StatusState } from "./types";

const statusSlice = createSlice({
  initialState: {
    authenticated: false,
    // Default to authenticating so that the login screen doesn't flash.
    authenticating: true,
    authenticationError: null,
    connected: false,
    connecting: false,
    error: null,
    externalAuthURL: null,
    externalLoginURL: null,
    noUsers: false,
  } as StatusState,
  name: StatusMeta.MODEL,
  reducers: {
    checkAuthenticated: {
      prepare: () => ({
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    checkAuthenticatedError: (
      state: StatusState,
      action: PayloadAction<StatusState["error"]>
    ) => {
      state.authenticating = false;
      state.authenticated = false;
      state.error = action.payload;
    },
    checkAuthenticatedStart: (state: StatusState) => {
      state.authenticating = true;
    },
    checkAuthenticatedSuccess: (
      state: StatusState,
      action: PayloadAction<{
        authenticated: StatusState["authenticated"];
        external_auth_url: StatusState["externalAuthURL"];
        no_users: StatusState["noUsers"];
      }>
    ) => {
      state.authenticating = false;
      state.authenticated = action.payload.authenticated;
      state.externalAuthURL = action.payload.external_auth_url;
      state.noUsers = action.payload.no_users;
    },
    externalLogin: {
      prepare: () => ({
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    externalLoginError: (
      state: StatusState,
      action: PayloadAction<StatusState["authenticationError"]>
    ) => {
      state.authenticationError = action.payload;
      state.authenticating = false;
    },
    externalLoginSuccess: (state: StatusState) => {
      state.authenticated = true;
      state.authenticating = false;
      state.authenticationError = null;
      state.error = null;
    },
    externalLoginURL: (
      state: StatusState,
      action: PayloadAction<{
        url: StatusState["externalLoginURL"];
      }>
    ) => {
      state.externalLoginURL = action.payload.url;
    },
    login: {
      prepare: (params: { password: string; username: string }) => ({
        payload: params,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    loginError: (
      state: StatusState,
      action: PayloadAction<StatusState["authenticationError"]>
    ) => {
      state.authenticationError = action.payload;
      state.authenticating = false;
    },
    loginStart: (state: StatusState) => {
      state.authenticating = true;
    },
    loginSuccess: (state: StatusState) => {
      state.authenticated = true;
      state.authenticating = false;
      state.authenticationError = null;
      state.error = null;
    },
    logout: {
      prepare: () => ({
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    logoutSuccess: (state: StatusState) => {
      state.authenticated = false;
    },
    websocketConnect: (state: StatusState) => {
      state.connected = false;
      state.connecting = true;
    },
    websocketConnected: (state: StatusState) => {
      state.connected = true;
      state.connecting = false;
      state.authenticationError = null;
      state.error = null;
    },
    websocketDisconnect: {
      prepare: () => ({
        payload: null,
      }),
      reducer: () => {
        // No state changes need to be handled for this action.
      },
    },
    websocketDisconnected: (state: StatusState) => {
      state.connected = false;
    },
    websocketError: (
      state: StatusState,
      action: PayloadAction<StatusState["authenticationError"]>
    ) => {
      state.error = action.payload;
      state.connected = false;
      state.connecting = false;
    },
  },
});

export const { actions } = statusSlice;

export default statusSlice.reducer;
