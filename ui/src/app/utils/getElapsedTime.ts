import pluralize from "pluralize";

import { timestampToUnix } from "./timestampToUnix";

const oneMinute = 60000;
const oneHour = 3600000;
const oneDay = 86400000;
const oneWeek = 604800000;
const oneMonth = 2592000000;
const oneYear = 31556952000;

/**
 * Converts a MAAS timestamp into a string describing elapsed time.
 * @param timestamp - timestamp in the format "%a, %d %b. %Y %H:%M:%S"
 * @returns how much time has elapsed since the timestamp.
 */
export const getElapsedTime = (timestamp: string | null): string | null => {
  const then = timestampToUnix(timestamp);
  if (then === null) {
    return null;
  }

  const diff = Date.now() - then;

  if (diff < 0) {
    return null;
  }
  if (diff < oneMinute) {
    return "less than a minute ago";
  }
  if (diff < oneHour) {
    return `${pluralize("minute", Math.floor(diff / oneMinute), true)} ago`;
  }
  if (diff < oneDay) {
    return `${pluralize("hour", Math.floor(diff / oneHour), true)} ago`;
  }
  if (diff < oneWeek) {
    return `${pluralize("day", Math.floor(diff / oneDay), true)} ago`;
  }
  if (diff < oneMonth) {
    return `${pluralize("week", Math.floor(diff / oneWeek), true)} ago`;
  }
  if (diff < oneYear) {
    return `${pluralize("month", Math.floor(diff / oneMonth), true)} ago`;
  }
  return `${pluralize("year", Math.floor(diff / oneYear), true)} ago`;
};
