import type { Host } from "app/store/host/types";
import { isMachine } from "app/store/utils";

/**
 * Returns the correct icon given a host's power status.
 * @param {Host} host - a machine or controller.
 * @param {boolean} loading - whether the data is still loading.
 * @returns {string} icon class
 */
export const getPowerIcon = (host?: Host, loading?: boolean): string => {
  if (loading && !host) {
    return "p-icon--spinner u-animation--spin";
  }
  if (host && isMachine(host)) {
    return `p-icon--power-${host.power_state}`;
  }
  return "p-icon--power-unknown";
};
