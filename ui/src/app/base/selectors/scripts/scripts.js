import { createSelector } from "@reduxjs/toolkit";

const SCRIPT_TYPES = {
  COMMISSIONING: 0,
  TESTING: 2,
};

const scripts = {};

/**
 * Returns list of all scripts.
 * @param {Object} state - Redux state
 * @returns {Array} Scripts
 */
scripts.all = (state) => state.scripts.items;

/**
 * Returns true if scripts are loading
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts are loading
 */

scripts.loading = (state) => state.scripts.loading;

/**
 * Returns count of scripts
 * @param {Object} state - Redux state
 * @returns {Number} Number of scripts
 */
scripts.count = createSelector(
  [scripts.all],
  (scriptItems) => scriptItems.length
);

/**
 * Returns true if scripts have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts have loaded
 */
scripts.loaded = (state) => state.scripts.loaded;

/**
 * Returns true if scripts have saved
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts have saved
 */
scripts.saved = (state) => state.scripts.saved;

/**
 * Returns script errors.
 * @param {Object} state - The redux state.
 * @returns {Array} Errors for a script.
 */
scripts.errors = (state) => state.scripts.errors;

/**
 * Returns true if scripts have errors
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts have errors
 */
scripts.hasErrors = createSelector(
  [scripts.errors],
  (errors) => Object.entries(errors).length > 0
);

/**
 * Returns all commissioning scripts
 * @param {Object} state - Redux state
 * @returns {Array} Commissioning scripts
 */
scripts.commissioning = createSelector([scripts.all], (scriptItems) =>
  scriptItems.filter((item) => item.type === SCRIPT_TYPES.COMMISSIONING)
);

/**
 * Returns all preselected commissioning scripts
 * @param {Object} state - Redux state
 * @returns {Array} Preselected commissioning scripts
 */
scripts.preselectedCommissioning = createSelector(
  [scripts.commissioning],
  (commissioningScripts) =>
    commissioningScripts.filter((script) => !script.tags.includes("noauto"))
);

/**
 * Returns all testing scripts
 * @param {Object} state - Redux state
 * @returns {Array} Testing scripts
 */
scripts.testing = createSelector([scripts.all], (scriptItems) =>
  scriptItems.filter((item) => item.type === SCRIPT_TYPES.TESTING)
);

/**
 * Returns testing scripts that contain a URL parameter
 * @param {Object} state - Redux state
 * @returns {Array} Testing scripts
 */
scripts.testingWithUrl = createSelector([scripts.testing], (testScripts) =>
  testScripts.filter((script) =>
    Object.keys(script.parameters).some((key) => key === "url")
  )
);

/**
 * Get scripts that match a term.
 * @param {Object} state - The redux state.
 * @param {String} term - The term to match against.
 * @param {String} type - The type of script.
 * @returns {Array} A filtered list of scripts.
 */
scripts.search = createSelector(
  [scripts.all, (state, term, type) => ({ term, type })],
  (scriptItems, { term, type }) => {
    const scripts = scriptItems.filter(
      (item) => item.type === SCRIPT_TYPES[type.toUpperCase()]
    );
    if (term) {
      return scripts.filter(
        (item) => item.name.includes(term) || item.description.includes(term)
      );
    }
    return scripts;
  }
);

export default scripts;
