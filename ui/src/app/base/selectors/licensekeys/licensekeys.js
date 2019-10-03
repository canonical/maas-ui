const licensekeys = {};

/**
 * Returns list of all license keys.
 * @param {Object} state - Redux state
 * @returns {Array} license keys
 */
licensekeys.all = state => state.licensekeys.items;

/**
 * Returns true if license keys are loading
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys are loading
 */

licensekeys.loading = state => state.licensekeys.loading;

/**
 * Returns true if license keys have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys have loaded
 */
licensekeys.loaded = state => state.licensekeys.loaded;

/**
 * Returns true if license keys have errors
 * @param {Object} state - Redux state
 * @returns {Boolean} License keys have errors
 */
licensekeys.hasErrors = state =>
  Object.entries(state.licensekeys.errors).length > 0;

/**
 * Returns license keys errors.
 * @param {Object} state - The redux state.
 * @returns {Array} Errors for license keys.
 */
licensekeys.errors = state => state.licensekeys.errors;

/**
 * Get license keys that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @returns {Array} A filtered list of license keys.
 */
licensekeys.search = (state, term) =>
  state.licensekeys.items.filter(
    item => item.osystem.includes(term) || item.distro_series.includes(term)
  );

export default licensekeys;
