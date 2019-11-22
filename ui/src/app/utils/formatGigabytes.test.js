import formatGigabytes from "./formatGigabytes";

describe("formatGigbytes", () => {
  it("returns value with GB unit if less than 1000", () => {
    expect(formatGigabytes(0)).toBe("0 GB");
    expect(formatGigabytes(1)).toBe("1 GB");
    expect(formatGigabytes(20.5)).toBe("20.5 GB");
    expect(formatGigabytes(999)).toBe("999 GB");
  });

  it("returns value with TB unit if more than 1000", () => {
    expect(formatGigabytes(1000)).toBe("1 TB");
    expect(formatGigabytes(1500)).toBe("1.5 TB");
    expect(formatGigabytes(10000)).toBe("10 TB");
  });
});