import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  it("correctly formats a value above the unit threshold", () => {
    expect(formatBytes(900, "KB")).toStrictEqual({ value: 900, unit: "KB" });
    expect(formatBytes(1100, "KB")).toStrictEqual({ value: 1.1, unit: "MB" });
  });

  it("correctly formats a value below the unit threshold", () => {
    expect(formatBytes(1, "MB")).toStrictEqual({ value: 1, unit: "MB" });
    expect(formatBytes(0.1, "MB")).toStrictEqual({ value: 100, unit: "KB" });
  });

  it("returns the value to the correct precision", () => {
    expect(formatBytes(1234, "B", { precision: 1 })).toStrictEqual({
      value: 1,
      unit: "KB",
    });
    expect(formatBytes(1234, "B", { precision: 2 })).toStrictEqual({
      value: 1.2,
      unit: "KB",
    });
    expect(formatBytes(1234, "B", { precision: 4 })).toStrictEqual({
      value: 1.234,
      unit: "KB",
    });
    expect(formatBytes(123, "B", { precision: 1 })).toStrictEqual({
      value: 123,
      unit: "B",
    });
    expect(formatBytes(0.123, "KB", { precision: 1 })).toStrictEqual({
      value: 123,
      unit: "B",
    });
  });

  it("can handle binary units", () => {
    expect(formatBytes(0, "B", { binary: true })).toStrictEqual({
      value: 0,
      unit: "B",
    });
    expect(
      formatBytes(1023, "MiB", { binary: true, precision: 4 })
    ).toStrictEqual({
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
    expect(formatBytes(-1234, "GB", { precision: 4 })).toStrictEqual({
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
    expect(formatBytes(1000000, "B", { convertTo: "GB" })).toStrictEqual({
      value: 0.001,
      unit: "GB",
    });
    expect(formatBytes(1000000, "B", { convertTo: "TB" })).toStrictEqual({
      value: 0.000001,
      unit: "TB",
    });
  });
});
