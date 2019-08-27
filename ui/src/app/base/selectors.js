const auth = {};

/**
 * Get the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The authenticated user.
 */
auth.getAuthUser = state => state.user.auth.user;

/**
 * Get the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The authenticated user.
 */
auth.getAuthUserLoading = state => state.user.auth.loading;

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

const messages = {};

/**
 * Get the global messages.
 * @param {Object} state - The redux state.
 * @returns {Array} The list of messages.
 */
messages.all = state => state.messages.items;

export default { auth, messages, status };
