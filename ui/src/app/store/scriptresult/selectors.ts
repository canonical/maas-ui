import { createSelector } from "@reduxjs/toolkit";

import type { ScriptResult } from "./types";

import type { TSFixMe } from "app/base/types";
import type { RootState } from "app/store/root/types";

/**
 * Returns list of all script results.
 * @param {RootState} state - Redux state
 * @returns List of script results
 */
const all = (state: RootState): ScriptResult[] => state.scriptResult.items;

/**
 * Returns true if script results are loading
 * @param {RootState} state - Redux state
 * @returns {ScriptResultState["loading"]} Scripts results are loading
 */

const loading = (state: RootState): boolean => state.scriptResult.loading;

/**
 * Returns true if script results have loaded
 * @param {RootState} state - Redux state
 * @returns {ScriptResultState["loaded"]} Scripts results have loaded
 */
const loaded = (state: RootState): boolean => state.scriptResult.loaded;

/**
 * Returns true if script results have saved
 * @param {RootState} state - Redux state
 * @returns {ScriptResultState["saved"]} Scripts results have saved
 */
const saved = (state: RootState): boolean => state.scriptResult.saved;

/**
 * Returns script result errors.
 * @param {RootState} state - The redux state.
 * @returns {ScriptResultState["errors"]} Errors for a script result.
 */
const errors = (state: RootState): TSFixMe => state.scriptResult.errors;

/**
 * Returns true if script results have errors
 * @param {RootState} state - Redux state
 * @returns {Boolean} Script results have errors
 */
const hasErrors = createSelector(
  [errors],
  (errors) => Object.entries(errors).length > 0
);

const scriptResult = {
  all,
  errors,
  hasErrors,
  loaded,
  loading,
  saved,
};

export default scriptResult;
