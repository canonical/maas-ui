const pocketsToDisable = {};

/**
 * Returns list of pockets that can be disabled
 * @param {Object} state - Redux state
 * @returns {Array} Pockets to disable
 */
pocketsToDisable.get = state => state.general.pocketsToDisable.data;

/**
 * Returns true if pockets to disable is loading
 * @param {Object} state - Redux state
 * @returns {Boolean} Pockets to disable is loading
 */
pocketsToDisable.loading = state => state.general.pocketsToDisable.loading;

/**
 * Returns true if pockets to disable has loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} Pockets to disable has loaded
 */
pocketsToDisable.loaded = state => state.general.pocketsToDisable.loaded;

export default pocketsToDisable;
