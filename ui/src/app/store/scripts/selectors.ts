import { createSelector } from "@reduxjs/toolkit";

import { generateBaseSelectors } from "app/store/utils";
import type { RootState } from "app/store/root/types";
import type { Scripts, ScriptsState } from "app/store/scripts/types";

enum SCRIPT_TYPES {
  COMMISSIONING = 0,
  TESTING = 2,
}

type ScriptTypeName = keyof typeof SCRIPT_TYPES;

const defaultSelectors = generateBaseSelectors<ScriptsState, Scripts, "id">(
  "scripts",
  "id"
);

/**
 * Returns true if scripts have errors
 * @param {RootState} state - Redux state
 * @returns {Boolean} Scripts have errors
 */
const hasErrors = createSelector(
  [defaultSelectors.errors],
  (errors) => Object.entries(errors).length > 0
);

/**
 * Returns all commissioning scripts
 * @param {RootState} state - Redux state
 * @returns {Scripts[]} Commissioning scripts
 */
const commissioning = createSelector([defaultSelectors.all], (scriptItems) =>
  scriptItems.filter(
    (item: Scripts) => item.type === SCRIPT_TYPES.COMMISSIONING
  )
);

/**
 * Returns all default commissioning scripts
 * @param {RootState} state - Redux state
 * @returns scripts - Commissioning scripts
 *
 */
const defaultCommissioning = createSelector(
  [commissioning],
  (commissioningItems: Scripts[]): Scripts[] =>
    commissioningItems.filter(
      (item) => item.default === true && !item.tags.includes("noauto")
    )
);

/**
 * Returns all testing scripts
 * @param {RootState} state - Redux state
 * @returns {Scripts[]} Testing scripts
 */
const testing = createSelector([defaultSelectors.all], (scriptItems) =>
  scriptItems.filter((item: Scripts) => item.type === SCRIPT_TYPES.TESTING)
);

/**
 * Returns all default testing scripts
 * @param {RootState} state - Redux state
 * @returns scripts - Testing scripts
 *
 */
const defaultTesting = createSelector(
  [testing],
  (testingItems: Scripts[]): Scripts[] =>
    testingItems.filter(
      (item) => item.default === true && !item.tags.includes("noauto")
    )
);

/**
 * Returns testing scripts that contain a URL parameter
 * @param {RootState} state - Redux state
 * @returns {Scripts[]} Testing scripts
 */
const testingWithUrl = createSelector([testing], (testScripts) =>
  testScripts.filter((script: Scripts) =>
    Object.keys(script.parameters).some((key) => key === "url")
  )
);

/**
 * Get scripts that match a term.
 * @param {RootState} state - The redux state.
 * @param {String} term - The term to match against.
 * @param {String} type - The type of script.
 * @returns {Scripts[]} A filtered list of scripts.
 */
const search = createSelector(
  [
    defaultSelectors.all,
    (_state: RootState, term: string, type: string) => ({ term, type }),
  ],
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
  ...defaultSelectors,
  commissioning,
  defaultCommissioning,
  hasErrors,
  search,
  testing,
  defaultTesting,
  testingWithUrl,
};

export default scripts;
