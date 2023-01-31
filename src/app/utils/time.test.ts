import MockDate from "mockdate";
import timezoneMock from "timezone-mock";

import { formatUtcDatetime, getTimeDistanceString } from "./time";

beforeEach(() => {
  MockDate.set("Fri, 18 Nov. 2022 01:01:00");
});

afterEach(() => {
  MockDate.reset();
});

describe("getTimeDistanceString", () => {
  it("returns time distance for UTC TimeString in the past", () => {
    expect(getTimeDistanceString("Fri, 18 Nov. 2022 01:00:50")).toEqual(
      "less than a minute ago"
    );
  });
  it("returns time distance for UTC TimeString in the future", () => {
    expect(getTimeDistanceString("Fri, 18 Nov. 2022 01:01:10")).toEqual(
      "in less than a minute"
    );
  });
});

describe("formatUtcDatetime", () => {
  it("returns UTC date time in a correct format", () => {
    expect(formatUtcDatetime("Fri, 18 Nov. 2022 01:00:50")).toEqual(
      "Fri, 18 Nov. 2022 01:00:50"
    );
  });
  it("returns UTC date time in local time", () => {
    timezoneMock.register("Etc/GMT-1");
    expect(formatUtcDatetime("Fri, 18 Nov. 2022 03:00:00")).toEqual(
      "Fri, 18 Nov. 2022 04:00:00"
    );
  });
});
