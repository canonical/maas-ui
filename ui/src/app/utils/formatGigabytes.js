/**
 * Format gigabytes with the appropriate unit, e.g GB or TB
 * 
 * @param {Number} valueInGB
 * @returns {String} - The formatted value
 */

function formatGigabytes(valueInGB) {
  const TERABYTE = 1000;
  if (valueInGB < TERABYTE) {
    return `${valueInGB} GB`;
  } else {
    return `${valueInGB / TERABYTE} TB`;
  }
};

export default formatGigabytes;