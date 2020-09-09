/**
 * Selector for power types.
 */

import { createSelector } from "@reduxjs/toolkit";

import { generateGeneralSelector } from "./utils";

// List of power types that can be used with the add_chassis http method.
// MAAS 2.9 handles this via the api but for 2.8 it has to be hardcoded.
const ADD_CHASSIS_POWER_TYPES = [
  "mscm",
  "msftocs",
  "powerkvm",
  "recs_box",
  "seamicro15k",
  "ucsm",
  "virsh",
  "vmware",
];

const powerTypes = generateGeneralSelector("powerTypes");

/**
 * Returns power types that can be used when adding chassis.
 * @param {Object} state - The redux state.
 * @returns {Array} Chassis power types.
 */
powerTypes.canProbe = createSelector([powerTypes.get], (powerTypes) =>
  powerTypes.filter((type) => ADD_CHASSIS_POWER_TYPES.includes(type.name))
);

export default powerTypes;
