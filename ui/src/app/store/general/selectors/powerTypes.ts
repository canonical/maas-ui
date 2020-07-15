/**
 * Selector for power types.
 */

import { createSelector } from "@reduxjs/toolkit";

import { generateGeneralSelector } from "./utils";

const generalSelectors = generateGeneralSelector<"powerTypes">("powerTypes");

/**
 * Returns power types that can be used when adding chassis.
 * @param {RootState} state - The redux state.
 * @returns {PowerType[]} Chassis power types.
 */
const chassis = createSelector([generalSelectors.get], (powerTypes) =>
  powerTypes.filter((type) => type.chassis)
);

const powerTypes = {
  ...generalSelectors,
  chassis,
};

export default powerTypes;
