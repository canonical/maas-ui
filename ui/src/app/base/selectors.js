const auth = {};

/**
 * Get the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The authenticated user.
 */
auth.getAuthUser = state => state.auth;

const status = {};

/**
 * Whether the websocket is connected.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The websocket connected status.
 */
status.getConnected = state => state.status.connected;

/**
 * Whether there is a websocket error.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The websocket error status.
 */
status.getError = state => state.status.error;

export default { auth, status };
