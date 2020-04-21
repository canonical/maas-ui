import { createSelector } from "@reduxjs/toolkit";

/**
 * Selector for all possible machine actions.
 */

import { generateGeneralSelector } from "./utils";

const machineActions = generateGeneralSelector("machineActions");

/**
 * An intermediary selector to get and pass params to the selector.
 * @param {Object} state - The redux state.
 * @returns {Array} The provided params.
 */
const getParams = (state, ...params) => [...params];

/**
 * Get a machine action by name.
 * @param {Object} state - The redux state.
 * @param {String} name - The name of a machine action.
 * @returns {Object} A machine action.
 */
machineActions.getByName = createSelector(
  [machineActions.get, getParams],
  (items, [name]) => items.find((item) => item.name === name)
);

export default machineActions;
