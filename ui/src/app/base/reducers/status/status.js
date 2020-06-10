import { createReducer } from "@reduxjs/toolkit";

import { status as statusActions } from "app/base/actions";

const loginSuccess = (state) => {
  state.authenticated = true;
  state.authenticating = false;
  state.authenticationError = null;
  state.authenticationError = null;
  state.error = null;
};

const loginError = (state, action) => {
  state.authenticationError = action.error;
  state.authenticating = false;
};

const initialState = {
  // Default to authenticating so that the login screen doesn't flash.
  authenticating: true,
  authenticated: false,
  externalAuthURL: null,
  externalLoginURL: null,
  connected: false,
  noUsers: false,
  error: null,
};

const status = createReducer(initialState, {
  [statusActions.checkAuthenticated.start]: (state) => {
    state.authenticating = true;
  },
  [statusActions.checkAuthenticated.success]: (state, action) => {
    state.authenticating = false;
    state.authenticated = action.payload.authenticated;
    state.externalAuthURL = action.payload.external_auth_url;
    state.noUsers = action.payload.no_users;
  },
  [statusActions.login.start]: (state) => {
    state.authenticating = true;
  },
  [statusActions.login.error]: (state, action) => loginError(state, action),
  [statusActions.login.success]: (state) => loginSuccess(state),
  [statusActions.externalLogin.success]: (state) => loginSuccess(state),
  [statusActions.externalLogin.error]: (state, action) =>
    loginError(state, action),
  [statusActions.logout.success]: (state) => {
    state.authenticated = false;
  },
  [statusActions.checkAuthenticated.error]: (state, action) => {
    state.authenticating = false;
    state.authenticated = false;
    state.error = action.error;
  },
  [statusActions.websocketConnect]: (state) => {
    state.connected = false;
    state.connecting = true;
  },
  [statusActions.websocketConnected]: (state) => {
    state.connected = true;
    state.connecting = false;
    state.authenticationError = null;
    state.error = null;
  },
  [statusActions.websocketDisconnected]: (state) => {
    state.connected = false;
  },
  [statusActions.websocketError]: (state, action) => {
    state.error = action.error;
    state.connected = false;
    state.connecting = false;
  },
  [statusActions.externalLoginURL]: (state, action) => {
    state.externalLoginURL = action.payload.url;
  },
});

export default status;
