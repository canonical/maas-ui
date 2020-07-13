import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { ScriptResults } from "app/store/scriptresults/types";
import type { TSFixMe } from "app/base/types";

/**
 * Returns list of all script results.
 * @param {Object} state - Redux state
 * @returns {Array} Script results
 */
const all = (state: RootState): ScriptResults => state.scriptresults.items;

/**
 * Returns true if script results are loading
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts results are loading
 */

const loading = (state: RootState): boolean => state.scriptresults.loading;

/**
 * Returns true if script results have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts results have loaded
 */
const loaded = (state: RootState): boolean => state.scriptresults.loaded;

/**
 * Returns true if script results have saved
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts results have saved
 */
const saved = (state: RootState): boolean => state.scriptresults.saved;

/**
 * Returns script result errors.
 * @param {Object} state - The redux state.
 * @returns {Array} Errors for a script result.
 */
const errors = (state: RootState): TSFixMe => state.scriptresults.errors;

/**
 * Returns true if script results have errors
 * @param {Object} state - Redux state
 * @returns {Boolean} Script results have errors
 */
const hasErrors = createSelector(
  [errors],
  (errors) => Object.entries(errors).length > 0
);

const scriptresults = {
  all,
  errors,
  hasErrors,
  loaded,
  loading,
  saved,
};

export default scriptresults;
