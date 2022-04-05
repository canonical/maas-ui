import {
  formatTimeSpanStringToMinutes,
  formatTimeSpanStringToSeconds,
} from "./utils";

describe("formatTimeSpanStringToSeconds", () => {
  it("converts a partial timespan string to a number of seconds", () => {
    expect(formatTimeSpanStringToSeconds("60s")).toEqual(60);
    expect(formatTimeSpanStringToSeconds("1m")).toEqual(60);
    expect(formatTimeSpanStringToSeconds("1h")).toEqual(3600);
  });

  it("converts a timespan string in different formats to a number of seconds", () => {
    expect(formatTimeSpanStringToSeconds("1hour 1minute 1second")).toEqual(
      3661
    );
    expect(formatTimeSpanStringToSeconds("1hours 1minutes 1seconds")).toEqual(
      3661
    );
    expect(formatTimeSpanStringToSeconds("1hs 1ms 1s")).toEqual(3661);
    expect(formatTimeSpanStringToSeconds("1h1m1s")).toEqual(3661);
  });

  it("returns null for a timespan string in an invalid format", () => {
    expect(formatTimeSpanStringToSeconds("1")).toEqual(null);
    expect(formatTimeSpanStringToSeconds("s")).toEqual(null);
  });
});

describe("formatTimeSpanStringToMinutes", () => {
  it("converts a partial timespan string to a number of minutes", () => {
    expect(formatTimeSpanStringToMinutes("1s")).toEqual(0);
    expect(formatTimeSpanStringToMinutes("59s")).toEqual(0);
    expect(formatTimeSpanStringToMinutes("60s")).toEqual(1);
  });
});
