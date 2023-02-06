import { format, formatDistance, parse } from "date-fns";

const DATETIME_FORMAT = "E, dd LLL. yyyy HH:mm:ss";
const UTC_DATETIME_FORMAT = `${DATETIME_FORMAT} x`;

export const parseUtcDatetime = (utcTimeString: string): Date =>
  parse(
    `${utcTimeString} +00`, // let parse fn know it's UTC
    UTC_DATETIME_FORMAT,
    new Date()
  );

export const getTimeDistanceString = (utcTimeString: string): string =>
  formatDistance(parseUtcDatetime(utcTimeString), new Date(), {
    addSuffix: true,
  });

/**
 * @param utcTimeString - time string in UTC_DATETIME_FORMAT
 * @returns time string adjusted for local time zone in DATETIME_FORMAT
 */
export const formatUtcDatetime = (utcTimeString: string): string =>
  format(parseUtcDatetime(utcTimeString), DATETIME_FORMAT);
