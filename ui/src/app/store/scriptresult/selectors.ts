import { createSelector } from "@reduxjs/toolkit";

import type { Machine } from "../machine/types";
import nodeScriptResultSelectors from "../nodescriptresult/selectors";

import type { ScriptResult } from "./types";

import { HardwareType, ResultType } from "app/base/enum";
import type { TSFixMe } from "app/base/types";
import type { RootState } from "app/store/root/types";

/**
 * Returns list of all script results.
 * @param {RootState} state - Redux state
 * @returns List of script results
 */
const all = (state: RootState): ScriptResult[] => state.scriptresult.items;

/**
 * Returns true if script results are loading
 * @param {RootState} state - Redux state
 * @returns {ScriptResultState["loading"]} Scripts results are loading
 */

const loading = (state: RootState): boolean => state.scriptresult.loading;

/**
 * Returns true if script results have loaded
 * @param {RootState} state - Redux state
 * @returns {ScriptResultState["loaded"]} Scripts results have loaded
 */
const loaded = (state: RootState): boolean => state.scriptresult.loaded;

/**
 * Returns true if script results have saved
 * @param {RootState} state - Redux state
 * @returns {ScriptResultState["saved"]} Scripts results have saved
 */
const saved = (state: RootState): boolean => state.scriptresult.saved;

/**
 * Returns script result errors.
 * @param {RootState} state - The redux state.
 * @returns {ScriptResultState["errors"]} Errors for a script result.
 */
const errors = (state: RootState): TSFixMe => state.scriptresult.errors;

/**
 * Returns true if script results have errors
 * @param {RootState} state - Redux state
 * @returns {Boolean} Script results have errors
 */
const hasErrors = createSelector(
  [errors],
  (errors) => Object.entries(errors).length > 0
);

/**
 * Returns script results by machine id
 * @param state - Redux state
 * @returns script results
 */
const getByMachineId = createSelector(
  [
    nodeScriptResultSelectors.byId,
    all,
    (_: RootState, machineId: Machine["system_id"]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineId): ScriptResult[] | null => {
    const ids =
      machineId in nodeScriptResult ? nodeScriptResult[machineId] : [];
    if (ids) {
      return scriptResults.filter((result) => ids.includes(result.id));
    }
    return null;
  }
);

/**
 * Returns hardware testing results (CPU, Memory, Network) by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @returns script results
 */
const getHardwareTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.byId,
    all,
    (_: RootState, machineId: Machine["system_id"]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineId) => {
    const ids =
      machineId in nodeScriptResult ? nodeScriptResult[machineId] : [];
    if (ids) {
      return scriptResults.filter(
        (result) =>
          ids.includes(result.id) &&
          result.result_type === ResultType.Testing &&
          (result.hardware_type === HardwareType.CPU ||
            result.hardware_type === HardwareType.Memory ||
            result.hardware_type === HardwareType.Network)
      );
    }
    return null;
  }
);

/**
 * Returns storage testing results by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @returns script results
 */
const getStorageTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.byId,
    all,
    (_: RootState, machineId: Machine["system_id"]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineId) => {
    const ids =
      machineId in nodeScriptResult ? nodeScriptResult[machineId] : [];
    if (ids) {
      return scriptResults.filter(
        (result) =>
          ids.includes(result.id) &&
          result.result_type === ResultType.Testing &&
          result.hardware_type === HardwareType.Storage
      );
    }
    return null;
  }
);

/**
 * Returns other testing results by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @returns script results
 */
const getOtherTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.byId,
    all,
    (_: RootState, machineId: Machine["system_id"]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineId) => {
    const ids =
      machineId in nodeScriptResult ? nodeScriptResult[machineId] : [];
    if (ids) {
      return scriptResults.filter(
        (result) =>
          ids.includes(result.id) &&
          result.result_type === ResultType.Testing &&
          result.hardware_type === HardwareType.Node
      );
    }
    return null;
  }
);

const scriptResult = {
  all,
  errors,
  hasErrors,
  loaded,
  loading,
  saved,
  getByMachineId,
  getHardwareTestingByMachineId,
  getStorageTestingByMachineId,
  getOtherTestingByMachineId,
};

export default scriptResult;
