import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { Scripts } from "app/store/scripts/types";
import type { TSFixMe } from "app/base/types";

enum SCRIPT_TYPES {
  COMMISSIONING = 0,
  TESTING = 2,
}

type ScriptTypeName = keyof typeof SCRIPT_TYPES;

/**
 * Returns list of all scripts.
 * @param {Object} state - Redux state
 * @returns {Array} Scripts
 */
const all = (state: RootState): Scripts[] => state.scripts.items;

/**
 * Returns true if scripts are loading
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts are loading
 */

const loading = (state: RootState): boolean => state.scripts.loading;

/**
 * Returns count of scripts
 * @param {Object} state - Redux state
 * @returns {Number} Number of scripts
 */
const count = createSelector([all], (scriptItems) => scriptItems.length);

/**
 * Returns true if scripts have loaded
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts have loaded
 */
const loaded = (state: RootState): boolean => state.scripts.loaded;

/**
 * Returns true if scripts have saved
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts have saved
 */
const saved = (state: RootState): boolean => state.scripts.saved;

/**
 * Returns script errors.
 * @param {Object} state - The redux state.
 * @returns {Array} Errors for a script.
 */
const errors = (state: RootState): TSFixMe => state.scripts.errors;

/**
 * Returns true if scripts have errors
 * @param {Object} state - Redux state
 * @returns {Boolean} Scripts have errors
 */
const hasErrors = createSelector(
  [errors],
  (errors) => Object.entries(errors).length > 0
);

/**
 * Returns all commissioning scripts
 * @param {Object} state - Redux state
 * @returns {Array} Commissioning scripts
 */
const commissioning = createSelector([all], (scriptItems) =>
  scriptItems.filter(
    (item: Scripts) => item.type === SCRIPT_TYPES.COMMISSIONING
  )
);

/**
 * Returns all testing scripts
 * @param {Object} state - Redux state
 * @returns {Array} Testing scripts
 */
const testing = createSelector([all], (scriptItems) =>
  scriptItems.filter((item: Scripts) => item.type === SCRIPT_TYPES.TESTING)
);

/**
 * Returns testing scripts that contain a URL parameter
 * @param {Object} state - Redux state
 * @returns {Array} Testing scripts
 */
const testingWithUrl = createSelector([testing], (testScripts) =>
  testScripts.filter((script: Scripts) =>
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
const search = createSelector(
  [all, (_state: RootState, term: string, type: string) => ({ term, type })],
  (scriptItems, { term, type }) => {
    const scripts = scriptItems.filter(
      (item: Scripts) =>
        item.type === SCRIPT_TYPES[type.toUpperCase() as ScriptTypeName]
    );
    if (term) {
      return scripts.filter(
        (item: Scripts) =>
          item.name.includes(term) || item.description.includes(term)
      );
    }
    return scripts;
  }
);

const scripts = {
  all,
  commissioning,
  count,
  errors,
  hasErrors,
  loaded,
  loading,
  saved,
  search,
  testing,
  testingWithUrl,
};

export default scripts;
