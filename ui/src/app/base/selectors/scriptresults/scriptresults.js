const scriptresults = {};

/**
 * Returns list of all script results.
 * @param {Object} state - Redux state
 * @returns {Array} Script results
 */
scriptresults.all = (state) => state.scriptresults.items;

/**
 * Returns true if script results are loading
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts results are loading
 */

scriptresults.loading = (state) => state.scriptresults.loading;

/**
 * Returns true if script results have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts results have loaded
 */
scriptresults.loaded = (state) => state.scriptresults.loaded;

/**
 * Returns true if script results have saved
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts results have saved
 */
scriptresults.saved = (state) => state.scriptresults.saved;

/**
 * Returns true if script results have errors
 * @param {Object} state - Redux state
 * @returns {Boolean} Script results have errors
 */
scriptresults.hasErrors = (state) =>
  Object.entries(state.scriptresults.errors).length > 0;

/**
 * Returns script result errors.
 * @param {Object} state - The redux state.
 * @returns {Array} Errors for a script result.
 */
scriptresults.errors = (state) => state.scripts.errors;

export default scriptresults;
