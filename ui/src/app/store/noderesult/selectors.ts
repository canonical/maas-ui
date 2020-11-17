import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "app/store/root/types";
import type { TSFixMe } from "app/base/types";
import { NodeResults } from "./types";
import { Machine } from "../machine/types";

/**
 * Returns list of all node results.
 * @param state - Redux state
 * @returns Node results
 */
const all = (state: RootState): NodeResults[] => state.noderesult.items;

/**
 * Returns a node result by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @returns Node results
 */
const get = createSelector(
  [all, (_: RootState, machineID: Machine["system_id"]) => machineID],
  (noderesults, machineID) =>
    noderesults.find((result) => machineID === result.id)
);

/**
 * Returns node results by machine ids
 * @param state - Redux state
 * @returns Node results
 */
const getByIds = createSelector(
  [all, (_: RootState, machineIDs: Machine["system_id"][]) => machineIDs],
  (noderesults, machineIDs) =>
    noderesults.filter((result) => machineIDs.includes(result.id))
);

/**
 * Returns true if node results are loading
 * @param state - Redux state
 * @returns {NodeResultState["loading"]} Node results are loading
 */

const loading = (state: RootState): boolean => state.noderesult.loading;

/**
 * Returns true if node results have saved
 * @param state - Redux state
 * @returns {NodeResultState["saved"]} Node results have saved
 */
const saved = (state: RootState): boolean => state.noderesult.saved;

/**
 * Returns node result errors.
 * @param state - The redux state.
 * @returns {NodeResultState["errors"]} Errors for a node result.
 */
const errors = (state: RootState): TSFixMe => state.noderesult.errors;

/**
 * Returns true if node results have errors
 * @param state - Redux state
 * @returns {Boolean} Node results have errors
 */
const hasErrors = createSelector(
  [errors],
  (errors) => Object.entries(errors).length > 0
);

const noderesult = {
  all,
  get,
  getByIds,
  errors,
  hasErrors,
  loading,
  saved,
};

export default noderesult;
