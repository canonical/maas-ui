const sslkey = {};

/**
 * Returns a list of all SSL keys.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all state.sslkey.items.
 */
sslkey.all = (state) => state.sslkey.items;

/**
 * Whether the SSL keys are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether SSL keys are loading.
 */
sslkey.loading = (state) => state.sslkey.loading;

/**
 * Whether the SSL keys have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether SSL keys have loaded.
 */
sslkey.loaded = (state) => state.sslkey.loaded;

/**
 * Get the SSL key errors.
 * @param {Object} state - The redux state.
 * @returns {String} The errors from the API.
 */
sslkey.errors = (state) => state.sslkey.errors;

/**
 * Whether the SSL keys are saving.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether SSL keys are saving.
 */
sslkey.saving = (state) => state.sslkey.saving;

/**
 * Whether the SSL keys have been saved.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether SSL keys have saved.
 */
sslkey.saved = (state) => state.sslkey.saved;

export default sslkey;
