import { createSelector } from "@reduxjs/toolkit";

import type { Machine } from "../machine/types";
import nodeScriptResultSelectors from "../nodescriptresult/selectors";

import type { ScriptResult } from "./types";

import { HardwareType, ResultType } from "app/base/enum";
import type { TSFixMe } from "app/base/types";
import type { NodeScriptResultState } from "app/store/nodescriptresult/types";
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

const getResult = (
  nodeScriptResult: NodeScriptResultState["items"],
  scriptResults: ScriptResult[],
  machineId: Machine["system_id"],
  resultTypes?: ScriptResult["result_type"][] | null,
  hardwareTypes?: ScriptResult["hardware_type"][] | null
): ScriptResult[] | null => {
  const nodeResultIds =
    machineId in nodeScriptResult ? nodeScriptResult[machineId] : [];
  if (!nodeResultIds.length) {
    return null;
  }
  return scriptResults.filter((scriptResult) => {
    const matchesId = nodeResultIds.includes(scriptResult.id);
    const matchesResult = resultTypes?.length
      ? resultTypes.includes(scriptResult.result_type)
      : true;
    const matchesHardware = hardwareTypes?.length
      ? hardwareTypes.includes(scriptResult.hardware_type)
      : true;
    return matchesId && matchesResult && matchesHardware;
  });
};

/**
 * Returns script results by machine id
 * @param state - Redux state
 * @returns script results
 */
const getByMachineId = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (_: RootState, machineId: Machine["system_id"]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineId): ScriptResult[] | null =>
    getResult(nodeScriptResult, scriptResults, machineId)
);

/**
 * Returns hardware testing results (CPU, Memory, Network) by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @returns script results
 */
const getHardwareTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (_: RootState, machineId: Machine["system_id"]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineId) =>
    getResult(
      nodeScriptResult,
      scriptResults,
      machineId,
      [ResultType.Testing],
      [HardwareType.CPU, HardwareType.Memory, HardwareType.Network]
    )
);

/**
 * Returns storage testing results by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @returns script results
 */
const getStorageTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (_: RootState, machineId: Machine["system_id"]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineId) =>
    getResult(
      nodeScriptResult,
      scriptResults,
      machineId,
      [ResultType.Testing],
      [HardwareType.Storage]
    )
);

/**
 * Returns other testing results by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @returns script results
 */
const getOtherTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (_: RootState, machineId: Machine["system_id"]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineId) =>
    getResult(
      nodeScriptResult,
      scriptResults,
      machineId,
      [ResultType.Testing],
      [HardwareType.Node]
    )
);

type MachineScriptResults = { [x: string]: ScriptResult[] };

/**
 * Returns the testing script results for each of the supplied machine ids.
 * @param state - Redux state.
 * @returns The testing script results for each machine.
 */
const getTestingResultsByMachineIds = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (_: RootState, machineId: Machine["system_id"][]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineIds): MachineScriptResults =>
    (machineIds || []).reduce<MachineScriptResults>((grouped, machineId) => {
      const results = getResult(nodeScriptResult, scriptResults, machineId, [
        ResultType.Testing,
      ]);
      if (results) {
        grouped[machineId] = results;
      }
      return grouped;
    }, {})
);

const scriptResult = {
  all,
  errors,
  getByMachineId,
  getHardwareTestingByMachineId,
  getOtherTestingByMachineId,
  getStorageTestingByMachineId,
  getTestingResultsByMachineIds,
  hasErrors,
  loaded,
  loading,
  saved,
};

export default scriptResult;
