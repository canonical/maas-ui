const resourcepool = {};

/**
 * Returns all resource pools.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all resource pools.
 */
resourcepool.all = state => state.resourcepool.items;

/**
 * Whether resource pools are loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Resource pool loading state.
 */
resourcepool.loading = state => state.resourcepool.loading;

/**
 * Whether resource pools have been loaded.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Resource pools loaded state.
 */
resourcepool.loaded = state => state.resourcepool.loaded;

/**
 * Returns resource pool errors.
 * @param {Object} state - The redux state.
 * @returns {Object} Resource pool errors state.
 */
resourcepool.errors = state => state.resourcepool.errors;

/**
 * Get the saving state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether resource pools are being saved.
 */
resourcepool.saving = state => state.resourcepool.saving;

/**
 * Get the saved state.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Whether resource pools have been saved.
 */
resourcepool.saved = state => state.resourcepool.saved;

export default resourcepool;
