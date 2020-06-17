type Byte = { value: number; unit: string };

type FormatBytesConfig = { binary?: boolean; precision?: number };

/**
 * Format bytes to the appropriate unit at supplied precision.
 *
 * @param {number} value - the value in the supplied byte unit
 * @param {string} unit - the byte unit, e.g. "KB", "TB"
 * @param {object} config - config object
 * @param {boolean} config.binary - whether formatting should be done in base 10 or 2
 * @param {number} config.precision - significant figures of returned value
 * @returns {Byte} formatted value and byte unit object
 */

export const formatBytes = (
  value: number,
  unit: string,
  { binary = false, precision = 2 }: FormatBytesConfig = {}
): Byte => {
  const negative = value < 0;
  const parsedValue = Math.abs(value);
  if (parsedValue === 0) {
    return { value: 0, unit: "B" };
  }
  const k = binary ? 1024 : 1000;
  const sizes = binary
    ? ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
    : ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  // Convert to bytes.
  const i = sizes.findIndex((size) => size === unit) || 0;
  const valueInBytes = parsedValue * Math.pow(k, i);

  // Convert to appropriate unit.
  const j = Math.floor(Math.log(valueInBytes) / Math.log(k));
  const valueInUnit = parseFloat(
    (valueInBytes / Math.pow(k, j)).toFixed(precision - 1)
  );

  return {
    value: negative ? -valueInUnit : valueInUnit,
    unit: sizes[j],
  };
};
