const componentsToDisable = {};

/**
 * Returns list of components that can be disabled for default Ubuntu archives
 * @param {Object} state - Redux state
 * @returns {Array} Components to disable
 */
componentsToDisable.get = state => state.general.componentsToDisable.data;

/**
 * Returns true if components to disable is loading
 * @param {Object} state - Redux state
 * @returns {Boolean} Components to disable is loading
 */
componentsToDisable.loading = state =>
  state.general.componentsToDisable.loading;

/**
 * Returns true if components to disable has loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} Components to disable has loaded
 */
componentsToDisable.loaded = state => state.general.componentsToDisable.loaded;

export default componentsToDisable;
