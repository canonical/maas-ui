import { Machine } from "app/base/types";

/**
 * Returns the correct icon given a machine's power status.
 * @param {Machine} machine - the machine who's power you are checking.
 * @param {boolean} loading - whether the data is still loading.
 * @returns {string} icon class
 */
export const getPowerIcon = (machine?: Machine, loading?: boolean): string => {
  if (loading && !machine) {
    return "p-icon--spinner u-animation--spin";
  }
  if (machine && machine.power_state) {
    return `p-icon--power-${machine.power_state}`;
  }
  return "p-icon--power-unknown";
};
