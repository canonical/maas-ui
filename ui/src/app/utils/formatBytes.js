/**
 * Format bytes to the appropriate unit at supplied precision.
 *
 * @param {number} value - the value in the supplied byte unit
 * @param {string} unit - the byte unit, e.g. "KB", "TB"
 * @param {number} precision - significant figures of returned value
 * @returns {object} formatted value and unit object
 */

export const formatBytes = (value, unit, precision = 3) => {
  const parsedValue = parseFloat(value);
  if (parsedValue === 0) {
    return { value: 0, unit: "B" };
  }
  const k = 1000;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  // Convert to bytes.
  const i = sizes.findIndex(size => size === unit) || 0;
  const valueInBytes = parsedValue * Math.pow(k, i);

  // Convert to appropriate unit.
  const j = Math.floor(Math.log(valueInBytes) / Math.log(k));
  const valueInUnit = parseFloat(
    (valueInBytes / Math.pow(k, j)).toFixed(precision - 1)
  );

  return {
    value: valueInUnit,
    unit: sizes[j]
  };
};
