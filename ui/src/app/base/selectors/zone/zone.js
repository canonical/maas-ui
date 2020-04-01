const zone = {};

/**
 * Returns all zones.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all zones.
 */
zone.all = (state) => state.zone.items;

/**
 * Whether zones are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Zone loading state.
 */
zone.loading = (state) => state.zone.loading;

/**
 * Whether zones have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Zone loaded state.
 */
zone.loaded = (state) => state.zone.loaded;

/**
 * Returns zone errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Zone errors.
 */
zone.errors = (state) => state.zone.errors;

export default zone;
