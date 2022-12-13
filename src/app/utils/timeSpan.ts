import type { Duration } from "date-fns";
import {
  add,
  differenceInSeconds,
  secondsToMinutes,
  differenceInDays,
} from "date-fns";

import type { Minutes, Seconds, TimeSpan, Days } from "app/base/types";

export const timeSpanToDuration = (timeSpan: TimeSpan | null): Duration => {
  if (!timeSpan) {
    return {};
  }
  return {
    hours:
      Number(timeSpan.match(/([\d]+)\s*(?:hs?|hours?)\s*/)?.[1]) || undefined,
    minutes:
      Number(timeSpan.match(/([\d]+)\s*(?:ms?|mins?|minutes?)\s*/)?.[1]) ||
      undefined,
    seconds:
      Number(timeSpan.match(/([\d]+)\s*(?:s|secs?|seconds?)\s*/)?.[1]) ||
      undefined,
  };
};

export const durationToSeconds = (duration: Duration): Seconds => {
  const now = new Date();
  return differenceInSeconds(add(now, duration), now);
};

const durationToMinutes = (duration: Duration): Minutes => {
  const now = new Date();
  return secondsToMinutes(differenceInSeconds(add(now, duration), now));
};

export const timeSpanToSeconds = (timeSpan: TimeSpan | null): Seconds =>
  durationToSeconds(timeSpanToDuration(timeSpan));

export const timeSpanToMinutes = (timeSpan: TimeSpan | null): Minutes =>
  durationToMinutes(timeSpanToDuration(timeSpan));

export const durationToDays = (duration: Duration): Days => {
  const now = new Date();
  return differenceInDays(add(now, duration), now);
};
