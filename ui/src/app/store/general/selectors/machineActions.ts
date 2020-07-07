import { createSelector } from "@reduxjs/toolkit";

import type { MachineAction } from "app/store/general/types";
import type { RootState } from "app/store/root/types";

/**
 * Selector for all possible machine actions.
 */

import { generateGeneralSelector } from "./utils";

const machineActions = generateGeneralSelector("machineActions");

/**
 * Get a machine action by name.
 * @param {Object} state - The redux state.
 * @param {String} name - The name of a machine action.
 * @returns {Object} A machine action.
 */
machineActions.getByName = createSelector(
  [
    machineActions.get,
    (_state: RootState, name: MachineAction["name"]) => name,
  ],
  (actions: MachineAction[], name) =>
    actions.find((action: MachineAction) => action.name === name)
);

export default machineActions;
