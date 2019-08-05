const configuration = {};

/**
 * Returns all configuration.
 * @param {Object} state - The redux state.
 * @returns {Array} A list of all configuration.
 */
configuration.all = state => {
  return state.configuration.items;
};

/**
 * Returns true if configuration is loading.
 * @param {Object} state - The redux state.
 * @returns {Boolean} Configuration is loading.
*/
configuration.loading = state => state.configuration.loading;

/**
 * Returns true if configuration has been loaded.
 * @param {Object} state - The redux store.
 * @returns {Boolean} Configuration has been loaded.
 */
configuration.loaded = state => state.configuration.loaded;

export default configuration;
