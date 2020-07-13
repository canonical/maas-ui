/**
 * Selector for power types.
 */

import { createSelector } from "@reduxjs/toolkit";

import { generateGeneralSelector } from "./utils";
import type { PowerType } from "app/store/general/types";

const generalSelectors = generateGeneralSelector<PowerType[]>("powerTypes");

/**
 * Returns power types that can be used when adding chassis.
 * @param {Object} state - The redux state.
 * @returns {Array} Chassis power types.
 */
const chassis = createSelector([generalSelectors.get], (powerTypes) =>
  powerTypes.filter((type) => type.chassis)
);

const powerTypes = {
  ...generalSelectors,
  chassis,
};

export default powerTypes;
