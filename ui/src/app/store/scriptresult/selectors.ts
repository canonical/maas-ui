import { createSelector } from "@reduxjs/toolkit";

import type { Machine } from "../machine/types";
import nodeScriptResultSelectors from "../nodescriptresult/selectors";

import type {
  PartialScriptResult,
  ScriptResult,
  ScriptResultData,
} from "./types";
import { ScriptResultType } from "./types";
import { scriptResultFailed } from "./utils";

import { HardwareType } from "app/base/enum";
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
 * Returns script result history
 * @param {RootState} state - Redux state
 * @returns script history
 */
const history = (
  state: RootState
): Record<ScriptResult["id"], PartialScriptResult[]> =>
  state.scriptresult.history;

/**
 * Returns script result logs
 * @param {RootState} state - Redux state
 * @returns script logs
 */
const logs = (
  state: RootState
): Record<ScriptResult["id"], ScriptResultData> | null =>
  state.scriptresult.logs;

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
  machineId: Machine["system_id"] | null | undefined,
  resultTypes?: ScriptResult["result_type"][] | null,
  hardwareTypes?: ScriptResult["hardware_type"][] | null
): ScriptResult[] | null => {
  if (!machineId) {
    return null;
  }
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

const getFailed = (results: ScriptResult[] | null): ScriptResult[] | null => {
  if (results) {
    // Filter for only the failed results.
    return results.filter(({ status }) => scriptResultFailed(status));
  }
  return results;
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
 * @param failed - Whether to filter by the failed results.
 * @returns script results
 */
const getHardwareTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (
      _: RootState,
      machineId: Machine["system_id"] | null | undefined,
      failed?: boolean
    ) => ({
      failed,
      machineId,
    }),
  ],
  (nodeScriptResult, scriptResults, { failed, machineId }) => {
    const results = getResult(
      nodeScriptResult,
      scriptResults,
      machineId,
      [ScriptResultType.TESTING],
      [HardwareType.CPU, HardwareType.Memory, HardwareType.Network]
    );
    if (failed) {
      return getFailed(results);
    }
    return results;
  }
);

/**
 * Returns commissioning testing results (CPU, Memory, Network) by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @param failed - Whether to filter by the failed results.
 * @returns script results
 */
const getCommissioningByMachineId = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (
      _: RootState,
      machineId: Machine["system_id"] | null | undefined,
      failed?: boolean
    ) => ({
      failed,
      machineId,
    }),
  ],
  (nodeScriptResult, scriptResults, { failed, machineId }) => {
    const results = getResult(
      nodeScriptResult,
      scriptResults,
      machineId,
      [ScriptResultType.COMMISSIONING],
      [HardwareType.Node]
    );
    if (failed) {
      return getFailed(results);
    }
    return results;
  }
);

/**
 * Returns network testing results by machine id.
 * @param state - Redux state.
 * @param machineId - Machine system id.
 * @param failed - Whether to filter by the failed results.
 * @returns Network testing script results.
 */
const getNetworkTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (
      _: RootState,
      machineId: Machine["system_id"] | null | undefined,
      failed?: boolean
    ) => ({
      failed,
      machineId,
    }),
  ],
  (nodeScriptResult, scriptResults, { failed, machineId }) => {
    const results = getResult(
      nodeScriptResult,
      scriptResults,
      machineId,
      [ScriptResultType.TESTING],
      [HardwareType.Network]
    );
    if (failed) {
      return getFailed(results);
    }
    return results;
  }
);

/**
 * Returns storage testing results by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @param failed - Whether to filter by the failed results.
 * @returns script results
 */
const getStorageTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (
      _: RootState,
      machineId: Machine["system_id"] | null | undefined,
      failed?: boolean
    ) => ({
      failed,
      machineId,
    }),
  ],
  (nodeScriptResult, scriptResults, { failed, machineId }) => {
    const results = getResult(
      nodeScriptResult,
      scriptResults,
      machineId,
      [ScriptResultType.TESTING],
      [HardwareType.Storage]
    );
    if (failed) {
      return getFailed(results);
    }
    return results;
  }
);

/**
 * Returns other testing results by machine id
 * @param state - Redux state
 * @param machineId - machine system id
 * @param failed - Whether to filter by the failed results.
 * @returns script results
 */
const getOtherTestingByMachineId = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (
      _: RootState,
      machineId: Machine["system_id"] | null | undefined,
      failed?: boolean
    ) => ({
      failed,
      machineId,
    }),
  ],
  (nodeScriptResult, scriptResults, { failed, machineId }) => {
    const results = getResult(
      nodeScriptResult,
      scriptResults,
      machineId,
      [ScriptResultType.TESTING],
      [HardwareType.Node]
    );
    if (failed) {
      return getFailed(results);
    }
    return results;
  }
);

type MachineScriptResults = { [x: string]: ScriptResult[] };

/**
 * Returns the failed testing script results for each of the supplied machine ids.
 * @param state - Redux state.
 * @returns Failed testing script results for each machine.
 */
const getFailedTestingResultsByMachineIds = createSelector(
  [
    nodeScriptResultSelectors.all,
    all,
    (_: RootState, machineId: Machine["system_id"][]) => machineId,
  ],
  (nodeScriptResult, scriptResults, machineIds): MachineScriptResults =>
    (machineIds || []).reduce<MachineScriptResults>((grouped, machineId) => {
      let results = getResult(nodeScriptResult, scriptResults, machineId, [
        ScriptResultType.TESTING,
      ]);
      results = getFailed(results);
      if (results) {
        grouped[machineId] = results;
      }
      return grouped;
    }, {})
);

const getHistoryById = createSelector(
  [
    history,
    (_: RootState, scriptResultId: ScriptResult["id"]) => scriptResultId,
  ],
  (history, scriptResultId) => {
    if (scriptResultId in history) {
      return history[scriptResultId];
    }
    return null;
  }
);

const scriptResult = {
  all,
  errors,
  getByMachineId,
  getCommissioningByMachineId,
  getFailedTestingResultsByMachineIds,
  getHardwareTestingByMachineId,
  getHistoryById,
  getNetworkTestingByMachineId,
  getOtherTestingByMachineId,
  getStorageTestingByMachineId,
  hasErrors,
  history,
  loaded,
  loading,
  logs,
  saved,
};

export default scriptResult;
