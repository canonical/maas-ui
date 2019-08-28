const auth = {};

/**
 * Get the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The authenticated user.
 */
auth.get = state => state.user.auth.user;

/**
 * Get the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} The authenticated user.
 */
auth.loading = state => state.user.auth.loading;

export default auth;
