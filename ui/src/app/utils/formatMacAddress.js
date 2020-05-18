/**
 * Formats a string into a valid MAC address as its being typed into an input.
 *
 * @param {String} value - original MAC address
 * @returns {String} formatted MAC address
 */

export const formatMacAddress = (value) => {
  const hexValues = value.replace(/:/g, "");
  if (value.length % 3 === 0) {
    return hexValues.replace(/([0-9A-Za-z]{2})/g, "$1:").substring(0, 17);
  }
  return value.substring(0, 17);
};
