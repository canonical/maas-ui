import { createSelector } from "@reduxjs/toolkit";

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
  [machineActions.get, (state, name) => name],
  (actions, name) => actions.find((action) => action.name === name)
);

export default machineActions;
