import { formatBytes } from "./formatBytes";

/**
 * Format megabytes to an appropriate level of speed.
 * @param {Number} speedInMbytes The value in the supplied megabyte unit.
 * @returns {String} Formatted value and unit.
 */
export const formatSpeedUnits = speedInMbytes => {
  const adjusted = formatBytes(speedInMbytes, "MB", 1);
  return `${adjusted.value} ${adjusted.unit[0]}bps`;
};
