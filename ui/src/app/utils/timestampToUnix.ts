const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Converts a MAAS timestamp to unix time.
 * @param timestamp - timestamp in the format "%a, %d %b. %Y %H:%M:%S"
 * @returns unix time in ms
 */
export const timestampToUnix = (timestamp: string | null): number | null => {
  if (!timestamp) {
    return null;
  }

  const split = timestamp.split(/[ ,.:]+/);
  if (split.length !== 7) {
    return null;
  }

  const month = months.findIndex((m) => m === split[2]);
  if (month === -1) {
    return null;
  }

  const year = Number(split[3]);
  const day = Number(split[1]);
  const hour = Number(split[4]);
  const minute = Number(split[5]);
  const second = Number(split[6]);

  return Date.UTC(year, month, day, hour, minute, second);
};
