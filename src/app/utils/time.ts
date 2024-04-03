import { format, formatDistance, parse } from "date-fns";

import type { UtcTimestamp } from "@/app/store/types/model";

const DATETIME_FORMAT = "E, dd LLL. yyyy HH:mm:ss";
const UTC_DATETIME_FORMAT = `${DATETIME_FORMAT} x`;

export const parseUtcDatetime = (utcTimeString: UtcTimestamp): Date =>
  parse(
    `${utcTimeString} +00`, // let parse fn know it's UTC
    UTC_DATETIME_FORMAT,
    new Date()
  );

export const getTimeDistanceString = (utcTimeString: UtcTimestamp): string =>
  formatDistance(parseUtcDatetime(utcTimeString), new Date(), {
    addSuffix: true,
  });

/**
 * Appends "(UTC)" to a given string to indicate the time zone explicitly.
 * @param utcTimeString - time string in UTC
 * @returns Time string with appended "(UTC)"
 */
export const getUtcTimestamp = (utcTimeString?: UtcTimestamp): string =>
  utcTimeString ? utcTimeString + " (UTC)" : "";

/**
 * Formats a given UTC time string into a more readable format and appends "(UTC)" to indicate the time zone explicitly.
 * It converts the time string from "E, dd LLL. yyyy HH:mm:ss" format to "yyyy-LL-dd H:mm" format.
 * @param utcTimeString - time string in UTC to be formatted
 * @returns Formatted time string with appended "(UTC)"
 */
export const formatUtcTimestamp = (utcTimeString?: UtcTimestamp): string =>
  utcTimeString
    ? format(
        parse(utcTimeString, "E, dd LLL. yyyy HH:mm:ss", new Date()),
        "yyyy-LL-dd H:mm"
      ) + " (UTC)"
    : "";
