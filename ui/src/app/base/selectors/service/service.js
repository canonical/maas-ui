const service = {};

/**
 * Returns all services.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all services.
 */
service.all = state => state.service.items;

/**
 * Whether services are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Service loading state.
 */
service.loading = state => state.service.loading;

/**
 * Whether services have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Service loaded state.
 */
service.loaded = state => state.service.loaded;

/**
 * Returns services errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Service errors state.
 */
service.errors = state => state.service.errors;

export default service;
