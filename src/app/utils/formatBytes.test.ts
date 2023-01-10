import { formatBytes, sizeStringToNumber } from "./formatBytes";

describe("formatBytes", () => {
  it("correctly formats a value above the unit threshold", () => {
    expect(formatBytes(900, "KB")).toStrictEqual({ value: 900, unit: "KB" });
    expect(formatBytes(1100, "KB")).toStrictEqual({ value: 1.1, unit: "MB" });
  });

  it("correctly formats a value below the unit threshold", () => {
    expect(formatBytes(1, "MB")).toStrictEqual({ value: 1, unit: "MB" });
    expect(formatBytes(0.1, "MB")).toStrictEqual({ value: 100, unit: "KB" });
  });

  it("rounds the value to 2 decimal places by default", () => {
    expect(formatBytes(1234, "B")).toStrictEqual({
      value: 1.23,
      unit: "KB",
    });
    expect(formatBytes(1236, "B")).toStrictEqual({
      value: 1.24,
      unit: "KB",
    });
  });

  it("can round to different decimal places", () => {
    expect(formatBytes(1234, "B", { decimals: 0 })).toStrictEqual({
      value: 1,
      unit: "KB",
    });
    expect(formatBytes(1234, "B", { decimals: 1 })).toStrictEqual({
      value: 1.2,
      unit: "KB",
    });
    expect(formatBytes(1234, "B", { decimals: 2 })).toStrictEqual({
      value: 1.23,
      unit: "KB",
    });
    expect(formatBytes(1234, "B", { decimals: 3 })).toStrictEqual({
      value: 1.234,
      unit: "KB",
    });
  });

  it("can be forced to round result down", () => {
    expect(formatBytes(1236, "B", { roundFunc: "floor" })).toStrictEqual({
      value: 1.23,
      unit: "KB",
    });
  });

  it("can be forced to round result up", () => {
    expect(formatBytes(1234, "B", { roundFunc: "ceil" })).toStrictEqual({
      value: 1.24,
      unit: "KB",
    });
  });

  it("can handle binary units", () => {
    expect(formatBytes(0, "B", { binary: true })).toStrictEqual({
      value: 0,
      unit: "B",
    });
    expect(formatBytes(1023, "MiB", { binary: true })).toStrictEqual({
      value: 1023,
      unit: "MiB",
    });
    expect(formatBytes(1024, "MiB", { binary: true })).toStrictEqual({
      value: 1,
      unit: "GiB",
    });
  });

  it("can handle negative numbers", () => {
    expect(formatBytes(-1, "B")).toStrictEqual({
      value: -1,
      unit: "B",
    });
    expect(formatBytes(-2000, "MB")).toStrictEqual({
      value: -2,
      unit: "GB",
    });
    expect(formatBytes(-1234, "GB", { decimals: 3 })).toStrictEqual({
      value: -1.234,
      unit: "TB",
    });
    expect(formatBytes(-1024, "MiB", { binary: true })).toStrictEqual({
      value: -1,
      unit: "GiB",
    });
  });

  it("can convert to a specific unit", () => {
    expect(formatBytes(1000000, "B", { convertTo: "B" })).toStrictEqual({
      value: 1000000,
      unit: "B",
    });
    expect(formatBytes(1000000, "B", { convertTo: "KB" })).toStrictEqual({
      value: 1000,
      unit: "KB",
    });
    expect(formatBytes(1000000, "B", { convertTo: "MB" })).toStrictEqual({
      value: 1,
      unit: "MB",
    });
    expect(
      formatBytes(1000000, "B", { convertTo: "GB", decimals: 3 })
    ).toStrictEqual({
      value: 0.001,
      unit: "GB",
    });
    expect(
      formatBytes(1000000, "B", { convertTo: "TB", decimals: 6 })
    ).toStrictEqual({
      value: 0.000001,
      unit: "TB",
    });
  });
});

describe("sizeStringToNumber", () => {
  it("can convert a size string to a number of bytes", () => {
    expect(sizeStringToNumber("1 B")).toBe(1);
    expect(sizeStringToNumber("1 KB")).toBe(1000);
    expect(sizeStringToNumber("1 GB")).toBe(1000000000);
  });

  it("ignores extra whitespace characters", () => {
    expect(sizeStringToNumber(" 1  B ")).toBe(1);
  });

  it("returns null for an invalid size string parameter", () => {
    expect(sizeStringToNumber("")).toBe(null);
    expect(sizeStringToNumber()).toBe(null);
    expect(sizeStringToNumber("1MB")).toBe(null);
  });
});
