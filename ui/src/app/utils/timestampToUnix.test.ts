import { timestampToUnix } from "./timestampToUnix";

describe("timestampToUnix", () => {
  it("returns a timestamp in unix time", () => {
    expect(timestampToUnix("Thu, 01 Jan. 1970 00:00:00")).toBe(0);
    expect(timestampToUnix("Thu, 31 Dec. 2020 11:00:00")).toBe(1609412400000);
  });

  it("handles incorrectly formatted timestamps", () => {
    expect(timestampToUnix("January 1st 1970")).toBe(null);
    expect(timestampToUnix("01/01/1970")).toBe(null);
    expect(timestampToUnix("01-01-1970")).toBe(null);
  });
});
