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

/**
 * Whether the authenticated user has loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} User has loaded.
 */
auth.loaded = state => state.user.auth.loaded;

/**
 * Returns users errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Errors for a user.
 */
auth.errors = state => state.user.auth.errors;

/**
 * Get the saving state for the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether the authenticated user is being saved.
 */
auth.saving = state => state.user.auth.saving;

/**
 * Get the saved state for the authenticated user.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether the authenticated user has been saved.
 */
auth.saved = state => state.user.auth.saved;

export default auth;
