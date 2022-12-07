import { formatDistance, parse } from "date-fns";

export const getTimeDistanceString = (utcTimeString: string): string =>
  formatDistance(
    parse(
      `${utcTimeString} +00`, // let parse fn know it's UTC
      "E, dd LLL. yyyy HH:mm:ss x",
      new Date()
    ),
    new Date(),
    { addSuffix: true }
  );
