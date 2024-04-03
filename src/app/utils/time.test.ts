import MockDate from "mockdate";
import timezoneMock from "timezone-mock";

import {
  formatUtcTimestamp,
  getTimeDistanceString,
  getUtcTimestamp,
} from "./time";

import type { UtcTimestamp } from "@/app/store/types/model";
import * as factory from "@/testing/factories";

beforeEach(() => {
  MockDate.set("Fri, 18 Nov. 2022 01:01:00");
});

afterEach(() => {
  MockDate.reset();
});

describe("getTimeDistanceString", () => {
  it("returns time distance for UTC TimeString in the past", () => {
    expect(
      getTimeDistanceString("Fri, 18 Nov. 2022 01:00:50" as UtcTimestamp)
    ).toEqual("less than a minute ago");
  });
  it("returns time distance for UTC TimeString in the future", () => {
    expect(
      getTimeDistanceString("Fri, 18 Nov. 2022 01:01:10" as UtcTimestamp)
    ).toEqual("in less than a minute");
  });
});

describe("formatUtcTimestamp", () => {
  it("returns UTC date time in a correct format", () => {
    expect(
      formatUtcTimestamp("Fri, 18 Nov. 2022 01:00:50" as UtcTimestamp)
    ).toEqual("Fri, 18 Nov. 2022 01:00:50");
  });
  it("returns UTC date time in local time", () => {
    timezoneMock.register("Etc/GMT-1");
    expect(
      formatUtcTimestamp("Fri, 18 Nov. 2022 03:00:00" as UtcTimestamp)
    ).toEqual("Fri, 18 Nov. 2022 04:00:00");
  });
});

describe("getUtcTimestamp", () => {
  it("appends (UTC) to the given time string", () => {
    const inputTimeString = "Fri, 18 Nov. 2022 01:00:50" as UtcTimestamp;
    const expectedOutput = "Fri, 18 Nov. 2022 01:00:50 (UTC)";
    expect(getUtcTimestamp(inputTimeString)).toEqual(expectedOutput);
  });

  it("works with different date formats", () => {
    const inputTimeString = factory.timestamp("2022-11-18T01:00:50Z");
    const expectedOutput = "2022-11-18T01:00:50Z (UTC)";
    expect(getUtcTimestamp(inputTimeString)).toEqual(expectedOutput);
  });
});
