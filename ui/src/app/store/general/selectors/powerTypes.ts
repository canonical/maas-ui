/**
 * Selector for power types.
 */

import { createSelector } from "@reduxjs/toolkit";

import { generateGeneralSelector } from "./utils";
import type { TSFixMe } from "app/base/types";

const powerTypes = generateGeneralSelector("powerTypes");

/**
 * Returns power types that can be used when adding chassis.
 * @param {Object} state - The redux state.
 * @returns {Array} Chassis power types.
 */
powerTypes.chassis = createSelector([powerTypes.get], (powerTypes: TSFixMe) =>
  powerTypes.filter((type: TSFixMe) => type.chassis)
);

export default powerTypes;
