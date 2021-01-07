import { getElapsedTime } from "./getElapsedTime";

// Thu, 31 Dec. 2020 11:00:00 UTC
const mockNow = 1609412400000;

describe("getElapsedTime", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(mockNow));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("handles null case", () => {
    expect(getElapsedTime(null)).toBe(null);
  });

  it("handles timestamps after now", () => {
    expect(getElapsedTime("Thu, 31 Dec. 2020 11:00:01")).toBe(null);
  });

  it("handles timestamps less than a minute ago", () => {
    expect(getElapsedTime("Thu, 31 Dec. 2020 10:59:59")).toBe(
      "less than a minute ago"
    );
  });

  it("handles timestamps more than a minute but less than an hour ago", () => {
    expect(getElapsedTime("Thu, 31 Dec. 2020 10:58:59")).toBe("1 minute ago");
  });

  it("handles timestamps more than an hour but less than a day ago", () => {
    expect(getElapsedTime("Thu, 31 Dec. 2020 09:59:59")).toBe("1 hour ago");
  });

  it("handles timestamps more than a day but less than a week ago", () => {
    expect(getElapsedTime("Wed, 30 Dec. 2020 10:59:59")).toBe("1 day ago");
  });

  it("handles timestamps more than a week but less than a month ago", () => {
    expect(getElapsedTime("Thu, 24 Dec. 2020 10:59:59")).toBe("1 week ago");
  });

  it("handles timestamps more than a month but less than a year ago", () => {
    expect(getElapsedTime("Mon, 30 Nov. 2020 10:59:59")).toBe("1 month ago");
  });

  it("handles timestamps more than a year ago", () => {
    expect(getElapsedTime("Thu, 31 Dec. 2019 10:59:59")).toBe("1 year ago");
  });
});
