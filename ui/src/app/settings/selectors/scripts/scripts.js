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
 * Returns count of scripts
 * @param {Object} state - Redux state
 * @returns {Number} Number of scripts
 */

scripts.count = state => state.scripts.items.length;

/**
 * Returns true if scripts have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts have loaded
 */
scripts.loaded = state => state.scripts.loaded;

/**
 * Returns true if scripts have saved
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts have saved
 */
scripts.saved = state => state.scripts.saved;

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

/**
 * Get scripts that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @param {String} type - The type of script.
 * @returns {Array} A filtered list of scripts.
 */
scripts.search = (state, term, type) => {
  const scripts = state.scripts.items.filter(
    item => item.type === SCRIPT_TYPES[type.toUpperCase()]
  );
  if (term) {
    return scripts.filter(
      item => item.name.includes(term) || item.description.includes(term)
    );
  }
  return scripts;
};

export default scripts;
