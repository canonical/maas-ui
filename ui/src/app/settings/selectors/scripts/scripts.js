const SCRIPT_TYPES = {
  COMMISSIONING: 0,
  TESTING: 2
};

const scripts = {};

/**
 * Returns list of all scripts.
 * @param {Object} state - Redux state
 * @returns {Array} Scripts
 */
scripts.all = state => state.scripts.items;

/**
 * Returns true if scripts are loading
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts are loading
 */

scripts.loading = state => state.scripts.loading;

/**
 * Returns true if scripts have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts have loaded
 */
scripts.loaded = state => state.scripts.loaded;

/**
 * Returns all commissioning scripts
 * @param {Object} state - Redux state
 * @returns {Array} Commissioning scripts
 */
scripts.commissioning = state =>
  state.scripts.items.filter(item => item.type === SCRIPT_TYPES.COMMISSIONING);

/**
 * Returns all testing scripts
 * @param {Object} state - Redux state
 * @returns {Array} Testing scripts
 */
scripts.testing = state =>
  state.scripts.items.filter(item => item.type === SCRIPT_TYPES.TESTING);

export default scripts;
