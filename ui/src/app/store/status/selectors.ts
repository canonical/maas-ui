import type { RootState } from "app/store/root/types";

/**
 * Whether the user is authenticated.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The user authentication status.
 */
const authenticated = (state: RootState): boolean => state.status.authenticated;

/**
 * Whether the user is authenticating.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The user authentication status.
 */
const authenticating = (state: RootState): boolean =>
  state.status.authenticating;

/**
 * Whether the websocket is connected.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The websocket connected status.
 */
const connected = (state: RootState): boolean => state.status.connected;

/**
 * Whether the websocket is connecting.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The websocket connecting status.
 */
const connecting = (state: RootState): boolean => state.status.connecting;

/**
 * Whether there is a websocket error.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The websocket error status.
 */
const error = (state: RootState): boolean => state.status.error;

/**
 * Whether there is an authentication error.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The authentication error status.
 */
const authenticationError = (state: RootState): boolean =>
  state.status.authenticationError;

/**
 * Get the external auth url.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The external auth url.
 */
const externalAuthURL = (state: RootState): string =>
  state.status.externalAuthURL;

/**
 * Get the external login url.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The external login url.
 */
const externalLoginURL = (state: RootState): string =>
  state.status.externalLoginURL;

/**
 * Whether there are currently no MAAS users.
 * @param {Object} state - The redux state.
 * @returns {Boolean} No users in MAAS.
 */
const noUsers = (state: RootState): boolean => state.status.noUsers;

const status = {
  authenticated,
  authenticating,
  authenticationError,
  connected,
  connecting,
  error,
  externalAuthURL,
  externalLoginURL,
  noUsers,
};

export default status;
