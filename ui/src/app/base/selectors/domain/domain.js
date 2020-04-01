const domain = {};

/**
 * Returns all domains.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all domains.
 */
domain.all = (state) => state.domain.items;

/**
 * Whether domains are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Domains loading state.
 */
domain.loading = (state) => state.domain.loading;

/**
 * Whether domains have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Domains loaded state.
 */
domain.loaded = (state) => state.domain.loaded;

export default domain;
