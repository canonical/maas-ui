import MockDate from "mockdate";

import { getTimeDistanceString } from "./time";

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
