import type { Duration } from "date-fns";

import type { Minutes, Seconds, TimeSpan } from "app/base/types";

export const timeSpanToDuration = (timeSpan: TimeSpan | null): Duration => {
  if (!timeSpan) {
    return {};
  }
  return {
    hours: Number(timeSpan.match(/([\d]+)\s*(?:hs?|hours?)\s*/)?.[1]),
    minutes: Number(timeSpan.match(/([\d]+)\s*(?:ms?|mins?|minutes?)\s*/)?.[1]),
    seconds: Number(timeSpan.match(/([\d]+)\s*(?:s|secs?|seconds?)\s*/)?.[1]),
  };
};

const durationToSeconds = (duration: Duration): Seconds | null => {
  const multiplier = {
    hours: 3600,
    minutes: 60,
    seconds: 1,
  };
  const total = Object.entries(duration).reduce((total, [key, value]) => {
    if (!value) {
      return total;
    }
    return (total += value * multiplier[key as keyof typeof multiplier]);
  }, 0);
  return total > 0 ? total : null;
};

export const timeSpanToSeconds = (timeSpan: TimeSpan | null): Seconds | null =>
  durationToSeconds(timeSpanToDuration(timeSpan));

export const timeSpanToMinutes = (
  timeSpan: TimeSpan | null
): Minutes | null => {
  const seconds = timeSpanToSeconds(timeSpan);
  if (!seconds) {
    return null;
  }
  return Math.floor(seconds / 60);
};
